"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStereotypeType = exports.isGlossaryTermApplicableTo = exports.getGlossaryTerms = exports.getLinguisticRules = exports.getLinguisticLanguageType = exports.getLinguisticLanguages = exports.getVisibleElements = exports.createSystemConcept = void 0;
const ast_1 = require("../language-server/generated/ast");
/**
 * Creates a system concept element.
 * @param desiredElement Type of element to create.
 * @param elementPropertyText The text of the element property (ID, Name or Description) to create.
 * @param ruleElementProperty The property of the element to create
 * @returns A system concept element.
 * @throws Error in case the {@link desiredElement}  is not supported.
 */
function createSystemConcept(desiredElement, elementPropertyText, ruleElementProperty) {
    switch (desiredElement) {
        case 'GlossaryTerm':
            return createElement('Term', 'term_', 'Noun', elementPropertyText, ruleElementProperty);
        case 'Vulnerability':
            return createElement('Vulnerability', 'vul_', 'Other', elementPropertyText, ruleElementProperty);
        case 'Risk':
            return createElement('Risk', 'r_', 'Other', elementPropertyText, ruleElementProperty);
        case 'Stakeholder':
            return createElement('Stakeholder', 'stk_', 'Other', elementPropertyText, ruleElementProperty);
        case 'Actor':
            return createElement('Actor', 'a_', 'Other', elementPropertyText, ruleElementProperty);
        case 'StateMachine':
            return createStateMachine(elementPropertyText, ruleElementProperty);
        case 'ActiveTask':
            return createElement('Task', 'at_', 'Undefined', elementPropertyText, ruleElementProperty);
        case 'ActiveEvent':
            return createElement('Event', 'ev_', 'Undefined', elementPropertyText, ruleElementProperty);
        case 'ActiveFlow':
            return createActiveFlow(elementPropertyText, ruleElementProperty);
        case 'Goal':
            return createElement('Goal', 'g_', 'Other', elementPropertyText, ruleElementProperty);
        case 'QR':
            return createElement('QR', 'qr_', 'Other', elementPropertyText, ruleElementProperty);
        case 'FR':
            return createElement('FR', 'fr_', 'Functional', elementPropertyText, ruleElementProperty);
        case 'Constraint':
            return createElement('Constraint', 'c_', 'Other', elementPropertyText, ruleElementProperty);
        case 'UserStory':
            return createUserStory(elementPropertyText, ruleElementProperty);
        case 'UseCase':
            return createUseCase(elementPropertyText, ruleElementProperty);
        case 'DataEnumeration':
            return createDataEnumeration(elementPropertyText, ruleElementProperty);
        case 'DataEntity':
            return createElement('DataEntity', 'de_', 'Other', elementPropertyText, ruleElementProperty);
        case 'DataEntityCluster':
            return createDataEntityCluster(elementPropertyText, ruleElementProperty);
        case 'MainScenario':
        case 'Scenario':
        case 'Step':
        case 'AcceptanceCriteriaScenario':
        case 'DataAttribute':
        case 'System':
        case 'TestSuite':
        case 'AcceptanceCriteriaTest':
        case 'DataEntityTest':
        case 'UseCaseTest':
        case 'StateMachineTest':
        case 'AcceptanceCriteriaTestView':
        case 'UseCaseTestView':
        case 'DataEntityTestView':
        case 'StatemachineTestView':
        case 'Data':
        case 'TestData':
        case 'Other':
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
 */
function getVisibleElements(system, desiredElementName, desiredProperty) {
    switch (desiredElementName) {
        case 'GlossaryTerm':
            return getGlossaryTermElementsProperty(system, desiredProperty);
        case 'Vulnerability':
            return getVulnerabilityElementsProperty(system, desiredProperty);
        case 'Risk':
            return getRiskElementsProperty(system, desiredProperty);
        case 'Stakeholder':
            return getStakeholderElementsProperty(system, desiredProperty);
        case 'Actor':
            return getActorElementsProperty(system, desiredProperty);
        case 'StateMachine':
            return getStateMachineElementsProperty(system, desiredProperty);
        case 'ActiveTask':
            return getActiveTaskElementsProperty(system, desiredProperty);
        case 'ActiveEvent':
            return getActiveEventElementsProperty(system, desiredProperty);
        case 'ActiveFlow':
            return getActiveFlowElementsProperty(system, desiredProperty);
        case 'Goal':
            return getGoalElementsProperty(system, desiredProperty);
        case 'QR':
            return getQRElementsProperty(system, desiredProperty);
        case 'FR':
            return getFRElementsProperty(system, desiredProperty);
        case 'Constraint':
            return getConstraintElementsProperty(system, desiredProperty);
        case 'UserStory':
            return getUserStoryElementsProperty(system, desiredProperty);
        case 'UseCase':
            return getUseCaseElementsProperty(system, desiredProperty);
        case 'DataEnumeration':
            return getDataEnumerationElementsProperty(system, desiredProperty);
        case 'DataEntity':
            return getDataEntityElementsProperty(system, desiredProperty);
        case 'DataEntityCluster':
            return getDataEntityClusterElementsProperty(system, desiredProperty);
        case 'Data':
            return getDataElementsProperty(system, desiredProperty);
        case 'MainScenario':
            return getMainScenarioElementsProperty(system, desiredProperty);
        case 'Scenario':
            return getScenarioElementsProperty(system, desiredProperty);
        case 'Step':
            return getStepElementsProperty(system, desiredProperty);
        case 'DataAttribute':
            return getDataAttributeElementsProperty(system, desiredProperty);
        case 'AcceptanceCriteriaScenario':
        case 'TestData':
        case 'System':
        case 'TestSuite':
        case 'AcceptanceCriteriaTest':
        case 'DataEntityTest':
        case 'UseCaseTest':
        case 'StateMachineTest':
        case 'AcceptanceCriteriaTestView':
        case 'UseCaseTestView':
        case 'DataEntityTestView':
        case 'StatemachineTestView':
        case 'Other':
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
function getMainScenarios(system) {
    let elements = [];
    for (let element of getUseCases(system)) {
        if (element.mainScenarios && element.mainScenarios.length > 0) {
            elements.push(...element.mainScenarios);
        }
    }
    return elements;
}
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
//# sourceMappingURL=rsl-utilities.js.map