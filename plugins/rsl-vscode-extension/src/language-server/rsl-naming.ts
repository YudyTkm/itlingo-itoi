import { AstNode, DefaultNameProvider } from 'langium';

/**
 * Custom name provider for the RSL language that uses fully-qualified names.
 */
export class RslNameProvider extends DefaultNameProvider {
    /**
     * Retrieves the fully-qualified name of the given AstNode.
     *
     * @param node The AstNode for which to retrieve the qualified name.
     * @returns The fully-qualified name of the node.
     */
    getQualifiedName(node: AstNode): string {
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
