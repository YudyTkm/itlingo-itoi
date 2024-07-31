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
          prefix: pac.name,
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
          else {
            attribute.nvarchar = true;
          }
          if (attrConstraint?.isNotNull === 'NotNull')
            attribute.attrRequiredLevel = "required";

          if (attrConstraint?.isPrimaryKey === 'PrimaryKey') {
            attribute.attrType = "primarykey";
            attribute.attrRequiredLevel = "systemrequired";
            attribute.nvarchar = false;
          }

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

    let entitiesTemplate: string[] = [];
    let dataSourcesTemplate: string = "";
    files.forEach((file) => {

      if (file.includes("EntitiesTemplate")) {
        entitiesTemplate.push(file);
        return;
      }
      if (file.includes("DataSourceTemplate")) {
        dataSourcesTemplate = file;
        return;
      }

      const nameWithoutExtension = path.basename(file).replace(path.extname(file), "");

      const newFile = file.replace('\\Utl\\Templates\\', '\\Output\\').replace("Template.", ".");

      const dirpath = newFile.substring(0, newFile.lastIndexOf("\\"));
      fs.mkdirSync(dirpath, { recursive: true });

      if (nameWithoutExtension.endsWith("Template"))
        this.TxtTemplaterHandler(file, newFile, data);
      else
        fs.copyFileSync(file, newFile);
    });

    data.entities.forEach((entity: any) => {

      entitiesTemplate.forEach((template) => {

        // Write entities files for each entity
        let newFile = template.replace('\\Utl\\Templates\\Entities\\EntitiesTemplate\\', `\\Output\\Entities\\${data.prefix}_${entity.entityName}\\`).replace("Template.", ".");;
        let dirpath = newFile.substring(0, newFile.lastIndexOf("\\"));
        fs.mkdirSync(dirpath, { recursive: true });

        this.TxtTemplaterHandler(template, newFile, entity);
      });

      // Write data sources files for each entity
      let newFile = dataSourcesTemplate.replace('\\Utl\\Templates\\', `\\Output\\`).replace("DataSourceTemplate.txt", `${entity.entityName}.json`);
      let dirpath = newFile.substring(0, newFile.lastIndexOf("\\"));
      fs.mkdirSync(dirpath, { recursive: true });

      this.TxtTemplaterHandler(dataSourcesTemplate, newFile, entity);
    });
  }

  /**
   * Handles the generation of a txt file using `docxtemplater`.
  */
  private TxtTemplaterHandler(template: string, out: string, data: any) {

    var content = fs.readFileSync(template).toString();

    const doc = new TxtTemplater(content, {
      paragraphLoop: true,
      delimiters: { start: '{(', end: ')}' },
      parser: parser
    });

    const result = doc.render(data);

    fs.writeFileSync(out, result);
  }
}

/**
 * Function to parse the tags in the template file.
 * used for custom tags in the template file.
 */
function parser(tag: string) {
  return {
    get(scope: { [x: string]: any; }, context: { scopePathItem: string | any[]; scopePathLength: string | any[]; }) {
      if (tag === "$index") {
        const indexes = context.scopePathItem;
        return indexes[indexes.length - 1];
      }
      if (tag === "$isLast") {
        const totalLength =
          context.scopePathLength[context.scopePathLength.length - 1];
        const index =
          context.scopePathItem[context.scopePathItem.length - 1];
        return index === totalLength - 1;
      }
      if (tag === "$isFirst") {
        const index =
          context.scopePathItem[context.scopePathItem.length - 1];
        return index === 0;
      }
      return scope[tag];
    },
  };
}
