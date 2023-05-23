import * as vscode from 'vscode';
// import * as path from 'path';
// import * as cp from "child_process";
import { SharedEventServer } from './sharedEventsServer';

const decorationTypeRed = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'red',
  });

const decorationTypeGreen = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'green',
  });
const decorationTypeYellow = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'yellow',
  });

const sharedEventServer = new SharedEventServer();

export class ItoiCollaboration implements vscode.Disposable {
	stop() {
		throw new Error('Method not implemented.');
	}
	join() {
		throw new Error('Method not implemented.');
	}
    context: vscode.ExtensionContext;
    constructor(context: vscode.ExtensionContext){
        this.context = context;
    }

    async activate(){
       
        const openEditor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
        if (!openEditor) return;
        let id = await sharedEventServer.startCollabSession(openEditor);
        console.log(id);
        console.log("activated");
    }

    getCursorPosition() : vscode.Position | undefined{
        let activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) return undefined;
        let document = activeEditor.document;

        return activeEditor.selection.active;
    }

    decorate(editor: vscode.TextEditor){
        let cursorPos = this.getCursorPosition();
        if (!cursorPos) return 
        let cursorPosAfter = new vscode.Position(cursorPos.line, cursorPos.character+1);
        let range = new vscode.Range(cursorPos, cursorPosAfter);
        editor.setDecorations(decorationTypeRed, [range]);
    }

    dispose() {
    
    }
}
