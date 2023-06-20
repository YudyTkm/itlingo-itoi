import {
    AstNodeDescription, 
    DefaultScopeComputation,
    interruptAndCheck,
    isNamed,
    LangiumDocument,
    streamAllContents
} from 'langium';
import { CancellationToken } from 'vscode-jsonrpc';
import type { AslServices } from './asl-module';
import { AslNameProvider } from './asl-naming';


export class AslScopeComputation extends DefaultScopeComputation {


    constructor(services: AslServices) {
        super(services);
    }

    override async computeExports(document: LangiumDocument, cancelToken = CancellationToken.None): Promise<AstNodeDescription[]> {
        const exportedDescriptions: AstNodeDescription[] = [];

        for (const node of streamAllContents(document.parseResult.value)) {
            await interruptAndCheck(cancelToken);
            if (!isNamed(node)) {
                continue;
            }

            const fullyQualifiedName = (this.nameProvider as AslNameProvider).getQualifiedName(node);
            exportedDescriptions.push(this.descriptions.createDescription(node, fullyQualifiedName, document));
        }

        return exportedDescriptions;
    }


}

