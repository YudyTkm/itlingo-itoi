"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AslNameProvider = void 0;
const langium_1 = require("langium");
class AslNameProvider extends langium_1.DefaultNameProvider {
    getQualifiedName(node) {
        if (!node.$container) {
            return '';
        }
        let qualifiedName = this.getQualifiedName(node.$container);
        const nodeName = this.getName(node);
        if (nodeName) {
            if (qualifiedName) {
                qualifiedName += '.';
            }
            return qualifiedName + nodeName;
        }
        return qualifiedName;
    }
}
exports.AslNameProvider = AslNameProvider;
//# sourceMappingURL=asl-naming.js.map