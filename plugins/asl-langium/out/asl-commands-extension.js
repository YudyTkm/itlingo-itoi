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
exports.ASLCustomCommands = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const cp = __importStar(require("child_process"));
class ASLCustomCommands {
    constructor(context) {
        this.context = context;
    }
    dispose() {
        //clear any resources alocated.
    }
    registerCommands() {
        console.log('REGISTERED COMMANDS: asl.genie and asl.zip');
        //vscode.commands.registerCommand('genie.import',this.genieCallBack);
        vscode.commands.registerCommand('zip.import', this.zipCallBack, this);
        vscode.commands.registerCommand('genio.export', this.exportGenieCallBack, this);
    }
    genieCallBack(...context) {
        console.log("GenieCallback");
    }
    zipCallBack(...context) {
        let fileUri = context[0];
        console.log(fileUri);
        console.log(context[1]);
        console.log(context);
        let importerPath = this.context.asAbsolutePath(path.join('server', 'asl', 'bin', 'importer.sh'));
        let importerType = 'GENIO';
        const workspaceRoot = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
            ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
        console.log(workspaceRoot);
        if (!workspaceRoot) {
            return;
        }
        const commandString = `${importerPath} ${importerType} ${workspaceRoot} ${fileUri.path}`;
        console.log(commandString);
        cp.execSync(commandString);
    }
    exportGenieCallBack(...callcontext) {
        console.log("exportGenie");
        let fileUri = callcontext[0];
        console.log(fileUri);
        console.log("exportGenie-context");
        console.log(callcontext.length);
        console.log(callcontext);
        let generatorPath = this.context.asAbsolutePath(path.join('server', 'asl', 'bin', 'generator.sh'));
        let generatorType = 'Genio';
        const workspaceRoot = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
            ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
        console.log(workspaceRoot);
        if (!workspaceRoot) {
            return;
        }
        const commandString = `${generatorPath} ${generatorType} ${fileUri.path} ${workspaceRoot}`;
        console.log(commandString);
        console.log("exportGenie-2-");
        cp.execSync(commandString);
    }
}
exports.ASLCustomCommands = ASLCustomCommands;
//# sourceMappingURL=asl-commands-extension.js.map