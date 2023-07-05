"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RslNameProvider = void 0;
const langium_1 = require("langium");
/**
 * Custom name provider for the RSL language that uses fully-qualified names.
 */
class RslNameProvider extends langium_1.DefaultNameProvider {
    /**
     * Retrieves the fully-qualified name of the given AstNode.
     *
     * @param node The AstNode for which to retrieve the qualified name.
     * @returns The fully-qualified name of the node.
     */
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