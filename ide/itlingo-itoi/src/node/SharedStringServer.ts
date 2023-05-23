//Nos queremos agarrar no text change events e enviar isso para cada user
//Cada user terá o ficheiro no workspace 
//e vai recebendo alterações directamente de outros users para o seu ficheiro

//O server vai ser uma queue que cada cliente 
//vai guardando o ultimo ID do evento que já recebeu

// SharedMap
// uuid para a sessao com um SharedSequence
// uuid+chat para a sessão com chat

import { SequenceDeltaEvent, SharedString } from 'fluid-framework'
import { MergeTreeDeltaType, TextSegment } from "@fluidframework/merge-tree";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";
import { JsonRpcServer } from '@theia/core';
import { injectable } from '@theia/core/shared/inversify';

const connectedClients: Set<string> = new Set<string>();

const containerSchema = {
    initialObjects: { sessionString: SharedString },
};

export interface SharedStringClient {
    onGreet(greetings: string): void;
    onSharedStringChange(type: string, position: number, text: string): void;
}
export const SharedStringServer = Symbol("SharedStringServer");
export interface SharedStringServer extends JsonRpcServer<SharedStringClient> {
    greet(greetings: string): void;
    startCollab(document: string): Promise<string>;
    getDocumentChange(text: string, rangeOffset: number, rangeLength: number): void;
    joinCollab(id: string): Promise<string>;
    getGreeterName(): Promise<string>;
}


@injectable()
export class SharedStringServerNode implements SharedStringServer {

  client: SharedStringClient | undefined;
  clientTiny = new TinyliciousClient();
  sharedString : SharedString;

  async getGreeterName(): Promise<string> {
    return "SharedStringServerNode";
  }

  greet(greetings: string): void {
    this.client?.onGreet(greetings);
  }

  async joinCollab(id: string): Promise<string> {
    const { container } = await this.clientTiny.getContainer(id, containerSchema);
    this.sharedString = container.initialObjects.sessionString as SharedString;

    this.sharedString.on("sequenceDelta", (ev: SequenceDeltaEvent) => {
      console.log("fired sharedString change: " + ev.isLocal);
      if (ev.isLocal) {
          return;
      }

      try {
          for (const range of ev.ranges) {
              const segment = range.segment;
              if (TextSegment.is(segment)) {
                  switch (range.operation) {
                      case MergeTreeDeltaType.INSERT: {
                        this.client?.onSharedStringChange("insert", range.position, segment.text);
                          break;
                      }
                      case MergeTreeDeltaType.REMOVE: {
                        this.client?.onSharedStringChange("remove", range.position, segment.text);
                      break;
                      }
                      default:
                          break;
                  }
              }
          }
      } finally {
          //ignoreModelContentChanges = false;
      }
    });
    return this.sharedString.getText();
  }

  async startCollab(document: string){
    console.log("startCollab");
    console.log(document);
    const { container } = await this.clientTiny.createContainer(containerSchema);
    this.sharedString = container.initialObjects.sessionString as SharedString;
    this.sharedString.insertText(0,document);
    const id = await container.attach();
    connectedClients.add(id);

    this.sharedString.on("sequenceDelta", (ev: SequenceDeltaEvent) => {
      console.log("fired sharedString change: " + ev.isLocal);
      if (ev.isLocal) {
          return;
      }

      try {
          for (const range of ev.ranges) {
              const segment = range.segment;
              if (TextSegment.is(segment)) {
                  switch (range.operation) {
                      case MergeTreeDeltaType.INSERT: {
                        this.client?.onSharedStringChange("insert", range.position, segment.text);
                          break;
                      }
                      case MergeTreeDeltaType.REMOVE: {
                        this.client?.onSharedStringChange("remove", range.position, segment.text);
                      break;
                      }
                      default:
                          break;
                  }
              }
          }
      } finally {
          //ignoreModelContentChanges = false;
      }
  });



    console.log("got document");
    console.log(this.sharedString.getText());
    return id;
  }


    getDocumentChange(text: string, rangeOffset: number, rangeLength: number): void {
        if (text) {
            if (rangeLength === 0) {
                this.sharedString.insertText(rangeOffset, text);
            } else {
                this.sharedString.replaceText(
                    rangeOffset,
                    rangeOffset + rangeLength,
                    text,
                );
            }
        } else {
            this.sharedString.removeText(
                rangeOffset,
                rangeOffset + rangeLength,
            );
        }
        console.log("got document change");
        console.log(this.sharedString.getText());
    }





    getClient?(): SharedStringClient | undefined {
        return this.client;
    }
  dispose(): void {}

  setClient(client: SharedStringClient | undefined): void {
    this.client = client;
  }
}


export class SharedServer {
    //Start Collaboration
    // async startCollabSession(editorText: string){
    //     const { container } = await client.createContainer(containerSchema);
    //     //let sessionid = randomUUID();
    //     (container.initialObjects.sessionMap as SharedString).insertText(0,editorText);
    //     const id = await container.attach();
    //     return id;
    // }



    // codeEditor.onDidChangeModelContent((e) => {
    //     // eslint-disable-next-line @typescript-eslint/no-floating-promises
    //     monaco.languages.typescript.getTypeScriptWorker().then(async (worker) => {
    //         await worker(codeModel.uri).then(async (client) => {
    //             await client.getEmitOutput(codeModel.uri.toString()).then((r) => {
    //                 outputModel.setValue(r.outputFiles[0].text);
    //             });
    //         });
    //     });

    //     if (ignoreModelContentChanges) {
    //         return;
    //     }

    //     for (const change of e.changes) {
    //         if (change.text) {
    //             if (change.rangeLength === 0) {
    //                 sharedString.insertText(change.rangeOffset, change.text);
    //             } else {
    //                 sharedString.replaceText(
    //                     change.rangeOffset,
    //                     change.rangeOffset + change.rangeLength,
    //                     change.text,
    //                 );
    //             }
    //         } else {
    //             sharedString.removeText(
    //                 change.rangeOffset,
    //                 change.rangeOffset + change.rangeLength,
    //             );
    //         }
    //     }
    // });

    // sharedString.on("sequenceDelta", (ev: SequenceDeltaEvent) => {
    //     if (ev.isLocal) {
    //         return;
    //     }

    //     try {
    //         // Attempt to merge the ranges
    //         ignoreModelContentChanges = true;

    //         /**
    //          * Translate the offsets used by the MergeTree into a Range that is
    //          * interpretable by Monaco.
    //          * @param offset1 - Starting offset
    //          * @param offset2 - Ending offset
    //          */
    //         const offsetsToRange = (offset1: number, offset2?: number): monaco.Range => {
    //             const pos1 = codeModel.getPositionAt(offset1);
    //             const pos2 =
    //                 typeof offset2 === "number" ? codeModel.getPositionAt(offset2) : pos1;
    //             const range = new monaco.Range(
    //                 pos1.lineNumber,
    //                 pos1.column,
    //                 pos2.lineNumber,
    //                 pos2.column,
    //             );
    //             return range;
    //         };

    //         for (const range of ev.ranges) {
    //             const segment = range.segment;
    //             if (TextSegment.is(segment)) {
    //                 switch (range.operation) {
    //                     case MergeTreeDeltaType.INSERT: {
    //                         const posRange = offsetsToRange(range.position);
    //                         const text = segment.text || "";
    //                         codeEditor.executeEdits("remote", [{ range: posRange, text }]);
    //                         break;
    //                     }

    //                     case MergeTreeDeltaType.REMOVE: {
    //                         const posRange = offsetsToRange(
    //                             range.position,
    //                             range.position + segment.text.length,
    //                         );
    //                         const text = "";
    //                         codeEditor.executeEdits("remote", [{ range: posRange, text }]);
    //                         break;
    //                     }

    //                     default:
    //                         break;
    //                 }
    //             }
    //         }
    //     } finally {
    //         ignoreModelContentChanges = false;
    //     }
    // });



    //Join Collaboration

    //Stop Collaboration
}
