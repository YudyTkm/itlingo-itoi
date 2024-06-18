import * as vscode from 'vscode';
import * as path from 'path';
import * as cp from "child_process";
import { PowerappsGenerator } from './generator/PowerappsGenerator';
import { createAslServices } from './language-server/asl-module';
import { NodeFileSystem } from 'langium/node';
import { Model } from './language-server/generated/ast';


export class ASLCustomCommands implements vscode.Disposable {

    context: vscode.ExtensionContext;
    constructor(context: vscode.ExtensionContext){
        this.context = context;
    }
    
    dispose() {
        //clear any resources alocated.
    }

    registerCommands(){
        //vscode.commands.registerCommand('genie.import',this.genieCallBack);
        vscode.commands.registerCommand('zip.import',this.zipCallBack, this);
        vscode.commands.registerCommand('genio.export',this.exportGenieCallBack, this);
        vscode.commands.registerCommand('asl.export',this.exportAslCallBack, this);
        vscode.commands.registerCommand('powerapps.export', (x) => this.exportPowerAppsCallback(x), this);
        
        console.log("Registered ASL commands");
    } 

    genieCallBack(...context: any[]){
        console.log("GenieCallback");
    }

    zipCallBack(...context: any[]){
        let fileUri = context[0];
        console.log(fileUri);
        console.log(context[1]);
        console.log(context);
        let importerPath = this.context.asAbsolutePath(path.join('server', 'asl', 'bin','importer.sh'));
        let importerType = 'GENIO';

        const workspaceRoot = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
        console.log(workspaceRoot)
	    if (!workspaceRoot) {
		    return;
	    }

        const commandString :string = `${importerPath} ${importerType} ${workspaceRoot} ${fileUri.path}`
        console.log(commandString);
        cp.execSync(commandString);
        
    }

    exportGenieCallBack(...callcontext: any[]){
        let fileUri = callcontext[0];


        let generatorPath = this.context.asAbsolutePath(path.join('server', 'asl', 'bin','generator.sh'));
        let generatorType = 'Genio';
        
        const workspaceRoot = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
	    if (!workspaceRoot) {
		    return;
	    }


        const commandString :string = `${generatorPath} ${generatorType} ${fileUri.path} ${workspaceRoot}`
        cp.execSync(commandString);
    }

    exportPowerAppsCallback(uri: vscode.Uri, ...callcontext:any[]){
        if (!uri) {
            // in case the command is launched from the commandPalette
            if (vscode.window.activeTextEditor) {
                uri = vscode.window.activeTextEditor.document.uri;
            } else {
                throw new Error('Failed to detect the source generation file. No URI provided and no active text editor found.');
            }
        }

        const fileUri = callcontext[0];

        const powerapps = new PowerappsGenerator();

        const services = createAslServices(NodeFileSystem).Asl;
        const document = services.shared.workspace.LangiumDocuments.getOrCreateDocument(uri);
        const model = document.parseResult.value as Model;

        console.log(model);

        //TODO Change to predefined path for templates
        powerapps.generatePowerapps('D:\\Yudy\\Faculdade\\GitHub\\docXTemplater\\Utl\\Templates', model);

        const generatorPath = this.context.asAbsolutePath(path.join('server', 'asl', 'bin','generator.sh'));
        const generatorType = 'PowerApps';

        const workspaceRoot = vscode.workspace.workspaceFolders?.length ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
	    if (!workspaceRoot)
		    return;

        const commandString :string = `${generatorPath} ${generatorType} ${fileUri.path} ${workspaceRoot}`;

        console.log('\n'+commandString);

        cp.execSync(commandString);
    }


    exportAslCallBack(...callcontext: any[]){
        let fileUri = callcontext[0];


        let generatorPath = this.context.asAbsolutePath(path.join('server', 'asl', 'bin','generator.sh'));
        let generatorType = 'Asl';
        
        const workspaceRoot = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
	    if (!workspaceRoot) {
		    return;
	    }

        const commandString :string = `${generatorPath} ${generatorType} ${fileUri.path} ${workspaceRoot}`
        cp.execSync(commandString);
    }
}
