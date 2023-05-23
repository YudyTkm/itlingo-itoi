// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ItoiCollaboration } from './ItoiCollaboration';

let itoiCollab : ItoiCollaboration; 
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	itoiCollab = new ItoiCollaboration(context);
	
	context.subscriptions.push( vscode.commands.registerCommand('itoi-collab.startColab', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Start!');
		vscode.commands.executeCommand('setContext', 'itoi-collab.showStop', true);
		itoiCollab.activate();
		
	}));
	context.subscriptions.push(vscode.commands.registerCommand('itoi-collab.joinColab', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Join!');
		vscode.commands.executeCommand('setContext', 'itoi-collab.showStop', true);
		itoiCollab.join();
	}));
	context.subscriptions.push( vscode.commands.registerCommand('itoi-collab.stopColab', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Stop!');
		vscode.commands.executeCommand('setContext', 'itoi-collab.showStop', false);
		itoiCollab.stop();
	}));
	context.subscriptions.push(itoiCollab);
}

// This method is called when your extension is deactivated
export function deactivate() {}
