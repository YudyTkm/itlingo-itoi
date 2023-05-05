/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import {  AstNodeDescription, DefaultScopeProvider, LangiumServices, ReferenceInfo, Scope, ScopeOptions, stream, StreamScope } from 'langium';

/**
 * Special scope provider that matches symbol names regardless of lowercase or uppercase.
 */
export class AslScopeProvider extends DefaultScopeProvider {

    services: LangiumServices;

    constructor(services: LangiumServices){
        super(services);
        this.services = services;
    }
    

    protected override createScope(elements: Iterable<AstNodeDescription>, outerScope: Scope, options?: ScopeOptions): Scope {
        return new StreamScope(stream(elements), outerScope, { ...options, caseInsensitive: false });
    }

    protected override getGlobalScope(referenceType: string, _context: ReferenceInfo): Scope {
        let streamScope = this.indexManager.allElements(referenceType);
        return new StreamScope(streamScope, undefined, undefined);
    }

}
