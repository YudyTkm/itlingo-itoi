"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RslJsonGenerator = void 0;
const rsl_generator_1 = require("./rsl-generator");
/**
 * Represents a JSON generator for RSL (Requirements Specification Language).
 */
class RslJsonGenerator extends rsl_generator_1.RslGenerator {
    /**
     * Gets the file extension associated with the JSON generator.
     *
     * @returns The file extension.
     */
    getFileExtension() {
        return 'json';
    }
    /**
     * Generates the JSON content by serializing the model.
     *
     * @returns The generated JSON content.
     */
    generate() {
        return this.services.serializer.JsonSerializer.serialize(this.model, { space: 2 });
    }
}
exports.RslJsonGenerator = RslJsonGenerator;
//# sourceMappingURL=rsl-json-generator.js.map