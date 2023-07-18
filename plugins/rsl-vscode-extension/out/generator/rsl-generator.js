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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RslGenerator = void 0;
const vscode = __importStar(require("vscode"));
const rsl_module_1 = require("../language-server/rsl-module");
const node_1 = require("langium/node");
const path_1 = require("path");
const generator_utils_1 = require("./generator-utils");
/**
 * Represents an abstract RSL (Requirements Specification Language) generator.
 * Subclasses should extend this class and implement the abstract methods.
 */
class RslGenerator {
    /**
     * Initiates a new instance of `RslGenerator`.
     *
     * @param uri - The URI of the source file.
     */
    constructor(uri) {
        this.generatedDirectoryName = 'Generated';
        if (!uri) {
            // in case the command is launched from the commandPalette
            if (vscode.window.activeTextEditor) {
                uri = vscode.window.activeTextEditor.document.uri;
            }
            else {
                throw new Error('Failed to detect the source generation file. No URI provided and no active text editor found.');
            }
        }
        this.fileUri = uri;
        const workspace = vscode.workspace.getWorkspaceFolder(this.fileUri);
        if (!workspace) {
            throw new Error('Failed to find the workspace folder for the selected/active file');
        }
        this.workspace = workspace;
        this.services = (0, rsl_module_1.createRslServices)(node_1.NodeFileSystem).Rsl;
        this.document = this.services.shared.workspace.LangiumDocuments.getOrCreateDocument(this.fileUri);
        this.model = this.document.parseResult.value;
    }
    /**
     * Executes the generator by writing the content to a destination file.
     *
     * @param content The content to be written.
     */
    execute(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const destinationDirectory = this.workspace.uri;
            const fileName = `${(0, generator_utils_1.getFileNameWithoutExtension)(this.fileUri.path)}${this.getFileExtension()}`;
            const fileUri = destinationDirectory.with({ path: path_1.posix.join(destinationDirectory.path, this.generatedDirectoryName, fileName) });
            yield (0, generator_utils_1.writeFile)(fileUri, content);
            vscode.window.showInformationMessage(`${fileName} generated successfully`);
            if (this.getFileExtension() === '.txt' || this.getFileExtension() === '.json') {
                vscode.window.showTextDocument(fileUri);
            }
        });
    }
    /**
     * Validates the Langium document for errors.
     *
     * @throws Error In case the selected RSL file has errors.
     */
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.services.shared.workspace.DocumentBuilder.build([this.document], { validationChecks: 'all' });
            if (this.document.diagnostics && this.document.diagnostics.length > 0) {
                throw new Error(`The file ${(0, generator_utils_1.getFileName)(this.fileUri.path)} has some errors. Please fix them before generating the new file`);
            }
        });
    }
}
exports.RslGenerator = RslGenerator;
//# sourceMappingURL=rsl-generator.js.map