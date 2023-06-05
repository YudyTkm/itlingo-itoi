//Nos queremos agarrar no text change events e enviar isso para cada user
//Cada user terá o ficheiro no workspace 
//e vai recebendo alterações directamente de outros users para o seu ficheiro

//O server vai ser uma queue que cada cliente 
//vai guardando o ultimo ID do evento que já recebeu

// SharedMap
// uuid para a sessao com um SharedSequence
// uuid+chat para a sessão com chat

// import { SequenceDeltaEvent, SharedString } from 'fluid-framework'
// import { MergeTreeDeltaType, TextSegment } from "@fluidframework/merge-tree";
// import { TinyliciousClient } from "@fluidframework/tinylicious-client";
import { JsonRpcServer } from '@theia/core';
import { injectable } from '@theia/core/shared/inversify';



const openedFile: Map<string, number> = new Map<string, number>();

export interface ItoiClient {
    
}
export const ItoiServer = Symbol("ItoiServer");
export interface ItoiServer extends JsonRpcServer<ItoiClient> {
    fileOpened(fileUri: string): void;
    fileClosed(fileUri: string): void;
    isFileOpen(fileUri: string): Promise<number>;
}


@injectable()
export class ItoiServerNode implements ItoiServer {

  client: ItoiClient | undefined;
  getClient?(): ItoiClient | undefined {
        return this.client;
    }
  dispose(): void {}

  setClient(client: ItoiClient | undefined): void {
    this.client = client;
  }

  fileOpened(fileUri: string): void {
    console.log("file opened"+ fileUri);
    let readers = openedFile.get(fileUri);
    if (readers){
      openedFile.set(fileUri, readers + 1)
    } else {
      openedFile.set(fileUri, 1)
    }
  }

  fileClosed(fileUri: string): void {
    console.log("file closed " + fileUri);
    let readers = openedFile.get(fileUri);
    if (readers){
      openedFile.set(fileUri, readers -1)
    }
  }

  async isFileOpen(fileUri: string): Promise<number> {
    console.log("isFileOpen?" + fileUri + openedFile.get(fileUri));
    let readers = openedFile.get(fileUri);
    if (readers){
      return readers;
    }
    return 0;
  }

}
//   clientTiny = new TinyliciousClient();
//   sharedString : SharedString;
//   fileUri: string;
//   clients: string[];

//   async getGreeterName(): Promise<string> {
//     return "SharedStringServerNode";
//   }

//   greet(greetings: string): void {
//     this.client?.onGreet(greetings);
//   }

//   async joinCollab(id: string, fileUri: string): Promise<string> {
//     const { container } = await this.clientTiny.getContainer(id, containerSchema);
//     this.sharedString = container.initialObjects.sessionString as SharedString;
//     this.fileUri = fileUri;
//     this.sharedString.on("sequenceDelta", (ev: SequenceDeltaEvent) => {
//       console.log("fired sharedString change: " + ev.isLocal);
//       if (ev.isLocal) {
//           return;
//       }

//       try {
//           for (const range of ev.ranges) {
//               const segment = range.segment;
//               if (TextSegment.is(segment)) {
//                   switch (range.operation) {
//                       case MergeTreeDeltaType.INSERT: {
//                         this.client?.onSharedStringChange("insert", range.position, segment.text, this.fileUri);
//                           break;
//                       }
//                       case MergeTreeDeltaType.REMOVE: {
//                         this.client?.onSharedStringChange("remove", range.position, segment.text, this.fileUri);
//                       break;
//                       }
//                       default:
//                           break;
//                   }
//               }
//           }
//       } finally {
//           //ignoreModelContentChanges = false;
//       }
//     });
//     return this.sharedString.getText();
//   }

//   async startCollab(document: string, fileUri: string){
//     console.log("startCollab");
//     console.log(document);
//     this.fileUri = fileUri;
//     const { container } = await this.clientTiny.createContainer(containerSchema);
//     this.sharedString = container.initialObjects.sessionString as SharedString;
//     this.sharedString.insertText(0,document);
//     const id = await container.attach();
//     connectedClients.add(id);

//     this.sharedString.on("sequenceDelta", (ev: SequenceDeltaEvent) => {
//       console.log("fired sharedString change: " + ev.isLocal);
//       if (ev.isLocal) {
//           return;
//       }

//       try {
//           for (const range of ev.ranges) {
//               const segment = range.segment;
//               if (TextSegment.is(segment)) {
//                   switch (range.operation) {
//                       case MergeTreeDeltaType.INSERT: {
//                         this.client?.onSharedStringChange("insert", range.position, segment.text, this.fileUri);
//                           break;
//                       }
//                       case MergeTreeDeltaType.REMOVE: {
//                         this.client?.onSharedStringChange("remove", range.position, segment.text, this.fileUri);
//                       break;
//                       }
//                       default:
//                           break;
//                   }
//               }
//           }
//       } finally {
//           //ignoreModelContentChanges = false;
//       }
//   });



//     console.log("got document");
//     console.log(this.sharedString.getText());
//     return id;
//   }


//     getDocumentChange(text: string, rangeOffset: number, rangeLength: number): void {
//         if (text) {
//             if (rangeLength === 0) {
//                 this.sharedString.insertText(rangeOffset, text);
//             } else {
//                 this.sharedString.replaceText(
//                     rangeOffset,
//                     rangeOffset + rangeLength,
//                     text,
//                 );
//             }
//         } else {
//             this.sharedString.removeText(
//                 rangeOffset,
//                 rangeOffset + rangeLength,
//             );
//         }
//         console.log("got document change");
//         console.log(this.sharedString.getText());
//     }






// }


// export class SharedServer {
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

