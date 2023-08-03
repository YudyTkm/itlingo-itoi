"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStereotypeType = exports.getDataAttributes = exports.getSteps = exports.getScenarios = exports.getMainScenarios = exports.getData = exports.getDataEntityClusters = exports.getDataEntities = exports.getDataEnumerations = exports.getUseCases = exports.isGlossaryTermApplicableTo = exports.getGlossaryTerms = exports.getUserStories = exports.getLinguisticRules = exports.getLinguisticLanguageType = exports.getLinguisticLanguages = exports.getConstraints = exports.getFRs = exports.getQRs = exports.getGoals = exports.getActiveFlows = exports.getActiveEvents = exports.getActiveTasks = exports.getStateMachines = exports.getActors = exports.getStakeholders = exports.getRisks = exports.getVulnerabilities = exports.getVisibleElements = exports.createSystemConcept = void 0;
const ast_1 = require("../language-server/generated/ast");
/**
* Creates a system concept element.
*
* @param desiredElement      Type of element to create.
* @param elementPropertyText The text of the element property (ID, Name or Description) to create.
* @param ruleElementProperty The property of the element to create
* @returns A system concept element.
* @throws Error in case the `desiredElement` is undefined or is not supported.
*/
function createSystemConcept(desiredElement, elementPropertyText, ruleElementProperty) {
    if (!desiredElement) {
        throw new Error('desiredElement cannot be undefined');
    }
    switch (desiredElement.toLowerCase()) {
        case 'glossaryterm':
            return createElement('Term', 'term_', 'Noun', elementPropertyText, ruleElementProperty);
        case 'vulnerability':
            return createElement('Vulnerability', 'vul_', 'Other', elementPropertyText, ruleElementProperty);
        case 'risk':
            return createElement('Risk', 'r_', 'Other', elementPropertyText, ruleElementProperty);
        case 'stakeholder':
            return createElement('Stakeholder', 'stk_', 'Other', elementPropertyText, ruleElementProperty);
        case 'actor':
            return createElement('Actor', 'a_', 'Other', elementPropertyText, ruleElementProperty);
        case 'statemachine':
            return createStateMachine(elementPropertyText, ruleElementProperty);
        case 'activetask':
            return createElement('Task', 'at_', 'Undefined', elementPropertyText, ruleElementProperty);
        case 'activeevent':
            return createElement('Event', 'ev_', 'Undefined', elementPropertyText, ruleElementProperty);
        case 'activeflow':
            return createActiveFlow(elementPropertyText, ruleElementProperty);
        case 'goal':
            return createElement('Goal', 'g_', 'Other', elementPropertyText, ruleElementProperty);
        case 'qr':
            return createElement('QR', 'qr_', 'Other', elementPropertyText, ruleElementProperty);
        case 'fr':
            return createElement('FR', 'fr_', 'Functional', elementPropertyText, ruleElementProperty);
        case 'constraint':
            return createElement('Constraint', 'c_', 'Other', elementPropertyText, ruleElementProperty);
        case 'userstory':
            return createUserStory(elementPropertyText, ruleElementProperty);
        case 'usecase':
            return createUseCase(elementPropertyText, ruleElementProperty);
        case 'dataenumeration':
            return createDataEnumeration(elementPropertyText, ruleElementProperty);
        case 'dataentity':
            return createElement('DataEntity', 'de_', 'Other', elementPropertyText, ruleElementProperty);
        case 'dataentitycluster':
            return createDataEntityCluster(elementPropertyText, ruleElementProperty);
        case 'actiontype':
            return createActionType(elementPropertyText, ruleElementProperty);
        case 'mainscenario':
        case 'scenario':
        case 'step':
        case 'acceptancecriteriascenario':
        case 'dataattribute':
        case 'system':
        case 'testsuite':
        case 'acceptancecriteriatest':
        case 'dataentitytest':
        case 'usecasetest':
        case 'statemachinetest':
        case 'acceptancecriteriatestview':
        case 'usecasetestview':
        case 'dataentitytestview':
        case 'statemachinetestview':
        case 'data':
        case 'testdata':
        case 'other':
            throw new Error(`Element ${desiredElement} is not supported`);
        default:
            throw new Error(`Element ${desiredElement} is not supported`);
    }
}
exports.createSystemConcept = createSystemConcept;
/**
* Get all visible element ids, names or descriptions for a given {@link desiredElementName}.
* @param system             System element.
* @param desiredElementName Desired element name (e.g. DataEntity, ..).
* @param desiredProperty    Desired property to retrieve.
* @return Visible elements of a given RSL element.
* @throws Error in case the `desiredElement` is undefined or is not supported.
*/
function getVisibleElements(system, desiredElementName, desiredProperty) {
    if (!desiredElementName) {
        throw new Error('desiredElement cannot be undefined');
    }
    switch (desiredElementName.toLowerCase()) {
        case 'glossaryterm':
            return getGlossaryTermElementsProperty(system, desiredProperty);
        case 'vulnerability':
            return getVulnerabilityElementsProperty(system, desiredProperty);
        case 'risk':
            return getRiskElementsProperty(system, desiredProperty);
        case 'stakeholder':
            return getStakeholderElementsProperty(system, desiredProperty);
        case 'actor':
            return getActorElementsProperty(system, desiredProperty);
        case 'statemachine':
            return getStateMachineElementsProperty(system, desiredProperty);
        case 'activetask':
            return getActiveTaskElementsProperty(system, desiredProperty);
        case 'activeevent':
            return getActiveEventElementsProperty(system, desiredProperty);
        case 'activeflow':
            return getActiveFlowElementsProperty(system, desiredProperty);
        case 'goal':
            return getGoalElementsProperty(system, desiredProperty);
        case 'qr':
            return getQRElementsProperty(system, desiredProperty);
        case 'fr':
            return getFRElementsProperty(system, desiredProperty);
        case 'constraint':
            return getConstraintElementsProperty(system, desiredProperty);
        case 'userstory':
            return getUserStoryElementsProperty(system, desiredProperty);
        case 'usecase':
            return getUseCaseElementsProperty(system, desiredProperty);
        case 'dataenumeration':
            return getDataEnumerationElementsProperty(system, desiredProperty);
        case 'dataentity':
            return getDataEntityElementsProperty(system, desiredProperty);
        case 'dataentitycluster':
            return getDataEntityClusterElementsProperty(system, desiredProperty);
        case 'data':
            return getDataElementsProperty(system, desiredProperty);
        case 'mainscenario':
            return getMainScenarioElementsProperty(system, desiredProperty);
        case 'scenario':
            return getScenarioElementsProperty(system, desiredProperty);
        case 'step':
            return getStepElementsProperty(system, desiredProperty);
        case 'dataattribute':
            return getDataAttributeElementsProperty(system, desiredProperty);
        case 'acceptancecriteriascenario':
        case 'testdata':
        case 'system':
        case 'testsuite':
        case 'acceptancecriteriatest':
        case 'dataentitytest':
        case 'usecasetest':
        case 'statemachinetest':
        case 'acceptancecriteriatestview':
        case 'usecasetestview':
        case 'dataentitytestview':
        case 'statemachinetestview':
        case 'other':
            throw new Error(`Element ${desiredElementName} is not supported`);
        default:
            throw new Error(`Element ${desiredElementName} is not supported`);
    }
}
exports.getVisibleElements = getVisibleElements;
function getDataAttributeElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getDataAttributes(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getStepElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getSteps(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getScenarioElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getScenarios(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getMainScenarioElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getMainScenarios(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getDataElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getData(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getDataEntityClusterElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getDataEntityClusters(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getDataEntityElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getDataEntities(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getDataEnumerationElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getDataEnumerations(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getUseCaseElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getUseCases(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getUserStoryElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getUserStories(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getConstraintElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getConstraints(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getFRElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getFRs(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getQRElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getQRs(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getGoalElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getGoals(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getActiveFlowElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getActiveFlows(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getActiveEventElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getActiveEvents(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getActiveTaskElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getActiveTasks(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getStateMachineElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getStateMachines(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getActorElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getActors(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getStakeholderElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getStakeholders(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getRiskElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getRisks(system)) {
        switch (desiredProperty) {
            case 'id':
                if (element.name) {
                    elements.add(element.name);
                }
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getVulnerabilityElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getVulnerabilities(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
function getGlossaryTermElementsProperty(system, desiredProperty) {
    let elements = new Set();
    for (let element of getGlossaryTerms(system)) {
        switch (desiredProperty) {
            case 'id':
                elements.add(element.name);
                break;
            case 'name':
                if (element.nameAlias) {
                    elements.add(element.nameAlias);
                }
                break;
            case 'description':
                if (element.description) {
                    elements.add(element.description);
                }
                break;
        }
    }
    return elements;
}
/**
* Gets all Vulnerabilities of a given system.
*
* @param system RSL system element.
* @return Collection of Vulnerabilities.
*/
function getVulnerabilities(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isVulnerability)(element)) {
            elements.push(element);
        }
        else if ((0, ast_1.isIncludeElement)(element)) {
            let includeElement = element;
            if (includeElement.element && includeElement.element.ref && (0, ast_1.isVulnerability)(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        }
        else if ((0, ast_1.isIncludeAll)(element)) {
            let includeAll = element;
            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }
            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if ((0, ast_1.isVulnerability)(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }
    return elements;
}
exports.getVulnerabilities = getVulnerabilities;
/**
* Gets all Risks of a given system.
*
* @param system RSL system element.
* @return Collection of Risks.
*/
function getRisks(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isRisk)(element)) {
            elements.push(element);
        }
        else if ((0, ast_1.isIncludeElement)(element)) {
            let includeElement = element;
            if (includeElement.element && includeElement.element.ref && (0, ast_1.isRisk)(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        }
        else if ((0, ast_1.isIncludeAll)(element)) {
            let includeAll = element;
            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }
            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if ((0, ast_1.isRisk)(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }
    return elements;
}
exports.getRisks = getRisks;
/**
* Gets all Stakeholders of a given system.
*
* @param system RSL system element.
* @return Collection of Stakeholders.
*/
function getStakeholders(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isStakeholder)(element)) {
            elements.push(element);
        }
        else if ((0, ast_1.isIncludeElement)(element)) {
            let includeElement = element;
            if (includeElement.element && includeElement.element.ref && (0, ast_1.isStakeholder)(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        }
        else if ((0, ast_1.isIncludeAll)(element)) {
            let includeAll = element;
            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }
            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if ((0, ast_1.isStakeholder)(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }
    return elements;
}
exports.getStakeholders = getStakeholders;
/**
* Gets all Actors of a given system.
*
* @param system RSL system element.
* @return Collection of Actors.
*/
function getActors(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isActor)(element)) {
            elements.push(element);
        }
        else if ((0, ast_1.isIncludeElement)(element)) {
            let includeElement = element;
            if (includeElement.element && includeElement.element.ref && (0, ast_1.isActor)(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        }
        else if ((0, ast_1.isIncludeAll)(element)) {
            let includeAll = element;
            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }
            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if ((0, ast_1.isActor)(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }
    return elements;
}
exports.getActors = getActors;
/**
* Gets all StateMachines of a given system.
*
* @param system RSL system element.
* @return Collection of StateMachines.
*/
function getStateMachines(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isStateMachine)(element)) {
            elements.push(element);
        }
        else if ((0, ast_1.isIncludeElement)(element)) {
            let includeElement = element;
            if (includeElement.element && includeElement.element.ref && (0, ast_1.isStateMachine)(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        }
        else if ((0, ast_1.isIncludeAll)(element)) {
            let includeAll = element;
            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }
            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if ((0, ast_1.isStateMachine)(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }
    return elements;
}
exports.getStateMachines = getStateMachines;
/**
* Gets all ActiveTasks of a given system.
*
* @param system RSL system element.
* @return Collection of ActiveTasks.
*/
function getActiveTasks(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isActiveTask)(element)) {
            elements.push(element);
        }
        else if ((0, ast_1.isIncludeElement)(element)) {
            let includeElement = element;
            if (includeElement.element && includeElement.element.ref && (0, ast_1.isActiveTask)(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        }
        else if ((0, ast_1.isIncludeAll)(element)) {
            let includeAll = element;
            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }
            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if ((0, ast_1.isActiveTask)(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }
    return elements;
}
exports.getActiveTasks = getActiveTasks;
/**
* Gets all ActiveEvents of a given system.
*
* @param system RSL system element.
* @return Collection of ActiveEvents.
*/
function getActiveEvents(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isActiveEvent)(element)) {
            elements.push(element);
        }
        else if ((0, ast_1.isIncludeElement)(element)) {
            let includeElement = element;
            if (includeElement.element && includeElement.element.ref && (0, ast_1.isActiveEvent)(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        }
        else if ((0, ast_1.isIncludeAll)(element)) {
            let includeAll = element;
            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }
            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if ((0, ast_1.isActiveEvent)(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }
    return elements;
}
exports.getActiveEvents = getActiveEvents;
/**
* Gets all ActiveFlows of a given system.
*
* @param system RSL system element.
* @return Collection of ActiveFlows.
*/
function getActiveFlows(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isActiveFlow)(element)) {
            elements.push(element);
        }
        else if ((0, ast_1.isIncludeElement)(element)) {
            let includeElement = element;
            if (includeElement.element && includeElement.element.ref && (0, ast_1.isActiveFlow)(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        }
        else if ((0, ast_1.isIncludeAll)(element)) {
            let includeAll = element;
            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }
            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if ((0, ast_1.isActiveFlow)(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }
    return elements;
}
exports.getActiveFlows = getActiveFlows;
/**
* Gets all goals a given system.
*
* @param system RSL system element.
* @return Collection of Goals.
*/
function getGoals(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isGoal)(element)) {
            elements.push(element);
        }
        else if ((0, ast_1.isIncludeElement)(element)) {
            let includeElement = element;
            if (includeElement.element && includeElement.element.ref && (0, ast_1.isGoal)(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        }
        else if ((0, ast_1.isIncludeAll)(element)) {
            let includeAll = element;
            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }
            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if ((0, ast_1.isGoal)(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }
    return elements;
}
exports.getGoals = getGoals;
/**
* Gets all QRs of a given system.
*
* @param system RSL system element.
* @return Collection of QRs.
*/
function getQRs(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isQR)(element)) {
            elements.push(element);
        }
        else if ((0, ast_1.isIncludeElement)(element)) {
            let includeElement = element;
            if (includeElement.element && includeElement.element.ref && (0, ast_1.isQR)(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        }
        else if ((0, ast_1.isIncludeAll)(element)) {
            let includeAll = element;
            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }
            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if ((0, ast_1.isQR)(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }
    return elements;
}
exports.getQRs = getQRs;
/**
* Gets all FRs of a given system.
*
* @param system RSL system element.
* @return Collection of FRs.
*/
function getFRs(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isFR)(element)) {
            elements.push(element);
        }
        else if ((0, ast_1.isIncludeElement)(element)) {
            let includeElement = element;
            if (includeElement.element && includeElement.element.ref && (0, ast_1.isFR)(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        }
        else if ((0, ast_1.isIncludeAll)(element)) {
            let includeAll = element;
            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }
            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if ((0, ast_1.isFR)(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }
    return elements;
}
exports.getFRs = getFRs;
/**
* Gets all Constraints of a given system.
*
* @param system RSL system element.
* @return Collection of Constraints.
*/
function getConstraints(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isConstraint)(element)) {
            elements.push(element);
        }
        else if ((0, ast_1.isIncludeElement)(element)) {
            let includeElement = element;
            if (includeElement.element && includeElement.element.ref && (0, ast_1.isConstraint)(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        }
        else if ((0, ast_1.isIncludeAll)(element)) {
            let includeAll = element;
            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }
            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if ((0, ast_1.isConstraint)(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }
    return elements;
}
exports.getConstraints = getConstraints;
/**
* Gets all linguistic languages of a given system.
*
* @param system RSL system element.
* @return Collection of Linguistic Languages.
*/
function getLinguisticLanguages(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isLinguisticLanguage)(element)) {
            elements.push(element);
        }
    }
    return elements;
}
exports.getLinguisticLanguages = getLinguisticLanguages;
/**
* Gets the linguistic language type of given system.
* If no linguistic language is specified, the English language is returned.
*
* @param system RSL system element.
* @return The linguistic language.
*/
function getLinguisticLanguageType(system) {
    let result = getLinguisticLanguages(system);
    if (result.length === 0) {
        return 'English';
    }
    if (result.length > 1) {
        throw new Error('Only one linguistic language is supported');
    }
    return result[0].type;
}
exports.getLinguisticLanguageType = getLinguisticLanguageType;
/**
* Gets all linguistic rules a given system.
*
* @param system RSL system element.
* @return Collection of Linguistic Rules.
*/
function getLinguisticRules(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isLinguisticRule)(element)) {
            elements.push(element);
        }
        else if ((0, ast_1.isIncludeElement)(element)) {
            let includeElement = element;
            if (includeElement.element && includeElement.element.ref && (0, ast_1.isLinguisticRule)(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        }
        else if ((0, ast_1.isIncludeAll)(element)) {
            let includeAll = element;
            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }
            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if ((0, ast_1.isLinguisticRule)(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }
    return elements;
}
exports.getLinguisticRules = getLinguisticRules;
/**
* Gets all UserStories of a given system.
*
* @param system RSL system element.
* @return Collection of UserStories.
*/
function getUserStories(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isUserStory)(element)) {
            elements.push(element);
        }
        else if ((0, ast_1.isIncludeElement)(element)) {
            let includeElement = element;
            if (includeElement.element && includeElement.element.ref && (0, ast_1.isUserStory)(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        }
        else if ((0, ast_1.isIncludeAll)(element)) {
            let includeAll = element;
            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }
            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if ((0, ast_1.isUserStory)(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }
    return elements;
}
exports.getUserStories = getUserStories;
/**
* Gets all Glossary Terms of a given system.
*
* @param system RSL system element.
* @return Collection of Glossary Terms.
*/
function getGlossaryTerms(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isGlossaryTerm)(element)) {
            elements.push(element);
        }
        else if ((0, ast_1.isIncludeElement)(element)) {
            let includeElement = element;
            if (includeElement.element && includeElement.element.ref && (0, ast_1.isGlossaryTerm)(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        }
        else if ((0, ast_1.isIncludeAll)(element)) {
            let includeAll = element;
            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }
            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if ((0, ast_1.isGlossaryTerm)(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }
    return elements;
}
exports.getGlossaryTerms = getGlossaryTerms;
/**
* Checks if a glossary term is applicable to a rsl element.
*
* @param glossaryTerm Glossary term.
* @param rslElement RSL element.
* @return True in case a glossary of term is applicable to `rslElement`;
*         otherwise false.
*/
function isGlossaryTermApplicableTo(term, element) {
    const applicableTo = term.applicableTo;
    if (!applicableTo) {
        return true;
    }
    if (applicableTo.refs.length === 0) {
        return true;
    }
    for (let ref of applicableTo.refs) {
        if ((0, ast_1.isOtherElement)(ref) || ref.type === element.$type) {
            return true;
        }
    }
    return false;
}
exports.isGlossaryTermApplicableTo = isGlossaryTermApplicableTo;
/**
* Gets all UseCases of a given system.
*
* @param system RSL system element.
* @return Collection of UseCases.
*/
function getUseCases(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isUseCase)(element)) {
            elements.push(element);
        }
        else if ((0, ast_1.isIncludeElement)(element)) {
            let includeElement = element;
            if (includeElement.element && includeElement.element.ref && (0, ast_1.isUseCase)(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        }
        else if ((0, ast_1.isIncludeAll)(element)) {
            let includeAll = element;
            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }
            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if ((0, ast_1.isUseCase)(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }
    return elements;
}
exports.getUseCases = getUseCases;
/**
* Gets all Data Enumerations of a given system.
*
* @param system RSL system element.
* @return Collection of Data Enumerations.
*/
function getDataEnumerations(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isDataEnumeration)(element)) {
            elements.push(element);
        }
        else if ((0, ast_1.isIncludeElement)(element)) {
            let includeElement = element;
            if (includeElement.element && includeElement.element.ref && (0, ast_1.isDataEnumeration)(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        }
        else if ((0, ast_1.isIncludeAll)(element)) {
            let includeAll = element;
            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }
            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if ((0, ast_1.isDataEnumeration)(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }
    return elements;
}
exports.getDataEnumerations = getDataEnumerations;
/**
* Gets all Data Entities of a given system.
*
* @param system RSL system element.
* @return Collection of Data Entities.
*/
function getDataEntities(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isDataEntity)(element)) {
            elements.push(element);
        }
        else if ((0, ast_1.isIncludeElement)(element)) {
            let includeElement = element;
            if (includeElement.element && includeElement.element.ref && (0, ast_1.isDataEntity)(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        }
        else if ((0, ast_1.isIncludeAll)(element)) {
            let includeAll = element;
            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }
            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if ((0, ast_1.isDataEntity)(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }
    return elements;
}
exports.getDataEntities = getDataEntities;
/**
* Gets all DataEntityClusters of a given system.
*
* @param system RSL system element.
* @return Collection of DataEntityClusters.
*/
function getDataEntityClusters(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isDataEntityCluster)(element)) {
            elements.push(element);
        }
        else if ((0, ast_1.isIncludeElement)(element)) {
            let includeElement = element;
            if (includeElement.element && includeElement.element.ref && (0, ast_1.isDataEntityCluster)(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        }
        else if ((0, ast_1.isIncludeAll)(element)) {
            let includeAll = element;
            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }
            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if ((0, ast_1.isDataEntityCluster)(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }
    return elements;
}
exports.getDataEntityClusters = getDataEntityClusters;
/**
* Gets all Data elements of a given system.
*
* @param system RSL system element.
* @return Collection of Data.
*/
function getData(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isData)(element)) {
            elements.push(element);
        }
        else if ((0, ast_1.isIncludeElement)(element)) {
            let includeElement = element;
            if (includeElement.element && includeElement.element.ref && (0, ast_1.isData)(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        }
        else if ((0, ast_1.isIncludeAll)(element)) {
            let includeAll = element;
            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }
            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if ((0, ast_1.isData)(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }
    return elements;
}
exports.getData = getData;
/**
* Gets all MainScenarios of a given system.
*
* @param system RSL system element.
* @return Collection of MainScenarios.
*/
function getMainScenarios(system) {
    let elements = [];
    for (let element of getUseCases(system)) {
        if (element.mainScenarios && element.mainScenarios.length > 0) {
            elements.push(...element.mainScenarios);
        }
    }
    return elements;
}
exports.getMainScenarios = getMainScenarios;
/**
* Gets all Scenarios of a given system.
*
* @param system RSL system element.
* @return Collection of Scenarios.
*/
function getScenarios(system) {
    var _a, _b;
    let elements = [];
    for (let mainScenario of getMainScenarios(system)) {
        for (let step of (_a = mainScenario.steps) !== null && _a !== void 0 ? _a : []) {
            elements.push(...((_b = step.scenarios) !== null && _b !== void 0 ? _b : []));
        }
    }
    return elements;
}
exports.getScenarios = getScenarios;
/**
* Gets all Steps of a given system.
*
* @param system RSL system element.
* @return Collection of Steps.
*/
function getSteps(system) {
    var _a, _b, _c;
    let elements = [];
    for (let mainScenario of getMainScenarios(system)) {
        for (let step of (_a = mainScenario.steps) !== null && _a !== void 0 ? _a : []) {
            elements.push(step);
            for (let scenario of (_b = step.scenarios) !== null && _b !== void 0 ? _b : []) {
                elements.push(...((_c = scenario.steps) !== null && _c !== void 0 ? _c : []));
            }
        }
    }
    return elements;
}
exports.getSteps = getSteps;
/**
* Gets all DataAttributes of a given system.
*
* @param system RSL system element.
* @return Collection of DataAttributes.
*/
function getDataAttributes(system) {
    let elements = [];
    for (let element of system.systemConcepts) {
        if ((0, ast_1.isDataAttribute)(element)) {
            elements.push(element);
        }
        else if ((0, ast_1.isIncludeElement)(element)) {
            let includeElement = element;
            if (includeElement.element && includeElement.element.ref && (0, ast_1.isDataAttribute)(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        }
        else if ((0, ast_1.isIncludeAll)(element)) {
            let includeAll = element;
            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }
            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if ((0, ast_1.isDataAttribute)(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }
    return elements;
}
exports.getDataAttributes = getDataAttributes;
/**
* Gets the string representation of the type of the stereotype.
* @param type The type.
*/
function getStereotypeType(type) {
    var _a;
    if (type.$type === 'StereotypeTypeOriginal') {
        return type.type;
    }
    else if (type.$type === 'StereotypeTypeExtendedRef') {
        return (_a = type.type.ref) === null || _a === void 0 ? void 0 : _a.name;
    }
    else {
        throw new Error(`${type} is not supported.`);
    }
}
exports.getStereotypeType = getStereotypeType;
function createStateMachine(elementProperty, ruleProperty) {
    const elementPropertyId = elementProperty.replaceAll('\\s+', '');
    const defaultElementId = `sm_${elementPropertyId}`;
    const elementType = 'Simple';
    const element = 'StateMachine';
    switch (ruleProperty) {
        case 'id':
            return `${element} ${elementPropertyId} : ${elementType}`;
        case 'name':
            return `${element} ${defaultElementId} "${elementProperty}" : ${elementType}`;
        case 'description':
            return `${element} ${defaultElementId} "${elementProperty}" : ${elementType} [ dataEntity entityId description "${elementProperty}" ] `;
        default:
            throw new Error(`Property ${ruleProperty} is not supported`);
    }
}
function createActiveFlow(elementProperty, ruleProperty) {
    const elementPropertyId = elementProperty.replaceAll('\\s+', '');
    const defaultElementId = `af_${elementPropertyId}`;
    const elementType = 'Sequence';
    const element = 'TaskFlow';
    switch (ruleProperty) {
        case 'id':
            return `${element} ${elementPropertyId} : ${elementType}`;
        case 'name':
            return `${element} ${defaultElementId} "${elementProperty}" : ${elementType}`;
        case 'description':
            return `${element} ${defaultElementId} "${elementProperty}" : ${elementType} [ activeElements eventId1, eventId2 description "${elementProperty}" ] `;
        default:
            throw new Error(`Property ${ruleProperty} is not supported`);
    }
}
function createElement(element, defaultIdPrefix, elementType, elementProperty, ruleProperty) {
    const elementPropertyId = elementProperty.replaceAll('\\s+', '');
    const defaultElementId = `${defaultIdPrefix}${elementPropertyId}`;
    switch (ruleProperty) {
        case 'id':
            return `${element} ${elementPropertyId} : ${elementType}`;
        case 'name':
            return `${element} ${defaultElementId} "${elementProperty}" : ${elementType}`;
        case 'description':
            return `${element} ${defaultElementId} "${elementProperty}" : ${elementType} [ description "${elementProperty}" ] `;
        default:
            throw new Error(`Property ${ruleProperty} is not supported`);
    }
}
function createUserStory(elementProperty, ruleProperty) {
    const elementPropertyId = elementProperty.replaceAll('\\s+', '');
    const defaultElementId = `us_${elementPropertyId}`;
    const elementType = 'UserStory';
    const element = 'UserStory';
    switch (ruleProperty) {
        case 'id':
            return `${element} ${elementPropertyId} : ${elementType}`;
        case 'name':
            return `${element} ${defaultElementId} "${elementProperty}" : ${elementType}`;
        case 'description':
            return `${element} ${defaultElementId} "${elementProperty}" : ${elementType} [ asA actorId iWant goalId description "${elementProperty}" ] `;
        default:
            throw new Error(`Property ${ruleProperty} is not supported`);
    }
}
function createUseCase(elementProperty, ruleProperty) {
    const elementPropertyId = elementProperty.replaceAll('\\s+', '');
    const defaultElementId = `uc_${elementPropertyId}`;
    const elementType = 'Other';
    const element = 'UseCase';
    switch (ruleProperty) {
        case 'id':
            return `${element} ${elementPropertyId} : ${elementType}`;
        case 'name':
            return `${element} ${defaultElementId} "${elementProperty}" : ${elementType}`;
        case 'description':
            return `${element} ${defaultElementId} "${elementProperty}" : ${elementType} [ primaryActor actorId description "${elementProperty}" ] `;
        default:
            throw new Error(`Property ${ruleProperty} is not supported`);
    }
}
function createDataEnumeration(elementProperty, ruleProperty) {
    const elementPropertyId = elementProperty.replaceAll('\\s+', '');
    const defaultElementId = `dEnum_${elementPropertyId}`;
    const element = 'DataEnumeration';
    switch (ruleProperty) {
        case 'id':
            return `${element} ${elementPropertyId}`;
        case 'name':
            return `${element} ${defaultElementId} "${elementProperty}"`;
        case 'description':
            return `${element} ${defaultElementId} "${elementProperty}" values ( valueName ) [ description "${elementProperty}" ] `;
        default:
            throw new Error(`Property ${ruleProperty} is not supported`);
    }
}
function createDataEntityCluster(elementProperty, ruleProperty) {
    const elementPropertyId = elementProperty.replaceAll('\\s+', '');
    const defaultElementId = `ec_${elementPropertyId}`;
    const elementType = 'Other';
    const element = 'DataEntityCluster';
    switch (ruleProperty) {
        case 'id':
            return `${element} ${elementPropertyId} : ${elementType}`;
        case 'name':
            return `${element} ${defaultElementId} "${elementProperty}" : ${elementType}`;
        case 'description':
            return `${element} ${defaultElementId} "${elementProperty}" : ${elementType} [ main dataEntityId description "${elementProperty}" ] `;
        default:
            throw new Error(`Property ${ruleProperty} is not supported`);
    }
}
function createActionType(elementProperty, ruleProperty) {
    const elementPropertyId = elementProperty.replaceAll('\\s+', '');
    const defaultElementId = `a${elementPropertyId}`;
    const element = 'ActionType';
    switch (ruleProperty) {
        case 'id':
            return `${element} ${elementPropertyId}`;
        case 'name':
            return `${element} ${defaultElementId} "${elementProperty}"`;
        case 'description':
            return `${element} ${defaultElementId} "${elementProperty}" [ description "${elementProperty}" ] `;
        default:
            throw new Error(`Property ${ruleProperty} is not supported`);
    }
}
//# sourceMappingURL=rsl-utilities.js.map