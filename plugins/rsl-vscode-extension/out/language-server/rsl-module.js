"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRslServices = exports.RslModule = void 0;
const langium_1 = require("langium");
const module_1 = require("./generated/module");
const rsl_naming_1 = require("./rsl-naming");
const rsl_scope_1 = require("./rsl-scope");
const rsl_completion_1 = require("./rsl-completion");
const rsl_scope_provider_1 = require("./rsl-scope-provider");
const rsl_linker_1 = require("./rsl-linker");
/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
exports.RslModule = {
    references: {
        ScopeComputation: (services) => new rsl_scope_1.RslScopeComputation(services),
        ScopeProvider: (services) => new rsl_scope_provider_1.RslScopeProvider(services),
        Linker: (services) => new rsl_linker_1.RslLinker(services),
        QualifiedNameProvider: () => new rsl_naming_1.QualifiedNameProvider()
    },
    lsp: {
        CompletionProvider: (services) => new rsl_completion_1.RslCompletionProvider(services)
    }
};
/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
function createRslServices(context) {
    const shared = (0, langium_1.inject)((0, langium_1.createDefaultSharedModule)(context), module_1.RslGeneratedSharedModule);
    const Rsl = (0, langium_1.inject)((0, langium_1.createDefaultModule)({ shared }), module_1.RslGeneratedModule, exports.RslModule);
    shared.ServiceRegistry.register(Rsl);
    // registerValidationChecks(Rsl);
    return { shared, Rsl };
}
exports.createRslServices = createRslServices;
//# sourceMappingURL=rsl-module.js.map