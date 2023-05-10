import {
    AstNode, AstNodeDescription, DefaultScopeComputation, interruptAndCheck, LangiumDocument,
    LangiumServices,
    MultiMap,
    PrecomputedScopes, streamAllContents
} from 'langium';
import { CancellationToken } from 'vscode-jsonrpc';
import type { AslServices } from './asl-module';
import { QualifiedNameProvider } from './asl-naming';
import { isSystem, Model } from './generated/ast';


export class AslScopeComputation extends DefaultScopeComputation {

    services: LangiumServices;
    qualifiedNameProvider: QualifiedNameProvider;

    constructor(services: AslServices) {
        super(services);
        this.qualifiedNameProvider = services.references.QualifiedNameProvider;
        this.services = services;
    }

    
    override async computeLocalScopes(document: LangiumDocument, cancelToken = CancellationToken.None): Promise<PrecomputedScopes> {
        const rootNode = document.parseResult.value as Model;
        const scopes = new MultiMap<AstNode, AstNodeDescription>();
        // Here we navigate the full AST - local scopes shall be available in the whole document
        for (const node of streamAllContents(rootNode)) {
            await interruptAndCheck(cancelToken);
            this.processNodeSingleScope(node, document, scopes, rootNode);
        }

        //fazer regex?
        //importedNamespace = Package1.Package2.BillingApp_Asl.SizeKind
        //importedNamespace = Package1.Package2.BillingApp_Asl.*
        let filteredNamespace: Map<string, string[]> = new Map<string, string[]>();
        
        for(const imp of rootNode.packages[0].imports){
            let importIdentifier = imp.importedNamespace.substring(0, imp.importedNamespace.lastIndexOf('.'));
            let pack = importIdentifier.substring(0, importIdentifier.lastIndexOf('.'));
            let system = importIdentifier.substring(importIdentifier.lastIndexOf('.')+1);;
            let identifier: string = pack+ "," + system;
            let value = imp.importedNamespace.substring(imp.importedNamespace.lastIndexOf('.')+1);
            if (identifier in filteredNamespace){
                filteredNamespace.get(identifier)?.push(value);
            } else {
                filteredNamespace.set(identifier, [value,])
            }
            
        }
            
        let imports = this.services.shared.workspace.LangiumDocuments.all
        .map(doc => doc.parseResult?.value)
        .filter(node => node && node != rootNode)
        .filter(node => {
            let model : Model = node as Model;
            for(const [key, _] of filteredNamespace){
                let keys = key.split(",");
                if (keys[0] === model.packages[0].name && keys[1] === model.packages[0].system.name) return true;
            }
            return false;
        }).toArray();
            
        for (const headNode of imports){
            const filters = filteredNamespace.get((headNode as Model).packages[0].name + "," + (headNode as Model).packages[0].system.name);
             if (!filters) continue;
            if(filters.includes('*')) {
                for (const node of streamAllContents(headNode)) {
                    await interruptAndCheck(cancelToken);
                    this.processNodeImportScope(node, document, scopes, rootNode, headNode as Model);
                }
            } else {
                for (const node of streamAllContents(headNode)) {
                    await interruptAndCheck(cancelToken);
                    this.processNodeFilteredImportScope(node, document, scopes, rootNode, filters, headNode as Model);
                }
            }
        }

        return scopes;


    }
    processNodeFilteredImportScope(node: AstNode, document: LangiumDocument<AstNode>, scopes: MultiMap<AstNode, AstNodeDescription>, rootNode: Model, filters: string[], importedModel:Model) {
        const container = node.$container;
        if (container) {
            const name = this.nameProvider.getName(node);
            if (name && filters.includes(name)) {
                this.processNodeImportScope(node, document, scopes, rootNode, importedModel);
            }
        }
    }
    processNodeImportScope(node: AstNode, document: LangiumDocument<AstNode>, scopes: MultiMap<AstNode, AstNodeDescription>, rootNode: Model, importedModel: Model) {
        const container = node.$container;
        //const packageName = importedModel.packages.at(0)?.name as string;
        if (container) {
            const name = this.nameProvider.getName(node);
            if (name) {
                if (!isSystem(node.$container)){
                    scopes.add(rootNode, this.descriptions.createDescription(node, this.qualifiedNameProvider.getQualifiedName(container, name), document));
                }
                scopes.add(rootNode, this.descriptions.createDescription(node,name, document));
            }
        }
    }
    
    processNodeSingleScope(node: AstNode, document: LangiumDocument, scopes: PrecomputedScopes, model: Model): void {
        const container = node.$container;
        if (container) {
            const name = this.nameProvider.getName(node);
            if (name) {
                if (!isSystem(node.$container)){
                    scopes.add(model, this.descriptions.createDescription(node, this.qualifiedNameProvider.getQualifiedName(container, name), document));
                }
                scopes.add(container, this.descriptions.createDescription(node, name, document));
            }
        }
    }




}

