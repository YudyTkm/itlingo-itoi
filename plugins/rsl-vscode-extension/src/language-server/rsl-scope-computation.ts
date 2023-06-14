import { AstNodeDescription, DefaultScopeComputation, LangiumDocument, interruptAndCheck, isNamed, streamAllContents } from 'langium';
import { RslServices } from './rsl-module';
import { CancellationToken } from 'vscode-jsonrpc';
import { RslNameProvider } from './rsl-naming';

export class RslScopeComputation extends DefaultScopeComputation {
    constructor(services: RslServices) {
        super(services);
    }

    override async computeExports(document: LangiumDocument, cancelToken = CancellationToken.None): Promise<AstNodeDescription[]> {
        const exportedDescriptions: AstNodeDescription[] = [];

        for (const node of streamAllContents(document.parseResult.value)) {
            await interruptAndCheck(cancelToken);
            if (!isNamed(node)) {
                continue;
            }

            const fullyQualifiedName = (this.nameProvider as RslNameProvider).getQualifiedName(node);
            exportedDescriptions.push(this.descriptions.createDescription(node, fullyQualifiedName, document));
        }

        return exportedDescriptions;
    }
}
