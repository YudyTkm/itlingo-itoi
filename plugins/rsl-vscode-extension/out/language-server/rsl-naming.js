"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RslNameProvider = void 0;
const langium_1 = require("langium");
class RslNameProvider extends langium_1.DefaultNameProvider {
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
exports.RslNameProvider = RslNameProvider;
//# sourceMappingURL=rsl-naming.js.map