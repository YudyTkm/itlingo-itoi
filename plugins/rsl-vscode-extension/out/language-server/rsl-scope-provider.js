"use strict";
/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.RslScopeProvider = void 0;
const langium_1 = require("langium");
/**
 * Special scope provider that matches symbol names regardless of lowercase or uppercase.
 */
class RslScopeProvider extends langium_1.DefaultScopeProvider {
    constructor(services) {
        super(services);
        this.services = services;
    }
    createScope(elements, outerScope, options) {
        return new langium_1.StreamScope((0, langium_1.stream)(elements), outerScope, Object.assign(Object.assign({}, options), { caseInsensitive: false }));
    }
    getGlobalScope(referenceType, _context) {
        let streamScope = this.indexManager.allElements(referenceType);
        return new langium_1.StreamScope(streamScope, undefined, undefined);
    }
}
exports.RslScopeProvider = RslScopeProvider;
//# sourceMappingURL=rsl-scope-provider.js.map