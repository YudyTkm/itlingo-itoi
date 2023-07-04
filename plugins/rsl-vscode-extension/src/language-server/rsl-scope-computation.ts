import { AstNodeDescription, DefaultScopeComputation, LangiumDocument, interruptAndCheck, isNamed, streamAllContents } from 'langium';
import { RslServices } from './rsl-module';
import { CancellationToken } from 'vscode-jsonrpc';
import { RslNameProvider } from './rsl-naming';

/**
 * Custom implementation of `ScopeComputation` for the RSL language.
 * It is responsible for creating and collecting descriptions of the AST nodes to be exported into the global scope from the given document.
 */
export class RslScopeComputation extends DefaultScopeComputation {
    /**
     * Initializes an instance of `RslScopeComputation`.
     *
     * @param services - The `RslServices` instance providing the necessary services.
     */
    constructor(services: RslServices) {
        super(services);
    }

    /**
     * Calculates the exports for the provided RSL document, where each AST node is exported with its complete qualified name.
     *
     * @param document - The `LangiumDocument` representing the RSL document.
     * @param cancelToken - The cancellation token indicating when to cancel the current operation.
     * @returns A promise that resolves to an array of `AstNodeDescription` representing the exported AST nodes.
     */
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
