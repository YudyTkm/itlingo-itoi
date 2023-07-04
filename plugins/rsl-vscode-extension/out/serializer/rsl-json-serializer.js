"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RslJsonSerializer = void 0;
const langium_1 = require("langium");
/**
 * Custom JSON serializer implementation for the RSL language.
 */
class RslJsonSerializer extends langium_1.DefaultJsonSerializer {
    constructor() {
        super(...arguments);
        /**
         * A set of properties to ignore during serialization.
         */
        this.ignoreProperties = new Set([
            '$container',
            '$containerProperty',
            '$containerIndex',
            '$document',
            '$cstNode',
            '$type',
        ]);
    }
}
exports.RslJsonSerializer = RslJsonSerializer;
//# sourceMappingURL=rsl-json-serializer.js.map