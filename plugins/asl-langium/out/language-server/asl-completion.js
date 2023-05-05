"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AslCompletionProvider = void 0;
const langium_1 = require("langium");
const ast = __importStar(require("langium/lib/grammar/generated/ast"));
const vscode_languageserver_1 = require("vscode-languageserver");
class AslCompletionProvider extends langium_1.DefaultCompletionProvider {
    getCompletion(document, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const root = document.parseResult.value;
            const cst = root.$cstNode;
            if (!cst) {
                return undefined;
            }
            const items = [];
            const textDocument = document.textDocument;
            const text = textDocument.getText();
            const offset = textDocument.offsetAt(params.position);
            const acceptor = value => {
                const completionItem = this.fillCompletionItem(textDocument, offset, value);
                if (completionItem) {
                    items.push(completionItem);
                }
            };
            const node = (0, langium_1.findLeafNodeAtOffset)(cst, this.backtrackToAnyToken(text, offset));
            const context = {
                document,
                textDocument,
                node: node === null || node === void 0 ? void 0 : node.element,
                offset,
                position: params.position
            };
            if (!node) {
                const parserRule = (0, langium_1.getEntryRule)(this.grammar);
                yield this.completionForRule(context, parserRule, acceptor);
                return vscode_languageserver_1.CompletionList.create(items, true);
            }
            const parserStart = this.backtrackToTokenStart(text, offset);
            const beforeFeatures = this.findFeaturesAt(textDocument, parserStart);
            let afterFeatures = [];
            const reparse = this.canReparse() && offset !== parserStart;
            if (reparse) {
                afterFeatures = this.findFeaturesAt(textDocument, offset);
            }
            const distinctionFunction = (element) => {
                if (ast.isKeyword(element.feature)) {
                    return element.feature.value;
                }
                else {
                    return element.feature;
                }
            };
            yield Promise.all((0, langium_1.stream)(beforeFeatures)
                .distinct(distinctionFunction)
                .map(e => this.completionFor(context, e, acceptor)));
            if (reparse) {
                yield Promise.all((0, langium_1.stream)(afterFeatures)
                    .exclude(beforeFeatures, distinctionFunction)
                    .distinct(distinctionFunction)
                    .map(e => this.completionFor(context, e, acceptor)));
            }
            return vscode_languageserver_1.CompletionList.create(items, true);
        });
    }
    completionFor(context, next, acceptor) {
        if (ast.isKeyword(next.feature)) {
            return this.completionForKeyword(context, next.feature, acceptor);
        }
        else if (ast.isCrossReference(next.feature) && context.node) {
            return this.completionForCrossReference(context, next, acceptor);
        }
    }
    completionForKeyword(context, keyword, acceptor) {
        // Filter out keywords that do not contain any word character
        if (!keyword.value.match(/[\w]|[\[]|[\]]|[\(]|[\)]|[\:]/)) {
            return;
        }
        if (keyword.value.match(/[\[]|[\]]|[\(]|[\)]|[\:]/)) {
            return acceptor({
                label: keyword.value,
                kind: vscode_languageserver_1.CompletionItemKind.Keyword,
                detail: 'Keyword',
                sortText: '-1'
            });
            ;
        }
        acceptor({
            label: keyword.value,
            kind: vscode_languageserver_1.CompletionItemKind.Keyword,
            detail: 'Keyword',
            sortText: '1'
        });
    }
}
exports.AslCompletionProvider = AslCompletionProvider;
//# sourceMappingURL=asl-completion.js.map