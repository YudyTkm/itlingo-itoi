import * as vscode from 'vscode';
import { RslGenerator } from './rsl-generator';
import PizZip from 'pizzip';
import Docxtemplater, { DXT } from 'docxtemplater';
import angularParser from 'docxtemplater/expressions.js';
import TxtTemplater from 'docxtemplater/js/text.js';
import path from 'path';
import fs from 'fs';
import { sortBy } from 'lodash';
import expressions from 'angular-expressions';

/**
 * Represents a file generator based on a template file for RSL.
 */
export class RslTemplateFileGenerator extends RslGenerator {
  private dialog!: Thenable<vscode.Uri[] | undefined>;
  private templateFile!: vscode.Uri;
  private fileExtension!: string;

  /**
   * Initiates a new instance of `RslGenerator`.
   *
   * @param uri - The URI of the source file.
   */
  constructor(uri: vscode.Uri) {
    super(uri);

    angularParser.filters.upper = function (input) {
      // Make sure that if your input is undefined, your
      // output will be undefined as well and will not
      // throw an error
      if (!input) return input;
      return input.toUpperCase();
    };

    angularParser.filters.where = function (input, query) {
      return input.filter(function (item: any) {
        return expressions.compile(query)(item);
      });
    };

    angularParser.filters.sortBy = function (input, ...fields) {
      // In our example fields is ["price"]

      // Make sure that if your input is undefined, your
      // output will be undefined as well and will not
      // throw an error
      if (!input) return input;
      return sortBy(input, fields);
    };

    angularParser.filters.loop = function (input, ...keys) {
      const result = input.reduce(function (result: any[], item: { [x: string]: any }) {
        (item[keys[0]] || []).forEach(function (subitem: any) {
          result.push({ ...item, ...subitem });
        });
        return result;
      }, []);
      if (keys.length === 1) {
        return result;
      }
      keys.shift();
      return angularParser.filters.loop(result, ...keys);
    };

    angularParser.filters.toFixed = function (input, precision) {
      // In our example precision is the integer 2

      // Make sure that if your input is undefined, your
      // output will be undefined as well and will not
      // throw an error
      if (!input) return input;

      return input.toFixed(precision);
    };

    angularParser.filters.sumby = function (input, field) {
      // In our example field is the string "price"

      // Make sure that if your input is undefined, your
      // output will be undefined as well and will not
      // throw an error
      if (!input) return input;

      return input.reduce(function (sum: any, object: { [x: string]: any }) {
        return sum + object[field];
      }, 0);
    };
  }

  private readonly constructorOptions: DXT.ConstructorOptions = {
    paragraphLoop: true,
    linebreaks: true,
    parser: angularParser,
  };

  /**
   * Validates the Langium document and selects the template file.
   *
   * @throws Error In case the selected RSL file has errors or no template file is selected.
   */
  public override async validate(): Promise<void> {
    await super.validate();

    this.dialog = vscode.window.showOpenDialog({
      canSelectMany: false,
      openLabel: 'Select',
      canSelectFiles: true,
      canSelectFolders: false,
      title: 'Select the template file',
      filters: {
        'Template File (*.docx, *.pptx, *.txt, *.docm, *.dotx, *.dotm, *.pptm)': [
          'docx',
          'pptx',
          'txt',
          'docm',
          'dotx',
          'dotm',
          'pptm',
        ],
        'Word Document (*.docx)': ['docx'],
        'Word Macro-Enabled Document (*.docm)': ['docm'],
        'Word Template (*.dotx)': ['dotx'],
        'Word Macro-Enabled Template (*.dotm)': ['dotm'],
        'Powerpoint Presentation (*.pptx)': ['pptx'],
        'Powerpoint Macro-Enabled Presentation (*.pptm)': ['pptm'],
        'Text Document (*.txt)': ['txt'],
      },
    });

    const result = await this.dialog;

    if (!result) {
      throw new Error('No template file has been selected');
    }

    this.templateFile = result[0];
    this.fileExtension = path.extname(this.templateFile.fsPath);
  }

  /**
   * Gets the file extension associated with the selected template file.
   *
   * @returns The file extension.
   */
  public override getFileExtension(): string {
    return this.fileExtension;
  }

  /**
   * Generates the content based on the selected template file.
   *
   * @returns The generated content as a Buffer.
   * @throws  Error if the file extension is not supported.
   */
  public override generate(): Buffer {
    switch (this.fileExtension) {
      case '.docx':
      case '.docm':
      case '.dotx':
      case '.dotm':
      case '.pptx':
      case '.pptm':
        return this.DocxTemplaterHandler();
      case '.txt':
        return this.TxtTemplaterHandler();
      default:
        throw new Error(`The file extension ${this.fileExtension} is not supported`);
    }
  }

  /**
   * Handles the generation of a docx or pptx file using `docxtemplater`.
   *
   * @returns The generated content as a Buffer.
   */
  private DocxTemplaterHandler() {
    const content = fs.readFileSync(this.templateFile.fsPath, 'binary');

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, this.constructorOptions);

    // Render the document replacing the tags by the actual value
    doc.render(this.model);

    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: 'DEFLATE',
    });

    return buf;
  }

  /**
   * Handles the generation of a txt file using `docxtemplater`.
   *
   * @returns The generated content as a Buffer.
   */
  private TxtTemplaterHandler() {
    const content = fs.readFileSync(this.templateFile.fsPath).toString();
    const doc = new TxtTemplater(content, this.constructorOptions);

    const result = doc.render(this.model);

    return Buffer.from(result);
  }
}
