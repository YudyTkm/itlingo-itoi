import * as vscode from 'vscode';
import * as path from 'path';
import {
    LanguageClient, LanguageClientOptions, ServerOptions, TransportKind
} from 'vscode-languageclient/node';
import { SprottyDiagramIdentifier, createFileUri, createWebviewPanel, registerDefaultCommands } from 'sprotty-vscode';
import { LspWebviewPanelManager, LspWebviewPanelManagerOptions } from 'sprotty-vscode/lib/lsp';


import { ASLCustomCommands } from './asl-commands-extension';

let languageClient: LanguageClient;
let aslCustomCommand: ASLCustomCommands;

// This function is called when the extension is activated.
export function activate(context: vscode.ExtensionContext): void {
    if (!aslCustomCommand) {
        aslCustomCommand = new ASLCustomCommands(context);
        aslCustomCommand.registerCommands();
    }
    languageClient = startLanguageClient(context);
    const webviewPanelManager = new CustomLspWebview({
        extensionUri: context.extensionUri,
        defaultDiagramType: 'asl',
        languageClient,
        supportedFileExtensions: ['.asl']
    });
    registerDefaultCommands(webviewPanelManager, context, { extensionPrefix: 'asl' });

}

// This function is called when the extension is deactivated.
export function deactivate(): Thenable<void> | undefined {
    if (languageClient) {
        return languageClient.stop();
    }
    if (aslCustomCommand){
        aslCustomCommand.dispose();
    }
    return undefined;
}

function startLanguageClient(context: vscode.ExtensionContext): LanguageClient {
    const serverModule = context.asAbsolutePath(path.join('out', 'language-server', 'main'));
    // The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging.
    // By setting `process.env.DEBUG_BREAK` to a truthy value, the language server will wait until a debugger is attached.
    const debugOptions = { execArgv: ['--nolazy', `--inspect${process.env.DEBUG_BREAK ? '-brk' : ''}=${process.env.DEBUG_SOCKET || '6009'}`] };

    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
    };

    const fileSystemWatcher = vscode.workspace.createFileSystemWatcher('**/*.asl');
    context.subscriptions.push(fileSystemWatcher);

    // Options to control the language client
    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'asl' }],
        synchronize: {
            // Notify the server about file changes to files contained in the workspace
            fileEvents: fileSystemWatcher
        }
    };

    // Create the language client and start the client.
    const client = new LanguageClient(
        'asl',
        'asl',
        serverOptions,
        clientOptions
    );

    // Start the client. This will also launch the server
    client.start();
    return client;
}



class CustomLspWebview extends LspWebviewPanelManager {

    constructor(options: LspWebviewPanelManagerOptions) {
        super(options);
    }

    protected override createWebview(identifier: SprottyDiagramIdentifier): vscode.WebviewPanel {
        return createWebviewPanel(identifier, {
            localResourceRoots: [ createFileUri('/home', 'theia','pack') ],
            scriptUri: createFileUri('/home', 'theia','pack','webview.js')
        });
    }

}