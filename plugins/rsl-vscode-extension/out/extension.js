"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const node_1 = require("vscode-languageclient/node");
const rsl_generator_factory_1 = require("./generator/rsl-generator-factory");
const rsl_json_generator_1 = require("./generator/rsl-json-generator");
const rsl_text_generator_1 = require("./generator/rsl-text-generator");
// import { LspWebviewPanelManager, LspWebviewPanelManagerOptions } from 'sprotty-vscode/lib/lsp';
const sprotty_vscode_1 = require("sprotty-vscode");
const lsp_1 = require("sprotty-vscode/lib/lsp");
const rsl_template_file_generator_1 = require("./generator/rsl-template-file-generator");
let languageClient;
// This function is called when the extension is activated.
function activate(context) {
    languageClient = startLanguageClient(context);
    const generatorFactory = new rsl_generator_factory_1.RslGeneratorFactory();
    context.subscriptions.push(vscode.commands.registerCommand("rsl.generate.json", (x) => generatorFactory.execute(new rsl_json_generator_1.RslJsonGenerator(x))));
    context.subscriptions.push(vscode.commands.registerCommand("rsl.generate.text", (x) => generatorFactory.execute(new rsl_text_generator_1.RsltextGenerator(x))));
    context.subscriptions.push(vscode.commands.registerCommand('rsl.generate.from-template', (x) => generatorFactory.execute(new rsl_template_file_generator_1.RslTemplateFileGenerator(x))));
    const webviewPanelManager = new CustomLspWebview({
        extensionUri: context.extensionUri,
        defaultDiagramType: 'rsl',
        languageClient,
        supportedFileExtensions: ['.rsl']
    });
    (0, sprotty_vscode_1.registerDefaultCommands)(webviewPanelManager, context, { extensionPrefix: 'rsl' });
}
exports.activate = activate;
// This function is called when the extension is deactivated.
function deactivate() {
    if (languageClient) {
        return languageClient.stop();
    }
    return undefined;
}
exports.deactivate = deactivate;
function startLanguageClient(context) {
    const serverModule = context.asAbsolutePath(path.join('out', 'language-server', 'main'));
    // The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging.
    // By setting `process.env.DEBUG_BREAK` to a truthy value, the language server will wait until a debugger is attached.
    const debugOptions = { execArgv: ['--nolazy', `--inspect${process.env.DEBUG_BREAK ? '-brk' : ''}=${process.env.DEBUG_SOCKET || '6009'}`] };
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions = {
        run: { module: serverModule, transport: node_1.TransportKind.ipc },
        debug: { module: serverModule, transport: node_1.TransportKind.ipc, options: debugOptions }
    };
    const fileSystemWatcher = vscode.workspace.createFileSystemWatcher('**/*.rsl');
    context.subscriptions.push(fileSystemWatcher);
    // Options to control the language client
    const clientOptions = {
        documentSelector: [{ scheme: 'file', language: 'rsl' }],
        synchronize: {
            // Notify the server about file changes to files contained in the workspace
            fileEvents: fileSystemWatcher
        }
    };
    // Create the language client and start the client.
    const client = new node_1.LanguageClient('rsl', 'rsl', serverOptions, clientOptions);
    // Start the client. This will also launch the server
    client.start();
    return client;
}
class CustomLspWebview extends lsp_1.LspWebviewPanelManager {
    constructor(options) {
        super(options);
    }
    createWebview(identifier) {
        return (0, sprotty_vscode_1.createWebviewPanel)(identifier, {
            localResourceRoots: [(0, sprotty_vscode_1.createFileUri)('/home', 'theia', 'pack')],
            scriptUri: (0, sprotty_vscode_1.createFileUri)('/home', 'theia', 'pack', 'webview.js')
        });
    }
}
//# sourceMappingURL=extension.js.map