import {
    AstNode,
    AstNodeDescription,
    AstNodeLocator,
    DefaultScopeProvider,
    EMPTY_SCOPE,
    LangiumDocuments,
    ReferenceInfo,
    Scope,
    StreamScope,
    getContainerOfType,
    getDocument,
    stream,
} from 'langium';
import {
    Import,
    IncludeElement,
    PackageSystem,
    isData,
    isDataTableHeader,
    isIncludeElement,
    isIncludeElementGeneric,
    isPackageSystem,
    isSystem,
} from './generated/ast';
import { RslServices } from './rsl-module';
import { RslNameProvider } from './rsl-naming';

export class RslScopeProvider extends DefaultScopeProvider {
    protected readonly astNodeLocator: AstNodeLocator;
    protected readonly langiumDocuments: LangiumDocuments;

    constructor(services: RslServices) {
        super(services);
        this.astNodeLocator = services.workspace.AstNodeLocator;
        this.langiumDocuments = services.shared.workspace.LangiumDocuments;
    }

    override getScope(context: ReferenceInfo): Scope {
        return this.getScopeInternal(context, context.container);
    }

    override getGlobalScope(referenceType: string, context: ReferenceInfo): Scope {
        let fqNameToRemove = '';
        const system = getContainerOfType(context.container, isSystem);
        if (system) {
            fqNameToRemove = (this.nameProvider as RslNameProvider).getQualifiedName(system);
        }

        const model = getContainerOfType(context.container, isPackageSystem);
        if (!model) {
            return EMPTY_SCOPE;
        }

        const imports = model.imports;

        let matchingElements: AstNodeDescription[] = [];

        for (let element of this.indexManager.allElements(referenceType)) {
            let node = element.node;
            let path = element.path;
            let name = element.name;

            const imp = imports.find((x) => matchingImport(x, name)); // sort first by the ones that end with * ?

            if (imp) {
                name = normalizeImport(imp, name);
            } else {
                name = name.replace(`${fqNameToRemove}.`, '');
            }

            const newElement: AstNodeDescription = {
                node: node,
                name: name,
                nameSegment: element.nameSegment,
                selectionSegment: element.selectionSegment,
                type: element.type,
                documentUri: element.documentUri,
                path: path,
            };
            matchingElements.push(newElement);
        }

        if (referenceType === 'System' || referenceType === 'State') {
            matchingElements = matchingElements.filter((x) => x.name.split('.').length === 1);
        }

        if (matchingElements.length === 0) {
            return EMPTY_SCOPE;
        }

        return new StreamScope(stream(matchingElements));
    }

    private getScopeInternal(refInfo: ReferenceInfo, context?: AstNode): Scope {
        if (!context) {
            return super.getScope(refInfo);
        }

        if (isDataTableHeader(context)) {
            let data = getContainerOfType(context, isData);

            let elements: AstNodeDescription[] = [];
            for (let element of super.getScope(refInfo).getAllElements()) {
                if (data && data.type.ref) {
                    const attributes = data.type.ref.attributes;
                    if (!attributes.some((x) => this.astNodeLocator.getAstNodePath(x) === element.path)) {
                        continue;
                    }
    
                    elements.push(element);
                }
            }
            
            return this.createScope(elements);
        } else if (isIncludeElementGeneric(context)) {
            if (isIncludeElement(context) && refInfo.property === 'element') {
                //return super.getScope(refInfo);
                return this.getIncludeElementScope(refInfo, context as IncludeElement);
            }

            const contextDocument = getDocument(context);
            let elements: AstNodeDescription[] = [];
            for (let element of super.getScope(refInfo).getAllElements()) {
                if (element.documentUri.fsPath === contextDocument.uri.fsPath) {
                    continue;
                }

                elements.push(element);
            }

            return this.createScope(elements);
        }

        return super.getScope(refInfo);
    }

    private getIncludeElementScope(refInfo: ReferenceInfo, includeElement: IncludeElement): Scope {
        let type = includeElement.type;
        let system = includeElement.system?.ref;
        if (!type || !system) {
            return super.getScope(refInfo);
        }

        let packageSystem = system.$container as PackageSystem;

        if (!packageSystem) {
            return super.getScope(refInfo);
        }

        let elements = system.systemConcepts.filter((x) => x.$type === type.type);

        return this.createScopeForNodes(elements);
    }
}

function matchingImport(imp: Import, qualifiedName: string): boolean {
    let importedNamespace = imp.importedNamespace.split('.');
    let elementQualifiedName = qualifiedName.split('.');

    if (importedNamespace.length === 0 || elementQualifiedName.length === 0) {
        return false;
    }

    for (let i = 0; i < importedNamespace.length; i++) {
        if (importedNamespace[i] === '*') {
            continue;
        }

        if (importedNamespace[i] !== elementQualifiedName[i]) {
            return false;
        }
    }

    return true;
}

function normalizeImport(imp: Import, name: string): string {
    let importedNamespace = imp.importedNamespace.split('.');

    if (imp.importedNamespace === name) {
        return importedNamespace[importedNamespace.length - 1];
    }

    if (importedNamespace[importedNamespace.length - 1] !== '*') {
        return name.replace(`${imp.importedNamespace}.`, '');
    }

    importedNamespace.pop();

    return name.replace(`${importedNamespace.join('.')}.`, '');
}
