import * as vscode from "vscode";
import { RslServices, createRslServices } from "../language-server/rsl-module";
import { NodeFileSystem } from "langium/node";
import { Model } from "../language-server/generated/ast";
import { posix } from "path";
import { AstNode, LangiumDocument } from "langium";
import {
  getFileName as getFileNameWithoutExtension,
  writeFile,
} from "./generator-utils";

/**
 * Represents an abstract RSL (Requirements Specification Language) generator.
 * Subclasses should extend this class and implement the abstract methods.
 */
export abstract class RslGenerator {
  protected readonly fileUri: vscode.Uri;
  protected readonly services: RslServices;
  protected readonly document: LangiumDocument<AstNode>;
  protected readonly model: Model;

  /**
   * Initiates a new instance of `RslGenerator`.
   *
   * @param uri - The URI of the source file.
   */
  constructor(uri: vscode.Uri) {
    if (!uri) {
      // in case the command is launched from the commandPalette
      if (vscode.window.activeTextEditor) {
        uri = vscode.window.activeTextEditor.document.uri;
      } else {
        throw new Error(
          "Failed to detect the source generation file. No URI provided and no active text editor found."
        );
      }
    }

    this.fileUri = uri;
    this.services = createRslServices(NodeFileSystem).Rsl;

    this.document =
      this.services.shared.workspace.LangiumDocuments.getOrCreateDocument(
        this.fileUri
      );
    this.model = this.document.parseResult.value as Model;
  }

  /**
   * Gets the file extension associated with the generator.
   *
   * @returns The file extension.
   */
  public abstract getFileExtension(): string;

  /**
   * Generates the content to be written to the file.
   *
   * @returns The generated content.
   */
  public abstract generate(): string;

  /**
   * Executes the generator by writing the content to a destination file.
   *
   * @param content              The content to be written.
   */
  public async execute(content: string) {
    const workspace = vscode.workspace.getWorkspaceFolder(this.fileUri);

    if (!workspace) {
      throw new Error(
        "Failed to find the workspace folder for the selected file Uri"
      );
    }

    const destinationDirectory = workspace.uri;
    const fileName = `${getFileNameWithoutExtension(
      this.fileUri.path
    )}.${this.getFileExtension()}`;

    const fileUri = destinationDirectory.with({
      path: posix.join(destinationDirectory.path, fileName),
    });

    await writeFile(fileUri, content);

    vscode.window.showInformationMessage(`${fileName} generated successfully`);
    vscode.window.showTextDocument(fileUri);
  }

  /**
   * Validates the Langium document for errors.
   *
   * @returns A boolean indicating whether the document is valid (true) or has errors (false).
   */
  public async validate() {
    await this.services.shared.workspace.DocumentBuilder.build(
      [this.document],
      { validationChecks: "all" }
    );
    if (this.document.diagnostics && this.document.diagnostics.length > 0) {
      throw new Error(
        `The file ${this.fileUri.path} has some errors. Please fix them before generating the new file`
      );
    }
  }
}
