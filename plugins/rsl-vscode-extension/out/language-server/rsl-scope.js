"use strict";
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
exports.RslScopeComputation = void 0;
const langium_1 = require("langium");
const vscode_jsonrpc_1 = require("vscode-jsonrpc");
const ast_1 = require("./generated/ast");
class RslScopeComputation extends langium_1.DefaultScopeComputation {
    constructor(services) {
        super(services);
        this.qualifiedNameProvider = services.references.QualifiedNameProvider;
        this.services = services;
    }
    computeLocalScopes(document, cancelToken = vscode_jsonrpc_1.CancellationToken.None) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const rootNode = document.parseResult.value;
            const scopes = new langium_1.MultiMap();
            // Here we navigate the full AST - local scopes shall be available in the whole document
            for (const node of (0, langium_1.streamAllContents)(rootNode)) {
                yield (0, langium_1.interruptAndCheck)(cancelToken);
                this.processNodeSingleScope(node, document, scopes, rootNode);
            }
            //fazer regex?
            //importedNamespace = Package1.Package2.BillingApp_Asl.SizeKind
            //importedNamespace = Package1.Package2.BillingApp_Asl.*
            let filteredNamespace = new Map();
            for (const imp of rootNode.packages[0].imports) {
                let key = imp.importedNamespace.substring(0, imp.importedNamespace.lastIndexOf('.'));
                let value = imp.importedNamespace.substring(imp.importedNamespace.lastIndexOf('.') + 1);
                if (key in filteredNamespace) {
                    (_a = filteredNamespace.get(key)) === null || _a === void 0 ? void 0 : _a.push(value);
                }
                else {
                    filteredNamespace.set(key, [value,]);
                }
            }
            let imports = this.services.shared.workspace.LangiumDocuments.all
                .map(doc => { var _a; return (_a = doc.parseResult) === null || _a === void 0 ? void 0 : _a.value; })
                .filter(node => node && node != rootNode)
                .filter(node => {
                let model = node;
                for (const [key, _] of filteredNamespace) {
                    if (key === model.packages[0].name)
                        return true;
                }
                return false;
            }).toArray();
            for (const headNode of imports) {
                const filters = filteredNamespace.get(headNode.packages[0].name);
                if (!filters)
                    continue;
                if (filters.includes('*')) {
                    for (const node of (0, langium_1.streamAllContents)(headNode)) {
                        yield (0, langium_1.interruptAndCheck)(cancelToken);
                        this.processNodeImportScope(node, document, scopes, rootNode, headNode);
                    }
                }
                else {
                    for (const node of (0, langium_1.streamAllContents)(headNode)) {
                        yield (0, langium_1.interruptAndCheck)(cancelToken);
                        this.processNodeFilteredImportScope(node, document, scopes, rootNode, filters, headNode);
                    }
                }
            }
            return scopes;
        });
    }
    processNodeFilteredImportScope(node, document, scopes, rootNode, filters, importedModel) {
        const container = node.$container;
        if (container) {
            const name = this.nameProvider.getName(node);
            if (name && filters.includes(name)) {
                this.processNodeImportScope(node, document, scopes, rootNode, importedModel);
            }
        }
    }
    processNodeImportScope(node, document, scopes, rootNode, importedModel) {
        const container = node.$container;
        //const packageName = importedModel.packages.at(0)?.name as string;
        if (container) {
            const name = this.nameProvider.getName(node);
            if (name) {
                if (!(0, ast_1.isSystem)(node.$container)) {
                    scopes.add(rootNode, this.descriptions.createDescription(node, this.qualifiedNameProvider.getQualifiedName(container, name), document));
                }
                scopes.add(rootNode, this.descriptions.createDescription(node, name, document));
            }
        }
    }
    processNodeSingleScope(node, document, scopes, model) {
        const container = node.$container;
        if (container) {
            const name = this.nameProvider.getName(node);
            if (name) {
                if (!(0, ast_1.isSystem)(node.$container)) {
                    scopes.add(model, this.descriptions.createDescription(node, this.qualifiedNameProvider.getQualifiedName(container, name), document));
                }
                scopes.add(model, this.descriptions.createDescription(node, name, document));
            }
        }
    }
}
exports.RslScopeComputation = RslScopeComputation;
//# sourceMappingURL=rsl-scope.js.map