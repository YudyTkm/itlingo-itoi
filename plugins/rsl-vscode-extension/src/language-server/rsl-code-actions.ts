import { AstNode, CodeActionProvider, LangiumDocument, MaybePromise } from 'langium';
import { CodeAction, CodeActionKind, Command, Diagnostic } from 'vscode-languageserver-types';
import { CodeActionParams, CancellationToken } from 'vscode-languageserver-protocol';
import { IssueCodes } from './rsl-validator';
import { createSystemConcept } from '../util/rsl-utilities';
import { LinguisticRuleElementProperty } from './generated/ast';

export class RslActionProvider implements CodeActionProvider {
    getCodeActions(
        document: LangiumDocument<AstNode>,
        params: CodeActionParams,
        cancelToken?: CancellationToken | undefined
    ): MaybePromise<(Command | CodeAction)[] | undefined> {
        const result: CodeAction[] = [];
        const acceptor = (ca: CodeAction | undefined) => ca && result.push(ca);
        for (const diagnostic of params.context.diagnostics) {
            this.createCodeActions(diagnostic, document, acceptor);
        }
        return result;
    }

    private createCodeActions(diagnostic: Diagnostic, document: LangiumDocument, accept: (ca: CodeAction | undefined) => void): void {
        switch (diagnostic.code) {
            case IssueCodes.ISA_HIERARCHY_CYCLE:
                accept(this.removeString('Remove supertype', diagnostic, document));
                break;
            case IssueCodes.PARTOF_HIERARCHY_CYCLE:
                accept(this.removeString("Remove the 'part-of' reference", diagnostic, document));
                break;
            case IssueCodes.INVALID_AF_CONDITION:
                accept(this.removeString('Remove Condition', diagnostic, document));
                break;
            case IssueCodes.INVALID_SUBTYPE:
                accept(this.removeString('Remove sub-type', diagnostic, document));
                break;
            case IssueCodes.INVALID_AT_PARTICIPANTTARGET:
                accept(this.removeString('Remove participant target', diagnostic, document));
                break;
            case IssueCodes.STEP_NEXT_HIERARCHY_CYCLE:
                accept(this.removeString("Remove the 'next' reference", diagnostic, document));
                break;
            case IssueCodes.SYS_RELATION_CYCLE:
                accept(this.removeString('Remove system relation targets', diagnostic, document));
                break;
            case IssueCodes.BAD_UC_HIERARCHY:
                accept(this.removeString('Remove extension', diagnostic, document));
                break;
            case IssueCodes.REPLACE_WORD:
                accept(this.replaceText(diagnostic, document));
                break;
            case IssueCodes.INCONSISTENT_TERM:
                accept(this.replaceWordBySynonym(diagnostic, document));
                break;
            case IssueCodes.REMOVE_EXCESS_TEXT:
                accept(this.removeExcessText(diagnostic, document));
                break;
            case IssueCodes.CREATE_ELEMENT:
                accept(this.createElement(diagnostic, document));
                break;
            case IssueCodes.INCLUDE_ALL:
                accept(this.replaceIncludeAll(diagnostic, document));
                break;
            case IssueCodes.INCLUDE_ELEMENT:
                accept(this.replaceIncludeElement(diagnostic, document));
                break;
            default:
                break;
            //throw new Error(`${diagnostic.code} isn't supported.`);
        }
        return undefined;
    }

    replaceIncludeAll(diagnostic: Diagnostic, document: LangiumDocument<AstNode>): CodeAction | undefined {
        const range = diagnostic.range;
        const data = diagnostic.data;

        const systemName = data[0];
        const newElementsText = data[1];

        return {
            title: `Replace this specification with all elements from the ${systemName} system`,
            kind: CodeActionKind.QuickFix,
            diagnostics: [diagnostic],
            isPreferred: false,
            edit: {
                changes: {
                    [document.textDocument.uri]: [
                        {
                            range,
                            newText: newElementsText,
                        },
                    ],
                },
            },
        };
    }

    replaceIncludeElement(diagnostic: Diagnostic, document: LangiumDocument<AstNode>): CodeAction | undefined {
        const range = diagnostic.range;
        const data = diagnostic.data;

        const elementType = data[0];
        const newElementText = data[1];

        return {
            title: `Replace this specification with the ${elementType} element specification`,
            kind: CodeActionKind.QuickFix,
            diagnostics: [diagnostic],
            isPreferred: false,
            edit: {
                changes: {
                    [document.textDocument.uri]: [
                        {
                            range,
                            newText: newElementText,
                        },
                    ],
                },
            },
        };
    }

    createElement(diagnostic: Diagnostic, document: LangiumDocument<AstNode>): CodeAction | undefined {
        const range = diagnostic.range;
        const data = diagnostic.data;

        const wrongWord = data[0];
        const desiredElement = data[1];
        const elementProperty = data[2] as LinguisticRuleElementProperty;

        range.start.line = document.textDocument.lineCount + 2;
        range.start.character = 0;
        range.end = range.start;

        let newElementSpecification = createSystemConcept(desiredElement, wrongWord, elementProperty);

        return {
            title: `Create '${desiredElement}' with ${elementProperty} '${wrongWord}'`,
            kind: CodeActionKind.QuickFix,
            diagnostics: [diagnostic],
            isPreferred: false,
            edit: {
                changes: {
                    [document.textDocument.uri]: [
                        {
                            range,
                            newText: `\r\n\r\n${newElementSpecification}`,
                        },
                    ],
                },
            },
        };
    }

    removeExcessText(diagnostic: Diagnostic, document: LangiumDocument<AstNode>): CodeAction | undefined {
        const range = diagnostic.range;
        const data = diagnostic.data;

        //let wrongText = data[0];
        let toRemove = data[1];
        let correctText = data[2];

        return {
            title: `Remove '${toRemove}'`,
            kind: CodeActionKind.QuickFix,
            diagnostics: [diagnostic],
            isPreferred: false,
            edit: {
                changes: {
                    [document.textDocument.uri]: [
                        {
                            range,
                            newText: `"${correctText}"`,
                        },
                    ],
                },
            },
        };
    }

    removeString(title: string, diagnostic: Diagnostic, document: LangiumDocument<AstNode>): CodeAction | undefined {
        const range = diagnostic.range;

        // const activeFlow = document.parseResult.value as ActiveFlow
        // console.log('ActiveFlow: ' + activeFlow);

        return {
            title: title,
            kind: CodeActionKind.QuickFix,
            diagnostics: [diagnostic],
            isPreferred: false,
            edit: {
                changes: {
                    [document.textDocument.uri]: [
                        {
                            range,
                            newText: '',
                        },
                    ],
                },
            },
        };
    }

    replaceWordBySynonym(diagnostic: Diagnostic, document: LangiumDocument<AstNode>): CodeAction | undefined {
        const range = diagnostic.range;
        const data = diagnostic.data;

        const wrongWord = data[0];
        const correctWord = data[1];
        const wrongText = data[2];

        const regEx = new RegExp(wrongWord, 'ig');
        const correctText = wrongText.replace(regEx, correctWord);

        return {
            title: `Replace word '${wrongWord}' by the main word '${correctWord}'`,
            kind: CodeActionKind.QuickFix,
            diagnostics: [diagnostic],
            isPreferred: false,
            edit: {
                changes: {
                    [document.textDocument.uri]: [
                        {
                            range,
                            newText: `"${correctText}"`,
                        },
                    ],
                },
            },
        };
    }

    replaceText(diagnostic: Diagnostic, document: LangiumDocument<AstNode>): CodeAction | undefined {
        const range = diagnostic.range;
        const data = diagnostic.data;

        const wrongWord = data[0];
        const correctWord = data[1];
        const wrongText = data[2];

        const regEx = new RegExp(wrongWord, 'ig');
        const correctText = wrongText.replace(regEx, correctWord);

        return {
            title: `Replace '${wrongWord}' by '${correctWord}'`,
            kind: CodeActionKind.QuickFix,
            diagnostics: [diagnostic],
            isPreferred: false,
            edit: {
                changes: {
                    [document.textDocument.uri]: [
                        {
                            range,
                            newText: `"${correctText}"`,
                        },
                    ],
                },
            },
        };
    }
}
