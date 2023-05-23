//Nos queremos agarrar no text change events e enviar isso para cada user
//Cada user terá o ficheiro no workspace 
//e vai recebendo alterações directamente de outros users para o seu ficheiro

//O server vai ser uma queue que cada cliente 
//vai guardando o ultimo ID do evento que já recebeu

// SharedMap
// uuid para a sessao com um SharedSequence
// uuid+chat para a sessão com chat

import { SharedString } from 'fluid-framework'
import { TinyliciousClient } from "@fluidframework/tinylicious-client";
import { Uri } from 'vscode';
import { randomUUID } from 'crypto';
import * as vscode from 'vscode';

const client = new TinyliciousClient();
const containerSchema = {
    initialObjects: { sessionMap: SharedString },
    
};

export class SharedEventServer {
    //Start Collaboration
    async startCollabSession(editor: vscode.TextEditor){
        const { container } = await client.createContainer(containerSchema);
        //let sessionid = randomUUID();
        let editorText = editor.document.getText();
        (container.initialObjects.sessionMap as SharedString).insertText(0,editorText);
        const id = await container.attach();
        return id;
    }

    //Join Collaboration

    //Stop Collaboration
}
