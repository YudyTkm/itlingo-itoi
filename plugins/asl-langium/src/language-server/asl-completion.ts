import {  CompletionAcceptor, CompletionContext, DefaultCompletionProvider, LangiumDocument, MaybePromise, NextFeature, findLeafNodeAtOffset, getEntryRule, stream } from "langium";
import * as ast from 'langium/lib/grammar/generated/ast';
import { CompletionItem, CompletionItemKind, CompletionList, CompletionParams } from "vscode-languageserver";


export class AslCompletionProvider extends DefaultCompletionProvider{
    
    override async getCompletion(document: LangiumDocument, params: CompletionParams): Promise<CompletionList | undefined> {
        const root = document.parseResult.value;
        const cst = root.$cstNode;
        if (!cst) {
            return undefined;
        }
        const items: CompletionItem[] = [];
        const textDocument = document.textDocument;
        const text = textDocument.getText();
        const offset = textDocument.offsetAt(params.position);
        const acceptor: CompletionAcceptor = value => {
            const completionItem = this.fillCompletionItem(textDocument, offset, value);
            if (completionItem) {
                items.push(completionItem);
            }
        };

        const node = findLeafNodeAtOffset(cst, this.backtrackToAnyToken(text, offset));

        const context: CompletionContext = {
            document,
            textDocument,
            node: node?.element,
            offset,
            position: params.position
        };

        if (!node) {
            const parserRule = getEntryRule(this.grammar)!;
            await this.completionForRule(context, parserRule, acceptor);
            return CompletionList.create(items, true);
        }

        const parserStart = this.backtrackToTokenStart(text, offset);
        const beforeFeatures = this.findFeaturesAt(textDocument, parserStart);
        let afterFeatures: NextFeature[] = [];
        const reparse = this.canReparse() && offset !== parserStart;
        if (reparse) {
            afterFeatures = this.findFeaturesAt(textDocument, offset);
        }

        const distinctionFunction = (element: NextFeature) => {
            if (ast.isKeyword(element.feature)) {
                return element.feature.value;
            } else {
                return element.feature;
            }
        };

        await Promise.all(
            stream(beforeFeatures)
                .distinct(distinctionFunction)
                .map(e => this.completionFor(context, e, acceptor))
        );

        if (reparse) {
            await Promise.all(
                stream(afterFeatures)
                    .exclude(beforeFeatures, distinctionFunction)
                    .distinct(distinctionFunction)
                    
                    .map(e => this.completionFor(context, e, acceptor))
                    
                    
            );
        }
        return CompletionList.create(items, true);
    }


    override completionFor(context: CompletionContext, next: NextFeature, acceptor: CompletionAcceptor): MaybePromise<void> {
        if (ast.isKeyword(next.feature)) {
            return this.completionForKeyword(context, next.feature, acceptor);
        } else if (ast.isCrossReference(next.feature) && context.node) {
            return this.completionForCrossReference(context, next as NextFeature<ast.CrossReference>, acceptor);
        }
    }


    override completionForKeyword(context: CompletionContext, keyword: ast.Keyword, acceptor: CompletionAcceptor): MaybePromise<void> {
        // Filter out keywords that do not contain any word character
        if (!keyword.value.match(/[\w]|[\[]|[\]]|[\(]|[\)]|[\:]/)) {
            return;
        }

        if (keyword.value.match(/[\[]|[\]]|[\(]|[\)]|[\:]/)) {
            return acceptor({
                label: keyword.value,
                kind: CompletionItemKind.Keyword,
                detail: 'Keyword',
                sortText: '-1'
            });;
        }
        acceptor({
            label: keyword.value,
            kind: CompletionItemKind.Keyword,
            detail: 'Keyword',
            sortText: '1'
        });
    }
}