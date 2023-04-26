/********************************************************************************
 * Copyright (c) 2021 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { GeneratorContext, LangiumDiagramGenerator } from 'langium-sprotty';
import { SEdge, SLabel, SModelRoot, SNode, SPort } from 'sprotty-protocol';
import { PackageSystem, System, SystemElement } from './generated/ast';

export class AslDiagramGenerator extends LangiumDiagramGenerator {

    protected generateRoot(args: GeneratorContext<PackageSystem>): SModelRoot {
        const { document } = args;
        const sm = document.parseResult.value;
        return {
            type: 'graph',
            id: sm.name ?? 'root',
            children: [
             
            ]
        };
    }

    protected generateNode(state: System, { idCache }: GeneratorContext<PackageSystem>): SNode {
        const nodeId = idCache.uniqueId(state.name, state);
        return {
            type: 'node',
            id: nodeId,
            children: [
                <SLabel>{
                    type: 'label',
                    id: idCache.uniqueId(nodeId + '.label'),
                    text: state.name
                },
                <SPort>{
                    type: 'port',
                    id: idCache.uniqueId(nodeId + '.newTransition')
                }
            ],
            layout: 'stack',
            layoutOptions: {
                paddingTop: 10.0,
                paddingBottom: 10.0,
                paddingLeft: 10.0,
                paddingRight: 10.0
            }
        };
    }

    protected generateEdge(transition: SystemElement, { idCache }: GeneratorContext<PackageSystem>): SEdge {
        const sourceId = idCache.getId(transition.$container);
    
        return {
            type: 'edge',
            id: "11",
            sourceId: sourceId!,
            targetId: sourceId!,
            children: [
                <SLabel>{
                    type: 'label:xref',
                    id: idCache.uniqueId(sourceId + '.label'),
                    text: "baba"
                }
            ]
        };
    }

}
