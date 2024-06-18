import TxtTemplater from 'docxtemplater/js/text.js';
import fs from 'fs';
import path from 'path';
import { Model } from '../language-server/generated/ast';

export class PowerappsGenerator {

  public generatePowerapps(templatePath: string, data: Model) {

    console.log("Generating Powerapps project");

    const struct = this.createDataStructure(data);
    const files = this.getTemplates(templatePath);

    this.createFolderStructure(files, struct);
  }

  private createDataStructure(data: Model) {

    const pac = data.packages[0];
    const system = pac.system;
    const systemConcepts = system.systemConcepts;

    var struct: Record<string, any> = {
      prefix: pac.name,
      appName: system.nameAlias,
      entities: [],
      containers: [],
    };

    systemConcepts.forEach(elem => {

      if (elem.$type === "DataEntity") {

        const entity: Record<string, any> = {
          entityName: elem.nameAlias,
          attributes: [],
        };

        elem.attributes.forEach(attr => {

          //TODO Type is an object and not a string
          const attrType = attr.type;

          const attribute = {
            attrName: attr.nameAlias,
            attrType: attrType,
          };

          entity.attributes.push(attribute);
        });

        struct.entities.push(entity);
      }

      else if (elem.$type === "UIContainer") {

        

      }

    });

    return struct;
  }

  private getTemplates(dir: string) {
    var results: string[] = [];

    fs.readdirSync(dir).forEach((file: string) => { // Added arrow function to preserve the context of 'this'
      file = dir + '\\' + file;
      var stat = fs.statSync(file);

      if (stat && stat.isDirectory())
        results = results.concat(this.getTemplates(file)); // Added type annotation to 'this'
      else results.push(file);
    });

    return results;
  };

  private createFolderStructure(files: string[], data: any) {

    files.forEach((file) => {
      const nameWithoutExtension = path.basename(file).replace(path.extname(file), "");

      const newFile = file.replace('\\Utl\\Templates\\', '\\Output\\');

      const dirpath = newFile.substring(0, newFile.lastIndexOf("\\"));

      fs.mkdirSync(dirpath, { recursive: true });

      if (nameWithoutExtension.endsWith("Template"))
        this.TxtTemplaterHandler(file, data, path.extname(file));

      else
        fs.copyFileSync(file, newFile);
    });
  }

  /**
   * Handles the generation of a txt file using `docxtemplater`.
  */
  private TxtTemplaterHandler(file: string, data: any, ext: string) {

    var content = fs.readFileSync(file).toString();

    const doc = new TxtTemplater(content, {
      delimiters: { start: '{{', end: '}}' }
    });

    // Remove the "Template" from the file name
    let fileName = path.basename(file);
    fileName = fileName.replace("Template", "");

    file = file.replace('\\Utl\\Templates\\', '\\Output\\');

    const dirpath = file.substring(0, file.lastIndexOf("\\"));

    file = dirpath + "\\" + fileName;

    const result = doc.render(data);

    fs.writeFileSync(file, result);
  }
}
