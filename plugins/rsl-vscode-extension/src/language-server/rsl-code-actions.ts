import { AstNode, CodeActionProvider, EOL, LangiumDocument, MaybePromise } from 'langium';
import { CodeAction, CodeActionKind, Command, Diagnostic } from 'vscode-languageserver-types';
import { CodeActionParams, CancellationToken } from 'vscode-languageserver-protocol';
import { IssueCodes } from './rsl-validator';
import { createSystemConcept } from '../util/rsl-utilities';
import { LinguisticRuleElementProperty } from './generated/ast';

/**
 * Provides code actions for RSL documents.
 */
export class RslActionProvider implements CodeActionProvider {
    /**
     * Handle a code action request.
     *
     * @param document    The LangiumDocument representing the document in which the code action is requested.
     * @param params      The CodeActionParams containing information about the code action request.
     * @param cancelToken Optional CancellationToken for cancellation support.
     * @returns A MaybePromise that resolves to an array of Command or CodeAction objects, or undefined.
     * @throws OperationCancelled if cancellation is detected during execution.
     * @throws ResponseError if an error is detected that should be sent as a response to the client.
     */
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

    /**
     * Create code actions for a given diagnostic.
     *
     * @param diagnostic The diagnostic object representing the code issue.
     * @param document   The `LangiumDocument` representing the RSL document.
     * @param accept     A callback function to accept the created code action.
     */
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

    /**
     * Creates a code action for replacing the entire specification with all elements from a system.
     *
     * @param diagnostic The diagnostic object representing the code issue.
     * @param document   The `LangiumDocument` representing the RSL document.
     * @returns A `CodeAction` object or `undefined`.
     */
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

    /**
     * Creates a code action for replacing a specification with a specific element from a system.
     *
     * @param diagnostic The diagnostic object representing the code issue.
     * @param document   The `LangiumDocument` representing the RSL document.
     * @returns A `CodeAction` object or `undefined`.
     */
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

    /**
     * Creates a code action for creating a element specification with a specific property value.
     *
     * @param diagnostic The diagnostic object representing the code issue.
     * @param document   The `LangiumDocument` representing the RSL document.
     * @returns A `CodeAction` object or `undefined`.
     */
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
                            newText: `${EOL}${EOL}${newElementSpecification}`,
                        },
                    ],
                },
            },
        };
    }

    /**
     * Creates a code action for removing excess text in a specification.
     *
     * @param diagnostic The diagnostic object representing the code issue.
     * @param document   The `LangiumDocument` representing the RSL document.
     * @returns A `CodeAction` object or `undefined`.
     */
    removeExcessText(diagnostic: Diagnostic, document: LangiumDocument<AstNode>): CodeAction | undefined {
        const range = diagnostic.range;
        const data = diagnostic.data;

        const toRemove = data[0];

        const wrongText = document.textDocument.getText(range);

        const regEx = new RegExp(toRemove, 'ig');
        const correctText = wrongText.replace(regEx, '');

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
                            newText: correctText,
                        },
                    ],
                },
            },
        };
    }

    /**
     * Creates a code action for removing a specific string in a specification.
     *
     * @param title      The title of the code action.
     * @param diagnostic The diagnostic object representing the code issue.
     * @param document   The `LangiumDocument` representing the RSL document.
     * @returns A `CodeAction` object or `undefined`.
     */
    removeString(title: string, diagnostic: Diagnostic, document: LangiumDocument<AstNode>): CodeAction | undefined {
        const range = diagnostic.range;

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

    /**
     * Creates a code action for replacing a specific word with its synonym in a specification.
     *
     * @param diagnostic The diagnostic object representing the code issue.
     * @param document   The `LangiumDocument` representing the RSL document.
     * @returns A `CodeAction` object or `undefined`.
     */
    replaceWordBySynonym(diagnostic: Diagnostic, document: LangiumDocument<AstNode>): CodeAction | undefined {
        const range = diagnostic.range;
        const data = diagnostic.data;

        const wrongWord = data[0];
        const correctWord = data[1];

        const wrongText = document.textDocument.getText(range);

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
                            newText: correctText,
                        },
                    ],
                },
            },
        };
    }

    /**
     * Creates a code action for replacing a specific word in a specification.
     *
     * @param diagnostic The diagnostic object representing the code issue.
     * @param document   The `LangiumDocument` representing the RSL document.
     * @returns A `CodeAction` object or `undefined`.
     */
    replaceText(diagnostic: Diagnostic, document: LangiumDocument<AstNode>): CodeAction | undefined {
        const range = diagnostic.range;
        const data = diagnostic.data;

        const wrongWord = data[0];
        const correctWord = data[1];

        const wrongText = document.textDocument.getText(range);

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
                            newText: correctText,
                        },
                    ],
                },
            },
        };
    }
}
