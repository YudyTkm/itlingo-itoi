"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RslJsonGenerator = void 0;
const rsl_generator_1 = require("./rsl-generator");
/**
 * Represents a JSON generator for RSL.
 */
class RslJsonGenerator extends rsl_generator_1.RslGenerator {
    /**
     * Gets the file extension associated with the generator.
     *
     * @returns The file extension.
     */
    getFileExtension() {
        return '.json';
    }
    /**
     * Generates the JSON content by serializing the RSL model.
     *
     * @returns The generated JSON content as a Buffer.
     */
    generate() {
        return Buffer.from(this.services.serializer.JsonSerializer.serialize(this.model, { space: 2 }));
    }
}
exports.RslJsonGenerator = RslJsonGenerator;
//# sourceMappingURL=rsl-json-generator.js.map