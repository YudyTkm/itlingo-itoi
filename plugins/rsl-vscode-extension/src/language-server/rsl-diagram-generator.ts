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
import { SEdge, SLabel, SModelRoot, SNode } from 'sprotty-protocol';
 import {  Actor, Model, UseCase, View } from './generated/ast';

export class RslDiagramGenerator extends LangiumDiagramGenerator {

    protected generateRoot(args: GeneratorContext<Model>): SModelRoot {
        const { document } = args;
        const root = document.parseResult.value;
        let views = this.fetchListOfViews(root, args);
        const {sNode, argsNodes} = this.mapViewsToSNodes(views, args);
        let sEdges = this.fetchListOfEdges(views, argsNodes);

        return {
            type: 'graph',
            cssClasses: ['sprottyCss'],
            id: 'root',
            children: [...sNode, ...sEdges]
        };
    }

    mapViewsToSNodes(views: View[], args: GeneratorContext<Model>): 
    {sNode: SNode[], 
     argsNodes: GeneratorContext<Model>} {
        let nodes: SNode[] = []
        for(const v of views){
            switch(v.type.type){
                case "UseCaseView":
                    for(const elem of v.elements.references){
                        if(!elem.ref) continue;
                        if(elem.ref.$type === 'UseCase') {
                            let uc  = elem.ref as UseCase;
                            nodes.push(this.generateUseCaseNode(uc, args));
                        } else if(elem.ref.$type === 'Actor') {
                            let actor  = elem.ref as Actor;
                            let actorNode = this.generateActorNode(actor, args);
                            if(actorNode) nodes.push(actorNode);
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        return {sNode: nodes, argsNodes: args};
    }

    protected generateViewNode(view: View, { idCache }: GeneratorContext<Model>): SNode {
        const nodeId = idCache.uniqueId(view.name, view);
        return {
            type: 'node',
            id: nodeId,
            children: [
                <SLabel>{
                    type: 'label',
                    id: idCache.uniqueId(nodeId + '.label'),
                    text: view.name
                },
                // <SPort>{
                //     type: 'port',
                //     id: idCache.uniqueId(nodeId + '.newTransition')
                // }
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


    protected generateUseCaseNode(uc: UseCase, { idCache }: GeneratorContext<Model>): SNode {
        const nodeId = idCache.uniqueId(uc.name, uc);
        return {
            type: 'node',
            id: nodeId,
            children: [
                <SLabel>{
                    type: 'label',
                    id: idCache.uniqueId(nodeId + '.label'),
                    text: uc.name
                },
                // <SPort>{
                //     type: 'port',
                //     id: idCache.uniqueId(nodeId + '.newTransition')
                // }
            ],
            layout: 'stack',
            layoutOptions: {
                paddingTop: 10.0,
                paddingBottom: 10.0,
                paddingLeft: 10.0,
                paddingRight: 10.0,
                "background-color": "coral"
            }
        };
    }

    protected generateActorNode(actor: Actor, { idCache }: GeneratorContext<Model>): SNode | undefined {
        if (idCache.isIdAlreadyUsed(actor.name)) return ;
        const nodeId = idCache.uniqueId(actor.name, actor);
        return {
            type: 'node',
            id: nodeId,
            children: [
                <SLabel>{
                    type: 'label',
                    id: idCache.uniqueId(nodeId + '.label'),
                    text: actor.name
                },
                // <SPort>{
                //     type: 'port',
                //     id: idCache.uniqueId(nodeId + '.newTransition')
                // }
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


    private fetchListOfViews(root: Model, args: GeneratorContext<Model>): View[] {
        let views = root.packages[0].system?.systemConcepts
                .filter(sc => sc.$type === "View")
                .map(se => se as View)
        return views as View[];
    }

    private fetchListOfEdges(views: View[], args: GeneratorContext<Model>): SEdge[] {
        let edges: SEdge[] = []
        for(const v of views){
            switch(v.type.type){
                case "UseCaseView":
                    for(const elem of v.elements.references){
                        if(!elem.ref) continue;
                        if(elem.ref.$type === 'UseCase') {
                            let uc  = elem.ref as UseCase;
                            if(uc.primaryActor && uc.primaryActor.ref && isActorInView(uc.primaryActor.ref, v)) {
                                let actor: Actor = uc.primaryActor.ref as Actor;
                                edges.push(this.generateActorInitiatesEdge(actor, uc, args))
                            }

                            if(uc.includes){
                                for(const includeUC of uc.includes.includes){
                                    for(const ucref of includeUC.refs){
                                        if(ucref.ref && isUseCaseInView(ucref.ref, v)){
                                            let useCase: UseCase = ucref.ref as UseCase;
                                            edges.push(this.generateUseCaseIncludesEdge(useCase, uc, args))
                                        }
                                    }
                                }

                            }
                            if(uc.extends){
                                for(const extendsUC of uc.extends){
                                    if(extendsUC.usecase.ref && isUseCaseInView(extendsUC.usecase.ref, v)){
                                        let useCase: UseCase = extendsUC.usecase.ref as UseCase;
                                        edges.push(this.generateUseCaseExtendsEdge(useCase, uc, args))
                                    }
                                }

                            }

                        } 
                    }
                    break;
                default:
                    break;
            }
        }
        return edges
    }
    generateUseCaseIncludesEdge(useCase: UseCase, uc: UseCase, { idCache }: GeneratorContext<Model>): SEdge {
        const sourceId = idCache.getId(uc);
        const destinationId = idCache.getId(useCase);
        
        return {
            type: 'edge',
            id: sourceId! + destinationId! + "edge",
            sourceId: sourceId!,
            targetId: destinationId!,
            children: [
                <SLabel>{
                    type: 'label:xref',
                    id: idCache.uniqueId(sourceId! + destinationId! + '.label'),
                    text: "<<include>>"
                }
            ]
        };
    }
    
    generateUseCaseExtendsEdge(useCase: UseCase, uc: UseCase, { idCache }: GeneratorContext<Model>): SEdge {
        const sourceId = idCache.getId(uc);
        const destinationId = idCache.getId(useCase);
        
        return {
            type: 'edge',
            id: sourceId! + destinationId! + "edge",
            sourceId: sourceId!,
            targetId: destinationId!,
            children: [
                <SLabel>{
                    type: 'label:xref',
                    id: idCache.uniqueId(sourceId! + destinationId! + '.label'),
                    text: "<<extend>>"
                }
            ]
        };
    }


    protected generateActorInitiatesEdge(actor: Actor, uc: UseCase, { idCache }: GeneratorContext<Model>): SEdge {
        const sourceId = idCache.getId(actor);
        const destinationId = idCache.getId(uc);
        
        return {
            type: 'edge',
            id: sourceId! + destinationId! + "edge",
            sourceId: sourceId!,
            targetId: destinationId!,
            children: [
                <SLabel>{
                    type: 'label:xref',
                    id: idCache.uniqueId(sourceId! + destinationId! + '.label'),
                    text: ""
                }
            ]
        };
    }

}
function isActorInView(ref: Actor, v: View): boolean {
    for(const elem of v.elements.references){
        if(elem.ref){
            if(elem.ref.$type === 'Actor'){
                if(elem.ref.name === ref.name){
                    return true;
                }
            }
        }
    }
    return false;
}

function isUseCaseInView(uc: UseCase, v: View): boolean {
    for(const elem of v.elements.references){
        if(elem.ref){
            if(elem.ref.$type === 'UseCase'){
                if(elem.ref.name === uc.name ){
                    return true;
                }
            }
        }
    }
    return false;
}

