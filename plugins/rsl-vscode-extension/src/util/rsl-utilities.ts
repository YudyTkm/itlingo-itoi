import {
    ActiveEvent,
    ActiveFlow,
    ActiveTask,
    Actor,
    Constraint,
    Data,
    DataAttribute,
    DataEntity,
    DataEntityCluster,
    DataEnumeration,
    FR,
    GlossaryTerm,
    Goal,
    IncludeAll,
    IncludeElement,
    LinguisticLanguage,
    LinguisticLanguageType,
    LinguisticRule,
    LinguisticRuleElementProperty,
    MainScenario,
    QR,
    Risk,
    Scenario,
    Stakeholder,
    StateMachine,
    Step,
    StereotypeType,
    StereotypeTypeExtendedRef,
    StereotypeTypeOriginal,
    System,
    SystemConcept,
    UseCase,
    UserStory,
    Vulnerability,
    isActiveEvent,
    isActiveFlow,
    isActiveTask,
    isActor,
    isConstraint,
    isData,
    isDataAttribute,
    isDataEntity,
    isDataEntityCluster,
    isDataEnumeration,
    isFR,
    isGlossaryTerm,
    isGoal,
    isIncludeAll,
    isIncludeElement,
    isLinguisticLanguage,
    isLinguisticRule,
    isOtherElement,
    isQR,
    isRisk,
    isStakeholder,
    isStateMachine,
    isUseCase,
    isUserStory,
    isVulnerability,
} from '../language-server/generated/ast';

/**
 * Creates a system concept element.
 *
 * @param desiredElement      Type of element to create.
 * @param elementPropertyText The text of the element property (ID, Name or Description) to create.
 * @param ruleElementProperty The property of the element to create
 * @returns A system concept element.
 * @throws Error in case the `desiredElement` is undefined or is not supported.
 */
export function createSystemConcept(
    desiredElement: string,
    elementPropertyText: string,
    ruleElementProperty: LinguisticRuleElementProperty
): string {
    if (!desiredElement) {
        throw new Error('desiredElement cannot be undefined');
    }

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

/**
 * Get all visible element ids, names or descriptions for a given {@link desiredElementName}.
 * @param system             System element.
 * @param desiredElementName Desired element name (e.g. DataEntity, ..).
 * @param desiredProperty    Desired property to retrieve.
 * @return Visible elements of a given RSL element.
 * @throws Error in case the `desiredElement` is undefined or is not supported.
 */
export function getVisibleElements(
    system: System,
    desiredElementName: string,
    desiredProperty: LinguisticRuleElementProperty
): Set<string> {
    if (!desiredElementName) {
        throw new Error('desiredElement cannot be undefined');
    }

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

function getDataAttributeElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getStepElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getScenarioElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getMainScenarioElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getDataElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getDataEntityClusterElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getDataEntityElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getDataEnumerationElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getUseCaseElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getUserStoryElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getConstraintElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getFRElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getQRElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getGoalElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getActiveFlowElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getActiveEventElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getActiveTaskElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getStateMachineElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getActorElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getStakeholderElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getRiskElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getVulnerabilityElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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

function getGlossaryTermElementsProperty(system: System, desiredProperty: string) {
    let elements = new Set<string>();

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
export function getVulnerabilities(system: System) {
    let elements: Vulnerability[] = [];

    for (let element of system.systemConcepts) {
        if (isVulnerability(element)) {
            elements.push(element as Vulnerability);
        } else if (isIncludeElement(element)) {
            let includeElement = element as IncludeElement;
            if (includeElement.element && includeElement.element.ref && isVulnerability(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        } else if (isIncludeAll(element)) {
            let includeAll = element as IncludeAll;

            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }

            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if (isVulnerability(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }

    return elements;
}

/**
 * Gets all Risks of a given system.
 *
 * @param system RSL system element.
 * @return Collection of Risks.
 */
export function getRisks(system: System) {
    let elements: Risk[] = [];

    for (let element of system.systemConcepts) {
        if (isRisk(element)) {
            elements.push(element as Risk);
        } else if (isIncludeElement(element)) {
            let includeElement = element as IncludeElement;
            if (includeElement.element && includeElement.element.ref && isRisk(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        } else if (isIncludeAll(element)) {
            let includeAll = element as IncludeAll;

            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }

            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if (isRisk(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }

    return elements;
}

/**
 * Gets all Stakeholders of a given system.
 *
 * @param system RSL system element.
 * @return Collection of Stakeholders.
 */
export function getStakeholders(system: System) {
    let elements: Stakeholder[] = [];

    for (let element of system.systemConcepts) {
        if (isStakeholder(element)) {
            elements.push(element as Stakeholder);
        } else if (isIncludeElement(element)) {
            let includeElement = element as IncludeElement;
            if (includeElement.element && includeElement.element.ref && isStakeholder(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        } else if (isIncludeAll(element)) {
            let includeAll = element as IncludeAll;

            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }

            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if (isStakeholder(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }

    return elements;
}

/**
 * Gets all Actors of a given system.
 *
 * @param system RSL system element.
 * @return Collection of Actors.
 */
export function getActors(system: System) {
    let elements: Actor[] = [];

    for (let element of system.systemConcepts) {
        if (isActor(element)) {
            elements.push(element as Actor);
        } else if (isIncludeElement(element)) {
            let includeElement = element as IncludeElement;
            if (includeElement.element && includeElement.element.ref && isActor(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        } else if (isIncludeAll(element)) {
            let includeAll = element as IncludeAll;

            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }

            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if (isActor(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }

    return elements;
}

/**
 * Gets all StateMachines of a given system.
 *
 * @param system RSL system element.
 * @return Collection of StateMachines.
 */
export function getStateMachines(system: System) {
    let elements: StateMachine[] = [];

    for (let element of system.systemConcepts) {
        if (isStateMachine(element)) {
            elements.push(element as StateMachine);
        } else if (isIncludeElement(element)) {
            let includeElement = element as IncludeElement;
            if (includeElement.element && includeElement.element.ref && isStateMachine(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        } else if (isIncludeAll(element)) {
            let includeAll = element as IncludeAll;

            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }

            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if (isStateMachine(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }

    return elements;
}

/**
 * Gets all ActiveTasks of a given system.
 *
 * @param system RSL system element.
 * @return Collection of ActiveTasks.
 */
export function getActiveTasks(system: System) {
    let elements: ActiveTask[] = [];

    for (let element of system.systemConcepts) {
        if (isActiveTask(element)) {
            elements.push(element as ActiveTask);
        } else if (isIncludeElement(element)) {
            let includeElement = element as IncludeElement;
            if (includeElement.element && includeElement.element.ref && isActiveTask(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        } else if (isIncludeAll(element)) {
            let includeAll = element as IncludeAll;

            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }

            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if (isActiveTask(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }

    return elements;
}

/**
 * Gets all ActiveEvents of a given system.
 *
 * @param system RSL system element.
 * @return Collection of ActiveEvents.
 */
export function getActiveEvents(system: System) {
    let elements: ActiveEvent[] = [];

    for (let element of system.systemConcepts) {
        if (isActiveEvent(element)) {
            elements.push(element as ActiveEvent);
        } else if (isIncludeElement(element)) {
            let includeElement = element as IncludeElement;
            if (includeElement.element && includeElement.element.ref && isActiveEvent(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        } else if (isIncludeAll(element)) {
            let includeAll = element as IncludeAll;

            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }

            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if (isActiveEvent(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }

    return elements;
}

/**
 * Gets all ActiveFlows of a given system.
 *
 * @param system RSL system element.
 * @return Collection of ActiveFlows.
 */
export function getActiveFlows(system: System) {
    let elements: ActiveFlow[] = [];

    for (let element of system.systemConcepts) {
        if (isActiveFlow(element)) {
            elements.push(element as ActiveFlow);
        } else if (isIncludeElement(element)) {
            let includeElement = element as IncludeElement;
            if (includeElement.element && includeElement.element.ref && isActiveFlow(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        } else if (isIncludeAll(element)) {
            let includeAll = element as IncludeAll;

            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }

            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if (isActiveFlow(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }

    return elements;
}

/**
 * Gets all goals a given system.
 *
 * @param system RSL system element.
 * @return Collection of Goals.
 */
export function getGoals(system: System) {
    let elements: Goal[] = [];

    for (let element of system.systemConcepts) {
        if (isGoal(element)) {
            elements.push(element as Goal);
        } else if (isIncludeElement(element)) {
            let includeElement = element as IncludeElement;
            if (includeElement.element && includeElement.element.ref && isGoal(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        } else if (isIncludeAll(element)) {
            let includeAll = element as IncludeAll;

            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }

            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if (isGoal(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }

    return elements;
}

/**
 * Gets all QRs of a given system.
 *
 * @param system RSL system element.
 * @return Collection of QRs.
 */
export function getQRs(system: System) {
    let elements: QR[] = [];

    for (let element of system.systemConcepts) {
        if (isQR(element)) {
            elements.push(element as QR);
        } else if (isIncludeElement(element)) {
            let includeElement = element as IncludeElement;
            if (includeElement.element && includeElement.element.ref && isQR(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        } else if (isIncludeAll(element)) {
            let includeAll = element as IncludeAll;

            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }

            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if (isQR(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }

    return elements;
}

/**
 * Gets all FRs of a given system.
 *
 * @param system RSL system element.
 * @return Collection of FRs.
 */
export function getFRs(system: System) {
    let elements: FR[] = [];

    for (let element of system.systemConcepts) {
        if (isFR(element)) {
            elements.push(element as FR);
        } else if (isIncludeElement(element)) {
            let includeElement = element as IncludeElement;
            if (includeElement.element && includeElement.element.ref && isFR(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        } else if (isIncludeAll(element)) {
            let includeAll = element as IncludeAll;

            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }

            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if (isFR(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }

    return elements;
}

/**
 * Gets all Constraints of a given system.
 *
 * @param system RSL system element.
 * @return Collection of Constraints.
 */
export function getConstraints(system: System) {
    let elements: Constraint[] = [];

    for (let element of system.systemConcepts) {
        if (isConstraint(element)) {
            elements.push(element as Constraint);
        } else if (isIncludeElement(element)) {
            let includeElement = element as IncludeElement;
            if (includeElement.element && includeElement.element.ref && isConstraint(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        } else if (isIncludeAll(element)) {
            let includeAll = element as IncludeAll;

            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }

            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if (isConstraint(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }

    return elements;
}

/**
 * Gets all linguistic languages of a given system.
 *
 * @param system RSL system element.
 * @return Collection of Linguistic Languages.
 */
export function getLinguisticLanguages(system: System) {
    let elements: LinguisticLanguage[] = [];

    for (let element of system.systemConcepts) {
        if (isLinguisticLanguage(element)) {
            elements.push(element as LinguisticLanguage);
        }
    }

    return elements;
}

/**
 * Gets the linguistic language type of given system.
 * If no linguistic language is specified, the English language is returned.
 *
 * @param system RSL system element.
 * @return The linguistic language.
 */
export function getLinguisticLanguageType(system: System): LinguisticLanguageType {
    let result = getLinguisticLanguages(system);

    if (result.length === 0) {
        return 'English';
    }

    if (result.length > 1) {
        throw new Error('Only one linguistic language is supported');
    }

    return result[0].type;
}

/**
 * Gets all linguistic rules a given system.
 *
 * @param system RSL system element.
 * @return Collection of Linguistic Rules.
 */
export function getLinguisticRules(system: System): LinguisticRule[] {
    let elements: LinguisticRule[] = [];

    for (let element of system.systemConcepts) {
        if (isLinguisticRule(element)) {
            elements.push(element);
        } else if (isIncludeElement(element)) {
            let includeElement = element as IncludeElement;
            if (includeElement.element && includeElement.element.ref && isLinguisticRule(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        } else if (isIncludeAll(element)) {
            let includeAll = element as IncludeAll;

            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }

            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if (isLinguisticRule(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }

    return elements;
}

/**
 * Gets all UserStories of a given system.
 *
 * @param system RSL system element.
 * @return Collection of UserStories.
 */
export function getUserStories(system: System) {
    let elements: UserStory[] = [];

    for (let element of system.systemConcepts) {
        if (isUserStory(element)) {
            elements.push(element as UserStory);
        } else if (isIncludeElement(element)) {
            let includeElement = element as IncludeElement;
            if (includeElement.element && includeElement.element.ref && isUserStory(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        } else if (isIncludeAll(element)) {
            let includeAll = element as IncludeAll;

            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }

            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if (isUserStory(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }

    return elements;
}

/**
 * Gets all Glossary Terms of a given system.
 *
 * @param system RSL system element.
 * @return Collection of Glossary Terms.
 */
export function getGlossaryTerms(system: System): GlossaryTerm[] {
    let elements: GlossaryTerm[] = [];

    for (let element of system.systemConcepts) {
        if (isGlossaryTerm(element)) {
            elements.push(element);
        } else if (isIncludeElement(element)) {
            let includeElement = element as IncludeElement;
            if (includeElement.element && includeElement.element.ref && isGlossaryTerm(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        } else if (isIncludeAll(element)) {
            let includeAll = element as IncludeAll;

            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }

            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if (isGlossaryTerm(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }

    return elements;
}

/**
 * Checks if a glossary term is applicable to a rsl element.
 *
 * @param glossaryTerm Glossary term.
 * @param rslElement RSL element.
 * @return True in case a glossary of term is applicable to `rslElement`;
 *         otherwise false.
 */
export function isGlossaryTermApplicableTo(term: GlossaryTerm, element: SystemConcept): boolean {
    const applicableTo = term.applicableTo;

    if (!applicableTo) {
        return true;
    }

    if (applicableTo.refs.length === 0) {
        return true;
    }

    for (let ref of applicableTo.refs) {
        if (isOtherElement(ref) || ref.type === element.$type) {
            return true;
        }
    }

    return false;
}

/**
 * Gets all UseCases of a given system.
 *
 * @param system RSL system element.
 * @return Collection of UseCases.
 */
export function getUseCases(system: System) {
    let elements: UseCase[] = [];

    for (let element of system.systemConcepts) {
        if (isUseCase(element)) {
            elements.push(element as UseCase);
        } else if (isIncludeElement(element)) {
            let includeElement = element as IncludeElement;
            if (includeElement.element && includeElement.element.ref && isUseCase(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        } else if (isIncludeAll(element)) {
            let includeAll = element as IncludeAll;

            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }

            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if (isUseCase(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }

    return elements;
}

/**
 * Gets all Data Enumerations of a given system.
 *
 * @param system RSL system element.
 * @return Collection of Data Enumerations.
 */
export function getDataEnumerations(system: System) {
    let elements: DataEnumeration[] = [];

    for (let element of system.systemConcepts) {
        if (isDataEnumeration(element)) {
            elements.push(element as DataEnumeration);
        } else if (isIncludeElement(element)) {
            let includeElement = element as IncludeElement;
            if (includeElement.element && includeElement.element.ref && isDataEnumeration(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        } else if (isIncludeAll(element)) {
            let includeAll = element as IncludeAll;

            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }

            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if (isDataEnumeration(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }

    return elements;
}

/**
 * Gets all Data Entities of a given system.
 *
 * @param system RSL system element.
 * @return Collection of Data Entities.
 */
export function getDataEntities(system: System) {
    let elements: DataEntity[] = [];

    for (let element of system.systemConcepts) {
        if (isDataEntity(element)) {
            elements.push(element as DataEntity);
        } else if (isIncludeElement(element)) {
            let includeElement = element as IncludeElement;
            if (includeElement.element && includeElement.element.ref && isDataEntity(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        } else if (isIncludeAll(element)) {
            let includeAll = element as IncludeAll;

            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }

            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if (isDataEntity(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }

    return elements;
}

/**
 * Gets all DataEntityClusters of a given system.
 *
 * @param system RSL system element.
 * @return Collection of DataEntityClusters.
 */
export function getDataEntityClusters(system: System) {
    let elements: DataEntityCluster[] = [];

    for (let element of system.systemConcepts) {
        if (isDataEntityCluster(element)) {
            elements.push(element as DataEntityCluster);
        } else if (isIncludeElement(element)) {
            let includeElement = element as IncludeElement;
            if (includeElement.element && includeElement.element.ref && isDataEntityCluster(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        } else if (isIncludeAll(element)) {
            let includeAll = element as IncludeAll;

            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }

            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if (isDataEntityCluster(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }

    return elements;
}

/**
 * Gets all Data elements of a given system.
 *
 * @param system RSL system element.
 * @return Collection of Data.
 */
export function getData(system: System) {
    let elements: Data[] = [];

    for (let element of system.systemConcepts) {
        if (isData(element)) {
            elements.push(element as Data);
        } else if (isIncludeElement(element)) {
            let includeElement = element as IncludeElement;
            if (includeElement.element && includeElement.element.ref && isData(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        } else if (isIncludeAll(element)) {
            let includeAll = element as IncludeAll;

            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }

            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if (isData(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }

    return elements;
}

/**
 * Gets all MainScenarios of a given system.
 *
 * @param system RSL system element.
 * @return Collection of MainScenarios.
 */
export function getMainScenarios(system: System) {
    let elements: MainScenario[] = [];

    for (let element of getUseCases(system)) {
        if (element.mainScenarios && element.mainScenarios.length > 0) {
            elements.push(...element.mainScenarios);
        }
    }

    return elements;
}

/**
 * Gets all Scenarios of a given system.
 *
 * @param system RSL system element.
 * @return Collection of Scenarios.
 */
export function getScenarios(system: System) {
    let elements: Scenario[] = [];

    for (let mainScenario of getMainScenarios(system)) {
        for (let step of mainScenario.steps ?? []) {
            elements.push(...(step.scenarios ?? []));
        }
    }

    return elements;
}

/**
 * Gets all Steps of a given system.
 *
 * @param system RSL system element.
 * @return Collection of Steps.
 */
export function getSteps(system: System) {
    let elements: Step[] = [];

    for (let mainScenario of getMainScenarios(system)) {
        for (let step of mainScenario.steps ?? []) {
            elements.push(step);
            for (let scenario of step.scenarios ?? []) {
                elements.push(...(scenario.steps ?? []));
            }
        }
    }

    return elements;
}

/**
 * Gets all DataAttributes of a given system.
 *
 * @param system RSL system element.
 * @return Collection of DataAttributes.
 */
export function getDataAttributes(system: System) {
    let elements: DataAttribute[] = [];

    for (let element of system.systemConcepts) {
        if (isDataAttribute(element)) {
            elements.push(element as DataAttribute);
        } else if (isIncludeElement(element)) {
            let includeElement = element as IncludeElement;
            if (includeElement.element && includeElement.element.ref && isDataAttribute(includeElement.element.ref)) {
                elements.push(includeElement.element.ref);
            }
        } else if (isIncludeAll(element)) {
            let includeAll = element as IncludeAll;

            if (!includeAll.system || !includeAll.system.ref) {
                continue;
            }

            for (let includeElement of includeAll.system.ref.systemConcepts) {
                if (isDataAttribute(includeElement)) {
                    elements.push(includeElement);
                }
            }
        }
    }

    return elements;
}

/**
 * Gets the string representation of the type of the stereotype.
 * @param type The type.
 */
export function getStereotypeType(type: StereotypeType): string {
    if (type.$type === 'StereotypeTypeOriginal') {
        return (type as StereotypeTypeOriginal).type;
    } else if (type.$type === 'StereotypeTypeExtendedRef') {
        return (type as StereotypeTypeExtendedRef).type.ref?.name as string;
    } else {
        throw new Error(`${type} is not supported.`);
    }
}

function createStateMachine(elementProperty: string, ruleProperty: LinguisticRuleElementProperty): string {
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

function createActiveFlow(elementProperty: string, ruleProperty: LinguisticRuleElementProperty): string {
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

function createElement(
    element: string,
    defaultIdPrefix: string,
    elementType: string,
    elementProperty: string,
    ruleProperty: LinguisticRuleElementProperty
): string {
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

function createUserStory(elementProperty: string, ruleProperty: LinguisticRuleElementProperty): string {
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

function createUseCase(elementProperty: string, ruleProperty: LinguisticRuleElementProperty): string {
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

function createDataEnumeration(elementProperty: string, ruleProperty: LinguisticRuleElementProperty): string {
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

function createDataEntityCluster(elementProperty: string, ruleProperty: LinguisticRuleElementProperty): string {
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
