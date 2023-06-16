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
class RslScopeComputation extends langium_1.DefaultScopeComputation {
    constructor(services) {
        super(services);
    }
    computeExports(document, cancelToken = vscode_jsonrpc_1.CancellationToken.None) {
        return __awaiter(this, void 0, void 0, function* () {
            const exportedDescriptions = [];
            for (const node of (0, langium_1.streamAllContents)(document.parseResult.value)) {
                yield (0, langium_1.interruptAndCheck)(cancelToken);
                if (!(0, langium_1.isNamed)(node)) {
                    continue;
                }
                const fullyQualifiedName = this.nameProvider.getQualifiedName(node);
                exportedDescriptions.push(this.descriptions.createDescription(node, fullyQualifiedName, document));
            }
            return exportedDescriptions;
        });
    }
}
exports.RslScopeComputation = RslScopeComputation;
//# sourceMappingURL=rsl-scope-computation.js.map