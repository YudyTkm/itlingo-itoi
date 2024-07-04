import TxtTemplater from 'docxtemplater/js/text.js';
import fs from 'fs';
import path from 'path';
import { DataAttributeTypeOriginal, Model } from '../language-server/generated/ast';

export class PowerappsGenerator {

  public generatePowerapps(templatePath: string, data: Model) {

    const struct = this.createDataStructure(data);
    console.log("finished creating data structure");

    const files = this.getTemplates(templatePath);

    this.createFolderStructure(files, struct);
    console.log("done");

  }

  private createDataStructure(data: Model) {

    console.log(data);

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
          entityImage: false,
          attributes: [],
        };

        elem.attributes.forEach(attr => {

          const attrType: DataAttributeTypeOriginal = attr.type as DataAttributeTypeOriginal;
          const attrConstraint = attr.constraint;

          const attribute = {
            attrName: attr.name,
            attrNameAlias: attr.nameAlias ?? attr.name,
            attrDescription: attr.helpMessage ?? "",
            attrType: "nvarchar",
            attrMaxLength: attrType.size,
            attrLength: +attrType.size * 2,
            attrRequiredLevel: "none",
            nvarchar: false,
            image: false,
            bit: false,
            decimal: false
          };

          if (attrType.type === "Image") {
            entity.entityImage = true;
            attribute.image = true;
            attribute.attrType = "image";
          }

          else if (attrType.type === "Decimal") {
            attribute.decimal = true;
            attribute.attrType = "decimal";
          }

          else if (attrType.type === "Boolean") {
            attribute.bit = true;
            attribute.attrType = "bit";
          }

          else if (attrConstraint?.isPrimaryKey === 'PrimaryKey') {
            attribute.attrType = "primarykey";
            attribute.attrRequiredLevel = "systemrequired";
          }

          else {
            attribute.nvarchar = true;
          }

          if (attrConstraint?.isNotNull === 'NotNull')
            attribute.attrRequiredLevel = "required";

          entity.attributes.push(attribute);
        });

        struct.entities.push(entity);
      }

      else if (elem.$type === "UIContainer") {
        //TODO

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

      console.log("writing to file: " + newFile);

      if (nameWithoutExtension.endsWith("Template"))
        this.TxtTemplaterHandler(file, data, path.extname(file));

      else
        fs.copyFileSync(file, newFile);

      console.log("wrote to file: " + newFile);

    });
  }

  /**
   * Handles the generation of a txt file using `docxtemplater`.
  */
  private TxtTemplaterHandler(file: string, data: any, ext: string) {

    var content = fs.readFileSync(file).toString();

    const doc = new TxtTemplater(content, {
      // paragraphLoop: true,
      delimiters: { start: '{(', end: ')}' },
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
