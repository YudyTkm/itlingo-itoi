import { AstNode, DefaultNameProvider } from 'langium';

export class AslNameProvider extends DefaultNameProvider {
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
