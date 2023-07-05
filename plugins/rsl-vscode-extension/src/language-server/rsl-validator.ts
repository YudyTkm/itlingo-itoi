import { AstNode, EOL, ValidationAcceptor, ValidationChecks, getContainerOfType } from 'langium';
import {
    RslAstType,
    ActiveFlow,
    isActiveFlowTypeOriginal,
    ActiveFlowTypeOriginal,
    ActiveFlowTypeExtendedRef,
    ActiveTask,
    isActiveTaskTypeOriginal,
    ActiveTaskTypeOriginal,
    ActiveTaskTypeExtendedRef,
    BehaviorElement,
    System,
    Constraint,
    isConstraintTypeOriginal,
    ConstraintTypeOriginal,
    ConstraintTypeExtendedRef,
    isConstraintSubTypeOriginal,
    ConstraintSubTypeOriginal,
    ConstraintSubTypeExtendedRef,
    DataAttribute,
    Goal,
    isGoalTypeOriginal,
    GoalTypeOriginal,
    GoalTypeExtendedRef,
    isGoalSubTypeOriginal,
    GoalSubTypeOriginal,
    GoalSubTypeExtendedRef,
    LinguisticFragment,
    LinguisticRule,
    MainScenario,
    Actor,
    DataEntity,
    FR,
    GlossaryTerm,
    QR,
    Risk,
    Stakeholder,
    Step,
    UserStory,
    Vulnerability,
    OtherElement,
    isQRTypeOriginal,
    QRTypeOriginal,
    QRTypeExtendedRef,
    isQRSubTypeOriginal,
    QRSubTypeOriginal,
    QRSubTypeExtendedRef,
    Requirement,
    RequirementsRelation,
    isRiskTypeOriginal,
    RiskTypeOriginal,
    RiskTypeExtendedRef,
    isRiskSubTypeOriginal,
    RiskSubTypeOriginal,
    RiskSubTypeExtendedRef,
    Scenario,
    isStakeholderTypeOriginal,
    StakeholderTypeOriginal,
    StakeholderTypeExtendedRef,
    isStakeholderSubTypeOriginal,
    StakeholderSubTypeOriginal,
    StakeholderSubTypeExtendedRef,
    StateMachine,
    StructureElement,
    SystemRelation,
    SystemsRelation,
    SystemSet,
    isSystemTypeOriginal,
    SystemTypeOriginal,
    SystemTypeExtendedRef,
    isSystemSubTypeOriginal,
    SystemSubTypeOriginal,
    SystemSubTypeExtendedRef,
    Test,
    UseCase,
    isVulnerabilityTypeOriginal,
    VulnerabilityTypeOriginal,
    VulnerabilityTypeExtendedRef,
    isVulnerabilitySubTypeOriginal,
    VulnerabilitySubTypeOriginal,
    VulnerabilitySubTypeExtendedRef,
    SystemConcept,
    LinguisticElement,
    LinguisticRuleElementProperty,
    LinguisticRuleSeverityLevel,
    LinguisticPattern,
    PartOfSpeech,
    Word,
    LinguisticRuleElementAndProperty,
    LinguisticFragmentRef,
    State,
    isLinguisticFragmentRef,
    LinguisticLanguage,
    IncludeAll,
    IncludeElement,
    LinguisticLanguageType,
    isSystem,
} from './generated/ast';
import type { RslServices } from './rsl-module';
import { LinguisticFragmentPartHelper, OptionType } from '../validation/linguisticFragmentPartHelper';
import {
    getGlossaryTerms,
    getLinguisticLanguageType,
    getLinguisticLanguages,
    getLinguisticRules,
    getStereotypeType,
    isGlossaryTermApplicableTo,
} from '../util/rsl-utilities';
import { NlpHelper } from '../validation/nlpHelper';
import { NlpToken } from '../validation/nlpToken';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: RslServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.RslValidator;
    const checks: ValidationChecks<RslAstType> = {
        ActiveFlow: validator.checkActiveFlowCondition,
        ActiveTask: [validator.checkActiveTaskParticipantTarget, validator.checkNoCycleInActiveTaskPartOfHierarchy],
        Actor: validator.checkNoCycleInActorIsAHierarchy,
        BehaviorElement: validator.checkBehaviorElement,
        Constraint: [validator.checkConstraintTypeSubType, validator.checkNoCycleInConstraintPartOfHierarchy],
        DataAttribute: validator.checkDataAttributeElement,
        DataEntity: validator.checkNoCycleInDataEntityIsAHierarchy,
        FR: validator.checkNoCycleInFRPartOfHierarchy,
        GlossaryTerm: [validator.checkNoCycleInGlossaryTermIsAHierarchy, validator.checkNoCycleInGlossaryTermPartOfHierarchy],
        Goal: [validator.checkGoalTypeSubType, validator.checkNoCycleInGoalPartOfHierarchy],
        IncludeAll: [validator.checkIncludeAll],
        IncludeElement: [validator.checkIncludeElement],
        LinguisticFragment: validator.checkLinguisticFragment,
        LinguisticLanguage: validator.checkUniqueLinguisticLanguage,
        LinguisticRule: validator.checkLinguisticRule,
        MainScenario: validator.checkMainScenario,
        OtherElement: validator.checkOtherElement,
        QR: [validator.checkNoCycleInQRPartOfHierarchy, validator.checkQRTypeSubType],
        Risk: [validator.checkNoCycleInRiskPartOfHierarchy, validator.checkRiskTypeSubType],
        Requirement: validator.checkRequirement,
        RequirementsRelation: validator.checkRequirementsRelationSrcTrgt,
        Scenario: validator.checkScenario,
        Stakeholder: [
            validator.checkNoCycleInStakeholderIsAHierarchy,
            validator.checkNoCycleInStakeholderPartOfHierarchy,
            validator.checkStakeholderTypeSubType,
        ],
        StateMachine: validator.checkStateMachineStates,
        Step: [validator.checkStep, validator.checkNoCycleInStepsHierarchy],
        StructureElement: validator.checkStructureElement,
        System: validator.checkSystemTypeSubType,
        SystemsRelation: [validator.checkSystemRelationSrcTrgt, validator.checkSystemRelation],
        SystemSet: validator.checkSystemSet,
        Test: validator.checkTest,
        UseCase: validator.checkUseCaseExtendsItself,
        UserStory: validator.checkNoCycleInUserStoryPartOfHierarchy,
        Vulnerability: [
            validator.checkNoCycleInVulnerabilityIsAHierarchy,
            validator.checkNoCycleInVulnerabilityPartOfHierarchy,
            validator.checkVulnerabilityTypeSubType,
        ],
    };
    registry.register(checks, validator);
}

export namespace IssueCodes {
    export const ISSUE_CODE_PREFIX = 'org.itlingo.rsl.';
    export const CREATE_ELEMENT = ISSUE_CODE_PREFIX + 'CreateElement';
    export const LINGUISTIC_RULE = ISSUE_CODE_PREFIX + 'LinguisticRule';
    export const SELECT_ELEMENT = ISSUE_CODE_PREFIX + 'SelectElement';
    export const REPLACE_WORD = ISSUE_CODE_PREFIX + 'Replace';
    export const INVALID_NAME = ISSUE_CODE_PREFIX + 'InvalidName';
    export const INVALID_ID = ISSUE_CODE_PREFIX + 'InvalidID';
    export const INCONSISTENT_TERM = ISSUE_CODE_PREFIX + 'InconsistentTerm';
    export const REMOVE_EXCESS_TEXT = ISSUE_CODE_PREFIX + 'RemoveExcessText';

    /* Hierarchy cycle error codes */
    export const STEP_NEXT_HIERARCHY_CYCLE = ISSUE_CODE_PREFIX + 'StepNextHierarchyCycle';
    export const PARTOF_HIERARCHY_CYCLE = ISSUE_CODE_PREFIX + 'PartOfHierarchyCycle';
    export const ISA_HIERARCHY_CYCLE = ISSUE_CODE_PREFIX + 'IsAHierarchyCycle';

    /* Bad Hierarchy error codes */
    export const BAD_UC_HIERARCHY = ISSUE_CODE_PREFIX + 'BadUCHierarchy';

    /* */
    export const SM_INIT_FINAL_STATES = ISSUE_CODE_PREFIX + 'SMStates';
    export const SYS_RELATION_CYCLE = ISSUE_CODE_PREFIX + 'SysRelCycle';
    export const RELATION_CYCLE = ISSUE_CODE_PREFIX + 'RelCycle';

    /* Invalid types error codes */
    export const INVALID_SUBTYPE = ISSUE_CODE_PREFIX + 'invalidSubType';

    /* Inconsistent element fragments error codes */
    export const INVALID_AT_PARTICIPANTTARGET = ISSUE_CODE_PREFIX + 'invalidATParticipantTarget';
    export const INVALID_AF_CONDITION = ISSUE_CODE_PREFIX + 'invalidAFCondition';
    export const INVALID_LINGUISTICLANGUAGE = ISSUE_CODE_PREFIX + 'LinguisticLanguage';
    export const INCLUDE_ELEMENT = ISSUE_CODE_PREFIX + 'IncludeElement';
    export const INCLUDE_ALL = ISSUE_CODE_PREFIX + 'IncludeAll';
}

/**
 * Implementation of custom validations.
 */
export class RslValidator {
    private readonly nlpHelper: NlpHelper;

    constructor() {
        this.nlpHelper = new NlpHelper();
    }

    /**
     * Checks if ActiveFlow type condition is consistent.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkActiveFlowCondition(element: ActiveFlow, accept: ValidationAcceptor): void {
        if (!element.condition || !element.type) {
            return;
        }

        const type = isActiveFlowTypeOriginal(element.type)
            ? (element.type as ActiveFlowTypeOriginal).type
            : (element.type as ActiveFlowTypeExtendedRef).type.$refText;

        if (type !== 'SequenceConditional') {
            accept('error', "TaskFlow '" + element.name + "' cannot have a condition unless it is of type SequenceConditional", {
                node: element,
                property: 'condition',
                code: IssueCodes.INVALID_AF_CONDITION,
            });
        }
    }

    /**
     * Checks if ActiveTask type is consistent with participants.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkActiveTaskParticipantTarget(element: ActiveTask, accept: ValidationAcceptor): void {
        if (!element.participantTarget || !element.type) {
            return;
        }

        const type = isActiveTaskTypeOriginal(element.type)
            ? (element.type as ActiveTaskTypeOriginal).type
            : (element.type as ActiveTaskTypeExtendedRef).type.$refText;

        if (!(type === 'Send' || type === 'Receive')) {
            accept('error', "ActiveTask '" + element.name + "' cannot have external participants unless it's of type Send or Receive", {
                node: element,
                property: 'participantTarget',
                code: IssueCodes.INVALID_AT_PARTICIPANTTARGET,
            });
        }
    }

    /**
     * Checks if the name ID is unique and checks name, name alias and descriptions
     * of Behavior Elements taking into account synonyms and linguistic rules
     * defined.
     *
     * @param behaviorElement RSL element to check.
     * @param accept          The validation acceptor function to handle validation issues.
     */
    checkBehaviorElement(element: BehaviorElement, accept: ValidationAcceptor): void {
        const system = getContainerOfType(element, isSystem);

        if (!system) {
            return;
        }

        const linguisticRules = getLinguisticRules(system);
        const linguisticLanguage = getLinguisticLanguageType(system);

        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);

        const glossaryTerms = getGlossaryTerms(system);

        this.checkSynonyms(glossaryTerms, element, element.name, 'name', accept);
        this.checkSynonyms(glossaryTerms, element, element.nameAlias, 'nameAlias', accept);
        this.checkSynonyms(glossaryTerms, element, element.description, 'description', accept);

        this.checkUniqueElementId(element.name, element, system, accept);
    }

    /**
     * Checks if constraint type and sub-types are consistent.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkConstraintTypeSubType(element: Constraint, accept: ValidationAcceptor): void {
        if (!element.type || !element.subType) {
            return;
        }

        const type = isConstraintTypeOriginal(element.type)
            ? (element.type as ConstraintTypeOriginal).type
            : (element.type as ConstraintTypeExtendedRef).type.$refText;

        const subType = isConstraintSubTypeOriginal(element.subType)
            ? (element.subType as ConstraintSubTypeOriginal).type
            : (element.subType as ConstraintSubTypeExtendedRef).type.$refText;

        if (!subType.includes(type)) {
            accept('error', "Constraint '" + element.name + "' has inconsistent type and subType", {
                node: element,
                property: 'subType',
                code: IssueCodes.INVALID_SUBTYPE,
            });
        }
    }

    /**
     * Checks if the name ID is unique and checks name, name alias and descriptions
     * of DataAttributes taking into account synonyms and linguistic rules defined.
     *
     * @param dataAttribute RSL element to check.
     * @param accept        The validation acceptor function to handle validation issues.
     */
    checkDataAttributeElement(element: DataAttribute, accept: ValidationAcceptor): void {
        const system = getContainerOfType(element, isSystem);

        if (!system) {
            return;
        }

        const linguisticRules = getLinguisticRules(system);
        const linguisticLanguage = getLinguisticLanguageType(system);

        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);

        const glossaryTerms = getGlossaryTerms(system);

        this.checkSynonyms(glossaryTerms, element, element.name, 'name', accept);
        this.checkSynonyms(glossaryTerms, element, element.nameAlias, 'nameAlias', accept);
        this.checkSynonyms(glossaryTerms, element, element.description, 'description', accept);

        this.checkUniqueElementId(element.name, element, system, accept);
    }

    /**
     * Checks if goal type and sub-types are consistent.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkGoalTypeSubType(element: Goal, accept: ValidationAcceptor): void {
        if (!element.type || !element.subType) {
            return;
        }

        const type = isGoalTypeOriginal(element.type)
            ? (element.type as GoalTypeOriginal).type
            : (element.type as GoalTypeExtendedRef).type.$refText;

        const subType = isGoalSubTypeOriginal(element.subType)
            ? (element.subType as GoalSubTypeOriginal).type
            : (element.subType as GoalSubTypeExtendedRef).type.$refText;

        if (!subType.includes(type)) {
            accept('error', "Goal '" + element.name + "' has inconsistent type and subType", {
                node: element,
                property: 'subType',
                code: IssueCodes.INVALID_SUBTYPE,
            });
        }
    }

    /**
     * Checks if there are elements that can be copied to the system.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkIncludeAll(element: IncludeAll, accept: ValidationAcceptor): void {
        if (!element.system) {
            return;
        }

        const system = element.system.ref;

        if (!system?.systemConcepts) {
            return;
        }

        const systemName = system.name;

        let newElementsText = '';

        for (let concept of system.systemConcepts) {
            if (!concept.$cstNode?.text) {
                continue;
            }
            newElementsText += `${EOL}${concept.$cstNode?.text}${EOL}`;
        }

        accept('info', `Replace this specification with all elements from the ${systemName} system`, {
            node: element,
            code: IssueCodes.INCLUDE_ALL,
            data: [systemName, newElementsText],
        });
    }

    /**
     * Checks if there are elements that can be copied to the system.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkIncludeElement(element: IncludeElement, accept: ValidationAcceptor): void {
        if (!element.element || !element.type) {
            return;
        }

        const elementType = element.type.type;

        let newElement = element.element.ref;

        if (!newElement) {
            return;
        }

        let newElementText = '';

        if (newElement.$cstNode?.text) {
            newElementText = newElement.$cstNode?.text;
        }

        accept('info', `Replace this specification with the ${elementType} element specification`, {
            node: element,
            code: IssueCodes.INCLUDE_ELEMENT,
            data: [elementType, newElementText],
        });
    }

    /**
     * Checks if the name ID is unique and checks name, name alias and descriptions
     * of LinguisticFragments regarding the use of synonyms defined.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkLinguisticFragment(element: LinguisticFragment, accept: ValidationAcceptor): void {
        const system = getContainerOfType(element, isSystem);

        if (!system) {
            return;
        }

        const linguisticRules = getLinguisticRules(system);
        const linguisticLanguage = getLinguisticLanguageType(system);

        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);

        const glossaryTerms = getGlossaryTerms(system);

        this.checkSynonyms(glossaryTerms, element, element.name, 'name', accept);
        this.checkSynonyms(glossaryTerms, element, element.nameAlias, 'nameAlias', accept);
        this.checkSynonyms(glossaryTerms, element, element.description, 'description', accept);

        this.checkUniqueElementId(element.name, element, system, accept);
    }

    /**
     * Checks if the name ID is unique and checks name, name alias and descriptions
     * of LinguisticRules regarding the use of synonyms defined.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkLinguisticRule(element: LinguisticRule, accept: ValidationAcceptor): void {
        const system = getContainerOfType(element, isSystem);

        if (!system) {
            return;
        }

        const linguisticRules = getLinguisticRules(system);
        const linguisticLanguage = getLinguisticLanguageType(system);

        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);

        const glossaryTerms = getGlossaryTerms(system);

        this.checkSynonyms(glossaryTerms, element, element.name, 'name', accept);
        this.checkSynonyms(glossaryTerms, element, element.nameAlias, 'nameAlias', accept);
        this.checkSynonyms(glossaryTerms, element, element.description, 'description', accept);

        this.checkUniqueElementId(element.name, element, system, accept);
    }

    /**
     * Checks if the name ID is unique and checks name, name alias and descriptions
     * of MainScenarios taking into account synonyms and linguistic rules defined.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkMainScenario(element: MainScenario, accept: ValidationAcceptor): void {
        const system = getContainerOfType(element, isSystem);

        if (!system) {
            return;
        }

        const linguisticRules = getLinguisticRules(system);
        const linguisticLanguage = getLinguisticLanguageType(system);

        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);

        const glossaryTerms = getGlossaryTerms(system);

        this.checkSynonyms(glossaryTerms, element, element.name, 'name', accept);
        this.checkSynonyms(glossaryTerms, element, element.nameAlias, 'nameAlias', accept);
        this.checkSynonyms(glossaryTerms, element, element.description, 'description', accept);

        this.checkUniqueElementId(element.name, element, system, accept);
    }

    /**
     * Checks if the active task element has a cycle in its 'part-of' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInActiveTaskPartOfHierarchy(element: ActiveTask, accept: ValidationAcceptor): void {
        let partOfElement = element.partOf;

        if (!partOfElement) {
            return;
        }

        if (partOfElement.ref?.name === element.name) {
            accept('error', "Constraint '" + element.name + "' is part of itself", {
                node: element,
                property: 'partOf',
                code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
            });
            return;
        }

        let visitedElements = new Set<string>();
        visitedElements.add(element.name);

        while (partOfElement) {
            if (!partOfElement.ref?.name) {
                break;
            }

            if (visitedElements.has(partOfElement.ref?.name)) {
                accept('error', "Cycle in hierarchy of Constraint '" + element.name + "'", {
                    node: element,
                    property: 'partOf',
                    code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
                });
                break;
            }

            visitedElements.add(partOfElement.ref?.name);
            partOfElement = partOfElement.ref?.partOf;
        }
    }

    /**
     * Checks if the actor element has a cycle in its 'is-a' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInActorIsAHierarchy(element: Actor, accept: ValidationAcceptor): void {
        let superElement = element.super;

        if (!superElement) {
            return;
        }

        if (superElement.ref?.name === element.name) {
            accept('error', "Actor '" + element.name + "' extends itself", {
                node: element,
                property: 'super',
                code: IssueCodes.ISA_HIERARCHY_CYCLE,
            });
            return;
        }

        let visitedElements = new Set<string>();
        visitedElements.add(element.name);

        while (superElement) {
            if (!superElement.ref?.name) {
                break;
            }

            if (visitedElements.has(superElement.ref?.name)) {
                accept('error', "Cycle in hierarchy of Actor '" + element.name + "'", {
                    node: element,
                    property: 'super',
                    code: IssueCodes.ISA_HIERARCHY_CYCLE,
                });
                break;
            }

            visitedElements.add(superElement.ref?.name);
            superElement = superElement.ref?.super;
        }
    }

    /**
     * Checks if the constraint element has a cycle in its part-of relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInConstraintPartOfHierarchy(element: Constraint, accept: ValidationAcceptor): void {
        let partOfElement = element.partOf;

        if (!partOfElement) {
            return;
        }

        if (partOfElement.ref?.name === element.name) {
            accept('error', "Constraint '" + element.name + "' is part of itself", {
                node: element,
                property: 'partOf',
                code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
            });
            return;
        }

        let visitedElements = new Set<string>();
        visitedElements.add(element.name);

        while (partOfElement) {
            if (!partOfElement.ref?.name) {
                break;
            }

            if (visitedElements.has(partOfElement.ref?.name)) {
                accept('error', "Cycle in hierarchy of Constraint '" + element.name + "'", {
                    node: element,
                    property: 'partOf',
                    code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
                });
                break;
            }

            visitedElements.add(partOfElement.ref?.name);
            partOfElement = partOfElement.ref?.partOf;
        }
    }

    /**
     * Checks if the data entity element has a cycle in its 'is-a' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInDataEntityIsAHierarchy(element: DataEntity, accept: ValidationAcceptor): void {
        let superElement = element.super;

        if (!superElement) {
            return;
        }

        if (superElement.ref?.name === element.name) {
            accept('error', "DataEntity '" + element.name + "' extends itself", {
                node: element,
                property: 'super',
                code: IssueCodes.ISA_HIERARCHY_CYCLE,
            });
            return;
        }

        let visitedElements = new Set<string>();
        visitedElements.add(element.name);

        while (superElement) {
            if (!superElement.ref?.name) {
                break;
            }

            if (visitedElements.has(superElement.ref?.name)) {
                accept('error', "Cycle in hierarchy of DataEntity '" + element.name + "'", {
                    node: element,
                    property: 'super',
                    code: IssueCodes.ISA_HIERARCHY_CYCLE,
                });
                break;
            }

            visitedElements.add(superElement.ref?.name);
            superElement = superElement.ref?.super;
        }
    }

    /**
     * Checks if the FR element has a cycle in its 'part-of' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInFRPartOfHierarchy(element: FR, accept: ValidationAcceptor): void {
        let partOfElement = element.partOf;

        if (!partOfElement) {
            return;
        }

        if (partOfElement.ref?.name === element.name) {
            accept('error', "FR '" + element.name + "' is part of itself", {
                node: element,
                property: 'partOf',
                code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
            });
            return;
        }

        let visitedElements = new Set<string>();
        visitedElements.add(element.name);

        while (partOfElement) {
            if (!partOfElement.ref?.name) {
                break;
            }

            if (visitedElements.has(partOfElement.ref?.name)) {
                accept('error', "Cycle in hierarchy of FR '" + element.name + "'", {
                    node: element,
                    property: 'partOf',
                    code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
                });
                break;
            }

            visitedElements.add(partOfElement.ref?.name);
            partOfElement = partOfElement.ref?.partOf;
        }
    }

    /**
     * Checks if the glossary term element has a cycle in its 'is-a' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInGlossaryTermIsAHierarchy(element: GlossaryTerm, accept: ValidationAcceptor): void {
        let superElement = element.super;

        if (!superElement) {
            return;
        }

        if (superElement.ref?.name === element.name) {
            accept('error', "GlossaryTerm '" + element.name + "' extends itself", {
                node: element,
                property: 'super',
                code: IssueCodes.ISA_HIERARCHY_CYCLE,
            });
            return;
        }

        let visitedElements = new Set<string>();
        visitedElements.add(element.name);

        while (superElement) {
            if (!superElement.ref?.name) {
                break;
            }

            if (visitedElements.has(superElement.ref?.name)) {
                accept('error', "Cycle in hierarchy of GlossaryTerm '" + element.name + "'", {
                    node: element,
                    property: 'super',
                    code: IssueCodes.ISA_HIERARCHY_CYCLE,
                });
                break;
            }

            visitedElements.add(superElement.ref?.name);
            superElement = superElement.ref?.super;
        }
    }

    /**
     * Checks if the glossary term element has a cycle in its 'part-of' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInGlossaryTermPartOfHierarchy(element: GlossaryTerm, accept: ValidationAcceptor): void {
        let partOfElement = element.partOf;

        if (!partOfElement) {
            return;
        }

        if (partOfElement.ref?.name === element.name) {
            accept('error', "GlossaryTerm '" + element.name + "' is part of itself", {
                node: element,
                property: 'partOf',
                code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
            });
            return;
        }

        let visitedElements = new Set<string>();
        visitedElements.add(element.name);

        while (partOfElement) {
            if (!partOfElement.ref?.name) {
                break;
            }

            if (visitedElements.has(partOfElement.ref?.name)) {
                accept('error', "Cycle in hierarchy of GlossaryTerm '" + element.name + "'", {
                    node: element,
                    property: 'partOf',
                    code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
                });
                break;
            }

            visitedElements.add(partOfElement.ref?.name);
            partOfElement = partOfElement.ref?.partOf;
        }
    }

    /**
     * Checks if the goal element has a cycle in its 'part-of' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInGoalPartOfHierarchy(element: Goal, accept: ValidationAcceptor): void {
        let partOfElement = element.partOf;

        if (!partOfElement) {
            return;
        }

        if (partOfElement.ref?.name === element.name) {
            accept('error', "Goal '" + element.name + "' is part of itself", {
                node: element,
                property: 'partOf',
                code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
            });
            return;
        }

        let visitedElements = new Set<string>();
        visitedElements.add(element.name);

        while (partOfElement) {
            if (!partOfElement.ref?.name) {
                break;
            }

            if (visitedElements.has(partOfElement.ref?.name)) {
                accept('error', "Cycle in hierarchy of Goal '" + element.name + "'", {
                    node: element,
                    property: 'partOf',
                    code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
                });
                break;
            }

            visitedElements.add(partOfElement.ref?.name);
            partOfElement = partOfElement.ref?.partOf;
        }
    }

    /**
     * Checks if the QR element has a cycle in its 'part-of' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInQRPartOfHierarchy(element: QR, accept: ValidationAcceptor): void {
        let partOfElement = element.partOf;

        if (!partOfElement) {
            return;
        }

        if (partOfElement.ref?.name === element.name) {
            accept('error', "QR '" + element.name + "' is part of itself", {
                node: element,
                property: 'partOf',
                code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
            });
            return;
        }

        let visitedElements = new Set<string>();
        visitedElements.add(element.name);

        while (partOfElement) {
            if (!partOfElement.ref?.name) {
                break;
            }

            if (visitedElements.has(partOfElement.ref?.name)) {
                accept('error', "Cycle in hierarchy of QR '" + element.name + "'", {
                    node: element,
                    property: 'partOf',
                    code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
                });
                break;
            }

            visitedElements.add(partOfElement.ref?.name);
            partOfElement = partOfElement.ref?.partOf;
        }
    }

    /**
     * Checks if the risk element has a cycle in its 'part-of' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInRiskPartOfHierarchy(element: Risk, accept: ValidationAcceptor): void {
        let partOfElement = element.partOf;

        if (!element.name || !partOfElement) {
            return;
        }

        if (partOfElement.ref?.name === element.name) {
            accept('error', "Risk '" + element.name + "' is part of itself", {
                node: element,
                property: 'partOf',
                code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
            });
            return;
        }

        let visitedElements = new Set<string>();
        visitedElements.add(element.name);

        while (partOfElement) {
            if (!partOfElement.ref?.name) {
                break;
            }

            if (visitedElements.has(partOfElement.ref?.name)) {
                accept('error', "Cycle in hierarchy of Risk '" + element.name + "'", {
                    node: element,
                    property: 'partOf',
                    code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
                });
                break;
            }

            visitedElements.add(partOfElement.ref?.name);
            partOfElement = partOfElement.ref?.partOf;
        }
    }

    /**
     * Checks if the stakeholder element has a cycle in its 'is-a' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInStakeholderIsAHierarchy(element: Stakeholder, accept: ValidationAcceptor): void {
        let superElement = element.super;

        if (!superElement) {
            return;
        }

        if (superElement.ref?.name === element.name) {
            accept('error', "Stakeholder '" + element.name + "' extends itself", {
                node: element,
                property: 'super',
                code: IssueCodes.ISA_HIERARCHY_CYCLE,
            });
            return;
        }

        let visitedElements = new Set<string>();
        visitedElements.add(element.name);

        while (superElement) {
            if (!superElement.ref?.name) {
                break;
            }

            if (visitedElements.has(superElement.ref?.name)) {
                accept('error', "Cycle in hierarchy of Stakeholder '" + element.name + "'", {
                    node: element,
                    property: 'super',
                    code: IssueCodes.ISA_HIERARCHY_CYCLE,
                });
                break;
            }

            visitedElements.add(superElement.ref?.name);
            superElement = superElement.ref?.super;
        }
    }

    /**
     * Checks if the stakeholder element has a cycle in its 'part-of' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInStakeholderPartOfHierarchy(element: Stakeholder, accept: ValidationAcceptor): void {
        let partOfElement = element.partOf;

        if (!partOfElement) {
            return;
        }

        if (partOfElement.ref?.name === element.name) {
            accept('error', "Stakeholder '" + element.name + "' is part of itself", {
                node: element,
                property: 'partOf',
                code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
            });
            return;
        }

        let visitedElements = new Set<string>();
        visitedElements.add(element.name);

        while (partOfElement) {
            if (!partOfElement.ref?.name) {
                break;
            }

            if (visitedElements.has(partOfElement.ref?.name)) {
                accept('error', "Cycle in hierarchy of Stakeholder '" + element.name + "'", {
                    node: element,
                    property: 'partOf',
                    code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
                });
                break;
            }

            visitedElements.add(partOfElement.ref?.name);
            partOfElement = partOfElement.ref?.partOf;
        }
    }

    /**
     * Checks if the step element has a cycle in its 'next' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInStepsHierarchy(element: Step, accept: ValidationAcceptor): void {
        let nextElement = element.next;

        if (!nextElement) {
            return;
        }

        if (nextElement.ref?.name === element.name) {
            accept('error', "Step '" + element.name + "' has a cycle in 'next' relationship", {
                node: element,
                property: 'next',
                code: IssueCodes.STEP_NEXT_HIERARCHY_CYCLE,
            });
            return;
        }

        let visitedElements = new Set<string>();
        visitedElements.add(element.name);

        while (nextElement) {
            if (!nextElement.ref?.name) {
                break;
            }

            if (visitedElements.has(nextElement.ref?.name)) {
                accept('error', "Cycle in 'next' relationship of '" + element.name + "'", {
                    node: element,
                    property: 'next',
                    code: IssueCodes.STEP_NEXT_HIERARCHY_CYCLE,
                });
                break;
            }

            visitedElements.add(nextElement.ref?.name);
            nextElement = nextElement.ref?.next;
        }
    }

    /**
     * Checks if the user story element has a cycle in its part-of relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInUserStoryPartOfHierarchy(element: UserStory, accept: ValidationAcceptor): void {
        let partOfElement = element.partOf;

        if (!partOfElement) {
            return;
        }

        if (partOfElement.ref?.name === element.name) {
            accept('error', "UserStory '" + element.name + "' is part of itself", {
                node: element,
                property: 'partOf',
                code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
            });
            return;
        }

        let visitedElements = new Set<string>();
        visitedElements.add(element.name);

        while (partOfElement) {
            if (!partOfElement.ref?.name) {
                break;
            }

            if (visitedElements.has(partOfElement.ref?.name)) {
                accept('error', "Cycle in hierarchy of UserStory '" + element.name + "'", {
                    node: element,
                    property: 'partOf',
                    code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
                });
                break;
            }

            visitedElements.add(partOfElement.ref?.name);
            partOfElement = partOfElement.ref?.partOf;
        }
    }

    /**
     * Checks if the vulnerability element has a cycle in its 'is-a' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInVulnerabilityIsAHierarchy(element: Vulnerability, accept: ValidationAcceptor): void {
        let superElement = element.super;

        if (!superElement) {
            return;
        }

        if (superElement.ref?.name === element.name) {
            accept('error', "Vulnerability '" + element.name + "' extends itself", {
                node: element,
                property: 'super',
                code: IssueCodes.ISA_HIERARCHY_CYCLE,
            });
            return;
        }

        let visitedElements = new Set<string>();
        visitedElements.add(element.name);

        while (superElement) {
            if (!superElement.ref?.name) {
                break;
            }

            if (visitedElements.has(superElement.ref?.name)) {
                accept('error', "Cycle in hierarchy of Vulnerability '" + element.name + "'", {
                    node: element,
                    property: 'super',
                    code: IssueCodes.ISA_HIERARCHY_CYCLE,
                });
                break;
            }

            visitedElements.add(superElement.ref?.name);
            superElement = superElement.ref?.super;
        }
    }

    /**
     * Checks if the vulnerability element has a cycle in its 'part-of'
     * relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInVulnerabilityPartOfHierarchy(element: Vulnerability, accept: ValidationAcceptor): void {
        let partOfElement = element.partOf;

        if (!partOfElement) {
            return;
        }

        if (partOfElement.ref?.name === element.name) {
            accept('error', "Vulnerability '" + element.name + "' is part of itself", {
                node: element,
                property: 'partOf',
                code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
            });
            return;
        }

        let visitedElements = new Set<string>();
        visitedElements.add(element.name);

        while (partOfElement) {
            if (!partOfElement.ref?.name) {
                break;
            }

            if (visitedElements.has(partOfElement.ref?.name)) {
                accept('error', "Cycle in hierarchy of Vulnerability '" + element.name + "'", {
                    node: element,
                    property: 'partOf',
                    code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
                });
                break;
            }

            visitedElements.add(partOfElement.ref?.name);
            partOfElement = partOfElement.ref?.partOf;
        }
    }

    /**
     * Checks if the name ID is unique and checks name, name alias and descriptions
     * of OtherElements taking into account synonyms and linguistic rules defined.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkOtherElement(element: OtherElement, accept: ValidationAcceptor): void {
        if (!element.name) {
            return;
        }

        const system = getContainerOfType(element, isSystem);

        if (!system) {
            return;
        }

        const linguisticRules = getLinguisticRules(system);
        const linguisticLanguage = getLinguisticLanguageType(system);

        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);

        const glossaryTerms = getGlossaryTerms(system);

        this.checkSynonyms(glossaryTerms, element, element.name, 'name', accept);
        this.checkSynonyms(glossaryTerms, element, element.nameAlias, 'nameAlias', accept);
        this.checkSynonyms(glossaryTerms, element, element.description, 'description', accept);

        this.checkUniqueElementId(element.name, element, system, accept);
    }

    /**
     * Checks if QR type and sub-types are consistent.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkQRTypeSubType(element: QR, accept: ValidationAcceptor): void {
        if (!element.type || !element.subType) {
            return;
        }

        const type = isQRTypeOriginal(element.type)
            ? (element.type as QRTypeOriginal).type
            : (element.type as QRTypeExtendedRef).type.$refText;

        const subType = isQRSubTypeOriginal(element.subType)
            ? (element.subType as QRSubTypeOriginal).type
            : (element.subType as QRSubTypeExtendedRef).type.$refText;

        if (!subType.includes(type)) {
            accept('error', "QR '" + element.name + "' has inconsistent type and subType", {
                node: element,
                property: 'subType',
                code: IssueCodes.INVALID_SUBTYPE,
            });
        }
    }

    /**
     * Checks if the name ID is unique and checks name, name alias and descriptions
     * of Requirements taking into account synonyms and linguistic rules defined.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkRequirement(element: Requirement, accept: ValidationAcceptor): void {
        const system = getContainerOfType(element, isSystem);

        if (!system) {
            return;
        }

        const linguisticRules = getLinguisticRules(system);
        const linguisticLanguage = getLinguisticLanguageType(system);

        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);

        const glossaryTerms = getGlossaryTerms(system);

        this.checkSynonyms(glossaryTerms, element, element.name, 'name', accept);
        this.checkSynonyms(glossaryTerms, element, element.nameAlias, 'nameAlias', accept);
        this.checkSynonyms(glossaryTerms, element, element.description, 'description', accept);

        this.checkUniqueElementId(element.name, element, system, accept);
    }

    /**
     * Checks if the source and target are the same in a requirements relation.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkRequirementsRelationSrcTrgt(element: RequirementsRelation, accept: ValidationAcceptor): void {
        if (!element.source || !element.target) {
            return;
        }

        if (element.source === element.target) {
            accept('error', "RequirementsRelation '" + element.name + "' has the same source and target", {
                node: element,
                property: 'source',
                code: IssueCodes.RELATION_CYCLE,
            });
        }
    }

    /**
     * Checks if risk type and sub-types are consistent.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkRiskTypeSubType(element: Risk, accept: ValidationAcceptor): void {
        if (!element.type || !element.subType) {
            return;
        }

        const type = isRiskTypeOriginal(element.type)
            ? (element.type as RiskTypeOriginal).type
            : (element.type as RiskTypeExtendedRef).type.$refText;

        const subType = isRiskSubTypeOriginal(element.subType)
            ? (element.subType as RiskSubTypeOriginal).type
            : (element.subType as RiskSubTypeExtendedRef).type.$refText;

        if (!subType.includes(type)) {
            accept('error', "Risk '" + element.name + "' has inconsistent type and subType", {
                node: element,
                property: 'subType',
                code: IssueCodes.INVALID_SUBTYPE,
            });
        }
    }

    /**
     * Checks if the name ID is unique and checks name, name alias and descriptions
     * of Scenarios regarding the use of synonyms and the linguistic rules defined.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkScenario(element: Scenario, accept: ValidationAcceptor): void {
        const system = getContainerOfType(element, isSystem);

        if (!system) {
            return;
        }

        const linguisticRules = getLinguisticRules(system);
        const linguisticLanguage = getLinguisticLanguageType(system);

        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);

        const glossaryTerms = getGlossaryTerms(system);

        this.checkSynonyms(glossaryTerms, element, element.name, 'name', accept);
        this.checkSynonyms(glossaryTerms, element, element.nameAlias, 'nameAlias', accept);
        this.checkSynonyms(glossaryTerms, element, element.description, 'description', accept);

        this.checkUniqueElementId(element.name, element, system, accept);
    }

    /**
     * Checks if stakeholder type and sub-types are consistent.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkStakeholderTypeSubType(element: Stakeholder, accept: ValidationAcceptor): void {
        if (!element.type || !element.subType) {
            return;
        }

        const type = isStakeholderTypeOriginal(element.type)
            ? (element.type as StakeholderTypeOriginal).type
            : (element.type as StakeholderTypeExtendedRef).type.$refText;

        const subType = isStakeholderSubTypeOriginal(element.subType)
            ? (element.subType as StakeholderSubTypeOriginal).type
            : (element.subType as StakeholderSubTypeExtendedRef).type.$refText;

        if (!subType.includes(type)) {
            accept('error', "Stakeholder '" + element.name + "' has inconsistent type and subType", {
                node: element,
                property: 'subType',
                code: IssueCodes.INVALID_SUBTYPE,
            });
        }
    }

    /**
     * Checks if StateMachine has initial and final state.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkStateMachineStates(element: StateMachine, accept: ValidationAcceptor): void {
        let states = element.states?.states as State[];
        let hasInitialState = false;
        let hasFinalState = false;

        states.forEach((state) => {
            if (state.isInitial) {
                hasInitialState = true;
            }

            if (state.isFinal) {
                hasFinalState = true;
            }
        });

        if (!hasInitialState) {
            accept('warning', "State Machine '" + element.name + "' has no initial state", {
                node: element,
                property: 'states',
                code: IssueCodes.SM_INIT_FINAL_STATES,
            });
        }

        if (!hasFinalState) {
            accept('warning', "State Machine '" + element.name + "' has no final state", {
                node: element,
                property: 'states',
                code: IssueCodes.SM_INIT_FINAL_STATES,
            });
        }
    }

    /**
     * Checks if the name ID is unique and checks name, name alias and descriptions
     * of Steps regarding the use of synonyms and the linguistic rules defined.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkStep(element: Step, accept: ValidationAcceptor): void {
        const system = getContainerOfType(element, isSystem);

        if (!system) {
            return;
        }

        const linguisticRules = getLinguisticRules(system);
        const linguisticLanguage = getLinguisticLanguageType(system);

        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);

        const glossaryTerms = getGlossaryTerms(system);

        this.checkSynonyms(glossaryTerms, element, element.name, 'name', accept);
        this.checkSynonyms(glossaryTerms, element, element.nameAlias, 'nameAlias', accept);
        this.checkSynonyms(glossaryTerms, element, element.description, 'description', accept);

        this.checkUniqueElementId(element.name, element, system, accept);
    }

    /**
     * Checks if the name ID is unique and checks name, name alias and descriptions
     * of StructureElements regarding the use of synonyms and the linguistic rules
     * defined.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkStructureElement(element: StructureElement, accept: ValidationAcceptor): void {
        const system = getContainerOfType(element, isSystem);

        if (!system) {
            return;
        }

        const linguisticRules = getLinguisticRules(system);
        const linguisticLanguage = getLinguisticLanguageType(system);

        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);

        const glossaryTerms = getGlossaryTerms(system);

        this.checkSynonyms(glossaryTerms, element, element.name, 'name', accept);
        this.checkSynonyms(glossaryTerms, element, element.nameAlias, 'nameAlias', accept);
        this.checkSynonyms(glossaryTerms, element, element.description, 'description', accept);

        this.checkUniqueElementId(element.name, element, system, accept);
    }

    /**
     * Checks if the name ID is unique and checks name, name alias and descriptions
     * of SystemRelations regarding the use of synonyms and the linguistic rules
     * defined.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkSystemRelation(element: SystemRelation, accept: ValidationAcceptor): void {
        const system = getContainerOfType(element, isSystem);

        if (!system) {
            return;
        }

        const linguisticRules = getLinguisticRules(system);
        const linguisticLanguage = getLinguisticLanguageType(system);

        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);

        const glossaryTerms = getGlossaryTerms(system);

        this.checkSynonyms(glossaryTerms, element, element.name, 'name', accept);
        this.checkSynonyms(glossaryTerms, element, element.nameAlias, 'nameAlias', accept);
        this.checkSynonyms(glossaryTerms, element, element.description, 'description', accept);

        this.checkUniqueElementId(element.name, element, system, accept);
    }

    /**
     * Checks if the source and target are the same in a system relation.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkSystemRelationSrcTrgt(element: SystemsRelation, accept: ValidationAcceptor): void {
        if (!element.source || !element.target) {
            return;
        }

        if (element.target === element.source) {
            accept('error', "SystemsRelation '" + element.name + "' has the same source and target", {
                node: element,
                property: 'source',
                code: IssueCodes.SYS_RELATION_CYCLE,
            });
        }
    }

    /**
     * Checks if the name ID is unique and checks name, name alias and descriptions
     * of SystemSets regarding the use of synonyms and the linguistic rules defined.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkSystemSet(element: SystemSet, accept: ValidationAcceptor): void {
        const system = getContainerOfType(element, isSystem);

        if (!system) {
            return;
        }

        const linguisticRules = getLinguisticRules(system);
        const linguisticLanguage = getLinguisticLanguageType(system);

        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);

        const glossaryTerms = getGlossaryTerms(system);

        this.checkSynonyms(glossaryTerms, element, element.name, 'name', accept);
        this.checkSynonyms(glossaryTerms, element, element.nameAlias, 'nameAlias', accept);
        this.checkSynonyms(glossaryTerms, element, element.description, 'description', accept);

        this.checkUniqueElementId(element.name, element, system, accept);
    }

    /**
     * Checks if system type and sub-types are consistent.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkSystemTypeSubType(element: System, accept: ValidationAcceptor): void {
        if (!element.type || !element.subType) {
            return;
        }

        const type = isSystemTypeOriginal(element.type)
            ? (element.type as SystemTypeOriginal).type
            : (element.type as SystemTypeExtendedRef).type.$refText;

        const subType = isSystemSubTypeOriginal(element.subType)
            ? (element.subType as SystemSubTypeOriginal).type
            : (element.subType as SystemSubTypeExtendedRef).type.$refText;

        if (!subType.includes(type)) {
            accept('error', "System '" + element.name + "' has inconsistent type and subType", {
                node: element,
                property: 'subType',
                code: IssueCodes.INVALID_SUBTYPE,
            });
        }
    }

    /**
     * Checks if the name ID is unique and checks name, name alias and descriptions
     * of Tests regarding the use of synonyms and the linguistic rules defined.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkTest(element: Test, accept: ValidationAcceptor): void {
        const system = getContainerOfType(element, isSystem);

        if (!system) {
            return;
        }

        const linguisticRules = getLinguisticRules(system);
        const linguisticLanguage = getLinguisticLanguageType(system);

        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);

        const glossaryTerms = getGlossaryTerms(system);

        this.checkSynonyms(glossaryTerms, element, element.name, 'name', accept);
        this.checkSynonyms(glossaryTerms, element, element.nameAlias, 'nameAlias', accept);
        this.checkSynonyms(glossaryTerms, element, element.description, 'description', accept);

        this.checkUniqueElementId(element.name, element, system, accept);
    }

    /**
     * Checks if there is more than one linguistic language element.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkUniqueLinguisticLanguage(element: LinguisticLanguage, accept: ValidationAcceptor): void {
        const system = getContainerOfType(element, isSystem);

        if (!system) {
            return;
        }

        const linguisticRules = getLinguisticLanguages(system);

        if (linguisticRules.length > 1) {
            accept('error', 'Detected multiple linguistic language elements. Please use only one', {
                node: element,
                code: IssueCodes.INVALID_LINGUISTICLANGUAGE,
            });
        }
    }

    /**
     * Checks if a UseCase extends itself.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkUseCaseExtendsItself(element: UseCase, accept: ValidationAcceptor): void {
        if (!element.extends) {
            return;
        }

        element.extends.forEach((ucExtends) => {
            if (ucExtends.usecase.$refText === element.name) {
                accept('error', "UseCase '" + element.name + "' extends itself", {
                    node: element,
                    property: 'extends',
                    code: IssueCodes.BAD_UC_HIERARCHY,
                });
            }
        });
    }

    /**
     * Checks if vulnerability type and sub-types are consistent.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkVulnerabilityTypeSubType(element: Vulnerability, accept: ValidationAcceptor): void {
        if (!element.type || !element.subType) {
            return;
        }

        const type = isVulnerabilityTypeOriginal(element.type)
            ? (element.type as VulnerabilityTypeOriginal).type
            : (element.type as VulnerabilityTypeExtendedRef).type.$refText;

        const subType = isVulnerabilitySubTypeOriginal(element.subType)
            ? (element.subType as VulnerabilitySubTypeOriginal).type
            : (element.subType as VulnerabilitySubTypeExtendedRef).type.$refText;

        if (!subType.includes(type)) {
            accept('error', "Vulnerability '" + element.name + "' has inconsistent type and subType", {
                node: element,
                property: 'subType',
                code: IssueCodes.INVALID_SUBTYPE,
            });
        }
    }

    /**
     * Checks for synonyms in a RSL element name alias or description.
     *
     * @param glossaryTerms    Available glossary of terms.
     * @param element          RSL element being checked.
     * @param input            Input to check.
     * @param elementAttribute RSL element attribute.
     * @param accept           The validation acceptor function to handle validation issues.
     */
    private checkSynonyms(
        glossaryTerms: GlossaryTerm[],
        element: AstNode,
        input: string | undefined,
        elementAttribute: string,
        accept: ValidationAcceptor
    ) {
        if (!input) {
            return;
        }

        const inputToCheck = input.toLowerCase();

        for (let term of glossaryTerms) {
            if (!term.nameAlias || !isGlossaryTermApplicableTo(term, element as SystemConcept)) {
                continue;
            }

            for (let synonym of term.synonyms) {
                if (!synonym) {
                    continue;
                }

                if (inputToCheck.includes(synonym.toLowerCase())) {
                    accept('warning', `Replace the word '${synonym}' by the main word '${term.nameAlias}'`, {
                        node: element,
                        property: elementAttribute,
                        code: IssueCodes.INCONSISTENT_TERM,
                        data: [synonym, term.nameAlias, input],
                    });
                    break;
                }
            }
        }
    }

    /**
     * Checks if `objectElementName` is a unique id within the same system.
     *
     * @param inputElementName  The ID to check.
     * @param element           The RSL element associated with the `inputElementName`.
     * @param system            The system object.
     * @param linguisticRules   The linguistic rules.
     * @param accept            The validation acceptor function to handle validation issues.
     */
    private checkUniqueElementId(inputElementName: string, element: AstNode, system: System, accept: ValidationAcceptor) {
        let foundDuplicate = false;

        for (let concept of system.systemConcepts) {
            if (concept as StructureElement) {
                let elementName = (concept as StructureElement).name;

                if (element !== concept && elementName === inputElementName) {
                    foundDuplicate = true;
                    break;
                }
            } else if (concept as BehaviorElement) {
                let elementName = (concept as BehaviorElement).name;

                if (element !== concept && elementName === inputElementName) {
                    foundDuplicate = true;
                    break;
                }
            } else if (concept as Requirement) {
                let elementName = (concept as Requirement).name;

                if (element !== concept && elementName === inputElementName) {
                    foundDuplicate = true;
                    break;
                }
            } else if (concept as OtherElement) {
                let elementName = (concept as OtherElement).name;

                if (element !== concept && elementName === inputElementName) {
                    foundDuplicate = true;
                    break;
                }
            } else if (concept as SystemRelation) {
                let elementName = (concept as SystemRelation).name;

                if (element !== concept && elementName === inputElementName) {
                    foundDuplicate = true;
                    break;
                }
            } else if (concept as SystemSet) {
                let elementName = (concept as SystemSet).name;

                if (element !== concept && elementName === inputElementName) {
                    foundDuplicate = true;
                    break;
                }
            } else if (concept as LinguisticElement) {
                let elementName = (concept as LinguisticElement).name;

                if (element !== concept && elementName === inputElementName) {
                    foundDuplicate = true;
                    break;
                }
            } else {
                throw new Error('Invalid type.');
            }
        }

        if (foundDuplicate) {
            accept('error', `The '${inputElementName} ID is already in use. Please use a different ID'`, {
                node: element,
                property: 'name',
                code: IssueCodes.INVALID_ID,
            });
        }
    }

    /**
     * Checks if a RSL element ID, name or description matches at least one of the given linguistic rules.
     *
     * @param rules            Linguistic rules defined.
     * @param element          RSL element being checked.
     * @param input            Input to check.
     * @param elementAttribute RSL element attribute which the input belongs to.
     * @param ruleProperty     Linguistic rule property.
     * @param languageType     The linguistic language of the specification document.
     * @param accept           The validation acceptor function to handle validation issues.
     */
    private checkLinguisticRules(
        rules: LinguisticRule[],
        element: AstNode,
        input: string | undefined,
        elementAttribute: string,
        ruleProperty: LinguisticRuleElementProperty,
        languageType: LinguisticLanguageType,
        accept: ValidationAcceptor
    ) {
        if (!input) {
            return;
        }

        const rslElementName = element.$type;

        for (let rule of rules) {
            const patterns = rule.pattern;

            if (
                !patterns ||
                rule.property.property !== ruleProperty ||
                getStereotypeType(rule.property.element.element) !== rslElementName
            ) {
                continue;
            }

            let errorMessage = this.getWrongPatternErrorMessage(patterns);

            if (ruleProperty === 'id') {
                let charIterator = 0;
                for (let pattern of patterns) {
                    let checkLinguisticPattern = this.checkElementIdLinguisticPattern(
                        element,
                        pattern,
                        input,
                        charIterator,
                        elementAttribute,
                        errorMessage,
                        rule.severity,
                        languageType,
                        accept
                    );

                    if (!checkLinguisticPattern.result) {
                        return;
                    }
                }
                return;
            }

            let tokens = this.nlpHelper.getTokens(languageType, input);

            if (tokens.length === 0) {
                this.displayValidationError(
                    element,
                    rule.severity,
                    errorMessage,
                    elementAttribute,
                    IssueCodes.LINGUISTIC_RULE,
                    accept,
                    input
                );
                return;
            }

            let j = 0;
            for (let pattern of patterns) {
                let token = tokens[j];

                if (!token) {
                    this.displayValidationError(
                        element,
                        rule.severity,
                        errorMessage,
                        elementAttribute,
                        IssueCodes.LINGUISTIC_RULE,
                        accept,
                        input
                    );
                    return;
                }

                let checkLinguisticPattern = this.checkLinguisticPattern(
                    element,
                    pattern,
                    tokens,
                    j,
                    input,
                    elementAttribute,
                    errorMessage,
                    rule.severity,
                    languageType,
                    accept
                );

                if (!checkLinguisticPattern.result) {
                    return;
                }

                j = checkLinguisticPattern.tokenIteratorCount;
                j++;
            }

            if (j < tokens.length) {
                let { wrongText, correctText } = this.getExcessTextToRemove(j, tokens, input);
                this.displayValidationError(
                    element,
                    rule.severity,
                    errorMessage,
                    elementAttribute,
                    IssueCodes.REMOVE_EXCESS_TEXT,
                    accept,
                    input,
                    wrongText,
                    correctText
                );
                return;
            }
        }
    }

    private getExcessTextToRemove(tokenIteratorCount: number, tokens: NlpToken[], input: string) {
        let correctText = '';
        for (let w = 0; w < tokenIteratorCount; w++) {
            if (w === 0) {
                correctText += tokens[w].originalText;
            } else {
                correctText += ' ' + tokens[w].originalText;
            }
        }

        let wrongText = input.replace(correctText, '');

        return { wrongText, correctText };
    }

    /**
     * Verifies if a linguistic pattern for an element Id is valid.
     *
     * @param element           Element being verified.
     * @param pattern           Linguistic pattern.
     * @param input             String being verified.
     * @param characterIterator Character iterator count.
     * @param elementAttribute  RSL element attribute.
     * @param errorMessage      Message to display in case of error.
     * @param severityLevel     Rule severity level.
     * @param languageType      The language associated with the input.
     * @param accept            The validation acceptor function to handle validation issues.
     * @return An object containing the result of the validation and the updated character iterator count.
     */
    checkElementIdLinguisticPattern(
        element: AstNode,
        pattern: LinguisticPattern,
        input: string,
        characterIterator: number,
        elementAttribute: string,
        errorMessage: string,
        severityLevel: LinguisticRuleSeverityLevel,
        languageType: LinguisticLanguageType,
        accept: ValidationAcceptor
    ) {
        let originalText = input.substring(characterIterator, input.length);
        if (!originalText) {
            this.displayValidationError(element, severityLevel, errorMessage, elementAttribute, IssueCodes.LINGUISTIC_RULE, accept, input);
            return { result: false, charIteratorCount: characterIterator };
        }

        let expectedPartOfSpeech = new Set<string>();
        let expectedWords = new Set<string>();
        let expectedElementsAndProperties: LinguisticRuleElementAndProperty[] = [];
        let linguisticFragmentHelpers: LinguisticFragmentPartHelper[] = [];
        let possibleCharIterators = new Set<number>();

        for (let fragmentPart of pattern.parts) {
            if (isLinguisticFragmentRef(fragmentPart)) {
                let linguisticOption = (fragmentPart as LinguisticFragmentRef).option.ref;

                if (!linguisticOption) {
                    continue;
                }

                for (let option of linguisticOption.options) {
                    let linguisticFragmentHelper = new LinguisticFragmentPartHelper(
                        languageType,
                        element,
                        this.nlpHelper,
                        option,
                        undefined,
                        undefined
                    );

                    if (!linguisticFragmentHelpers.find((x) => x.optionType === OptionType.PartOfSpeech)) {
                        linguisticFragmentHelpers.push(linguisticFragmentHelper);
                    }

                    let result = linguisticFragmentHelper.getMatchingText(originalText);

                    if (!result) {
                        possibleCharIterators.add(result.length);
                    }
                }
            } else {
                let patternOptionHelper = new LinguisticFragmentPartHelper(
                    languageType,
                    element,
                    this.nlpHelper,
                    fragmentPart,
                    undefined,
                    undefined
                );

                let result = patternOptionHelper.getMatchingText(originalText);

                if (patternOptionHelper.optionType === OptionType.PartOfSpeech) {
                    expectedPartOfSpeech.add(patternOptionHelper.expectedOption as string);
                } else if (patternOptionHelper.optionType === OptionType.Word) {
                    expectedWords.add(patternOptionHelper.expectedOption as string);
                } else if (patternOptionHelper.optionType === OptionType.ElementAndProperty) {
                    expectedElementsAndProperties.push(patternOptionHelper.expectedRuleElementProperty as LinguisticRuleElementAndProperty);
                } else {
                    // nothing to do
                }

                if (!result) {
                    possibleCharIterators.add(result.length);
                }
            }
        }

        if (possibleCharIterators.size > 0) {
            characterIterator += Math.min(...Array.from(possibleCharIterators.values()));
            return { result: true, charIteratorCount: characterIterator };
        }

        if (characterIterator > input.length) {
            this.displayValidationError(
                element,
                severityLevel,
                errorMessage,
                elementAttribute,
                IssueCodes.LINGUISTIC_RULE,
                accept,
                originalText
            );
            return { result: false, charIteratorCount: characterIterator };
        }

        let additionalInfo = this.getDetailedErrorInfo(
            originalText,
            expectedPartOfSpeech,
            expectedWords,
            expectedElementsAndProperties,
            linguisticFragmentHelpers
        );

        errorMessage += additionalInfo;

        if (expectedWords.size === 0 && expectedElementsAndProperties.length === 0 && linguisticFragmentHelpers.length === 0) {
            this.displayValidationError(
                element,
                severityLevel,
                errorMessage,
                elementAttribute,
                IssueCodes.LINGUISTIC_RULE,
                accept,
                originalText
            );
            return { result: false, tokenIteratorCount: characterIterator };
        }

        for (let expectedWord of expectedWords) {
            // Issue Data follows the convention "{wrongWord, correctWord}" to be recognized by a quick fix handler
            this.displayValidationError(
                element,
                severityLevel,
                errorMessage,
                elementAttribute,
                IssueCodes.REPLACE_WORD,
                accept,
                originalText,
                expectedWord,
                input
            );
        }

        for (let patternOptionHelper of linguisticFragmentHelpers) {
            let expectedOption = patternOptionHelper.expectedOption as string;

            // Issue Data follows the convention "{wrongWord, correctWord}" to be recognized by a quick fix handler
            if (patternOptionHelper.optionType === OptionType.Word) {
                this.displayValidationError(
                    element,
                    severityLevel,
                    errorMessage,
                    elementAttribute,
                    IssueCodes.REPLACE_WORD,
                    accept,
                    originalText,
                    expectedOption,
                    input
                );
            } else if (patternOptionHelper.optionType === OptionType.ElementAndProperty) {
                this.displayValidationError(
                    element,
                    severityLevel,
                    errorMessage,
                    elementAttribute,
                    IssueCodes.SELECT_ELEMENT,
                    accept,
                    originalText,
                    expectedOption,
                    (patternOptionHelper.expectedRuleElementProperty as LinguisticRuleElementAndProperty).toString()
                );
            } else if (patternOptionHelper.optionType === OptionType.PartOfSpeech) {
                this.displayValidationError(
                    element,
                    severityLevel,
                    errorMessage,
                    elementAttribute,
                    IssueCodes.LINGUISTIC_RULE,
                    accept,
                    originalText,
                    expectedOption
                );
            } else {
                throw new Error(`${patternOptionHelper.optionType} is not supported`);
            }
        }

        for (let elementAndProperty of expectedElementsAndProperties) {
            // Issue Data follows the convention "{wrongWord, correctWord}" to be recognized by a quick fix handler
            this.displayValidationError(
                element,
                severityLevel,
                errorMessage,
                elementAttribute,
                IssueCodes.CREATE_ELEMENT,
                accept,
                originalText,
                getStereotypeType(elementAndProperty.element.element),
                elementAndProperty.property
            );
        }

        return { result: false, charIteratorCount: characterIterator };
    }

    /**
     * Verifies if a linguistic pattern is valid.
     *
     * @param element            Element being verified.
     * @param pattern            Linguistic pattern.
     * @param tokens             NLP tokens.
     * @param tokenIteratorCount Token iterator count.
     * @param input              String being verified.
     * @param elementAttribute   RSL element attribute.
     * @param errorMessage       Message to display in case of error.
     * @param severityLevel      Rule severity level.
     * @param languageType       The language associated with the input.
     * @param accept             The validation acceptor function to handle validation issues.
     * @return An object containing the result of the validation and the updated token iterator count.
     */
    checkLinguisticPattern(
        element: AstNode,
        pattern: LinguisticPattern,
        tokens: NlpToken[],
        tokenIteratorCount: number,
        input: string,
        elementAttribute: string,
        errorMessage: string,
        severityLevel: LinguisticRuleSeverityLevel,
        languageType: LinguisticLanguageType,
        accept: ValidationAcceptor
    ) {
        let originalText = tokens[tokenIteratorCount].originalText;
        let expectedPartOfSpeech = new Set<string>();
        let expectedWords = new Set<string>();
        let expectedElementsAndProperties: LinguisticRuleElementAndProperty[] = [];
        let linguisticFragmentHelpers: LinguisticFragmentPartHelper[] = [];

        for (let fragmentPart of pattern.parts) {
            if (isLinguisticFragmentRef(fragmentPart)) {
                let linguisticOption = (fragmentPart as LinguisticFragmentRef).option.ref;

                if (!linguisticOption) {
                    continue;
                }

                for (let option of linguisticOption.options) {
                    let patternOptionHelper = new LinguisticFragmentPartHelper(
                        languageType,
                        element,
                        this.nlpHelper,
                        option,
                        tokens,
                        tokenIteratorCount
                    );

                    if (!linguisticFragmentHelpers.find((x) => x.optionType === OptionType.PartOfSpeech)) {
                        linguisticFragmentHelpers.push(patternOptionHelper);
                    }

                    let validateInput = patternOptionHelper.validateInput();

                    originalText = tokens[validateInput.tokenIteratorCount].originalText;

                    if (validateInput.result) {
                        return validateInput;
                    }
                }
            } else {
                let patternOptionHelper = new LinguisticFragmentPartHelper(
                    languageType,
                    element,
                    this.nlpHelper,
                    fragmentPart,
                    tokens,
                    tokenIteratorCount
                );

                let validateInput = patternOptionHelper.validateInput();

                if (patternOptionHelper.optionType === OptionType.PartOfSpeech) {
                    expectedPartOfSpeech.add(patternOptionHelper.expectedOption as string);
                } else if (patternOptionHelper.optionType === OptionType.Word) {
                    expectedWords.add(patternOptionHelper.expectedOption as string);
                } else if (patternOptionHelper.optionType === OptionType.ElementAndProperty) {
                    expectedElementsAndProperties.push(patternOptionHelper.expectedRuleElementProperty as LinguisticRuleElementAndProperty);
                } else {
                    // nothing to do
                }

                originalText = tokens[validateInput.tokenIteratorCount].originalText;

                if (validateInput.result) {
                    return validateInput;
                }
            }
        }

        let additionalInfo = this.getDetailedErrorInfo(
            originalText,
            expectedPartOfSpeech,
            expectedWords,
            expectedElementsAndProperties,
            linguisticFragmentHelpers
        );

        errorMessage += additionalInfo;

        if (expectedWords.size === 0 && expectedElementsAndProperties.length === 0 && linguisticFragmentHelpers.length === 0) {
            this.displayValidationError(
                element,
                severityLevel,
                errorMessage,
                elementAttribute,
                IssueCodes.LINGUISTIC_RULE,
                accept,
                originalText
            );
            return { result: false, tokenIteratorCount: tokenIteratorCount };
        }

        for (let expectedWord of expectedWords) {
            // Issue Data follows the convention "{wrongWord, correctWord}" to be recognized by a quick fix handler
            this.displayValidationError(
                element,
                severityLevel,
                errorMessage,
                elementAttribute,
                IssueCodes.REPLACE_WORD,
                accept,
                originalText,
                expectedWord,
                input
            );
        }

        for (let patternOptionHelper of linguisticFragmentHelpers) {
            let expectedOption = patternOptionHelper.expectedOption as string;

            // Issue Data follows the convention "{wrongWord, correctWord}" to be recognized by a quick fix handler
            if (patternOptionHelper.optionType === OptionType.Word) {
                this.displayValidationError(
                    element,
                    severityLevel,
                    errorMessage,
                    elementAttribute,
                    IssueCodes.REPLACE_WORD,
                    accept,
                    originalText,
                    expectedOption,
                    input
                );
            } else if (patternOptionHelper.optionType === OptionType.ElementAndProperty) {
                this.displayValidationError(
                    element,
                    severityLevel,
                    errorMessage,
                    elementAttribute,
                    IssueCodes.SELECT_ELEMENT,
                    accept,
                    originalText,
                    expectedOption,
                    (patternOptionHelper.expectedRuleElementProperty as LinguisticRuleElementAndProperty).toString()
                );
            } else if (patternOptionHelper.optionType === OptionType.PartOfSpeech) {
                this.displayValidationError(
                    element,
                    severityLevel,
                    errorMessage,
                    elementAttribute,
                    IssueCodes.LINGUISTIC_RULE,
                    accept,
                    originalText,
                    expectedOption
                );
            } else {
                throw new Error(`${patternOptionHelper.optionType} is not supported`);
            }
        }

        for (let elementAndProperty of expectedElementsAndProperties) {
            // Issue Data follows the convention "{wrongWord, correctWord}" to be recognized by a quick fix handler
            this.displayValidationError(
                element,
                severityLevel,
                errorMessage,
                elementAttribute,
                IssueCodes.CREATE_ELEMENT,
                accept,
                originalText,
                getStereotypeType(elementAndProperty.element.element),
                elementAndProperty.property
            );
        }

        return { result: false, tokenIteratorCount: tokenIteratorCount };
    }

    /**
     * Gets a detailed explanation for a given error.
     *
     * @param originalText                  Text that doesn't match a given
     *                                      linguistic fragment part.
     * @param expectedPartOfSpeech          Expected part of speech.
     * @param expectedWords                 Expected words.
     * @param expectedElementsAndProperties Expected linguistic rule elements.
     * @param linguisticFragmentHelpers     Expected linguistic fragment part helpers.
     * @return Detailed error information.
     */
    getDetailedErrorInfo(
        originalText: string,
        expectedPartOfSpeech: Set<string>,
        expectedWords: Set<string>,
        expectedElementsAndProperties: LinguisticRuleElementAndProperty[],
        linguisticFragmentHelpers: LinguisticFragmentPartHelper[]
    ): string {
        let expectedPartOfSpeechesList: string[] = [];
        expectedPartOfSpeech.forEach((x) => expectedPartOfSpeechesList.push(x));

        let additionalInfo = `"${EOL}The word '${originalText}' is expected to`;

        for (let i = 0; i < expectedPartOfSpeechesList.length; i++) {
            let expectedPosTag = expectedPartOfSpeechesList[i];
            if (i === 0) {
                additionalInfo += ` be categorized as '${expectedPosTag}'`;
            } else {
                additionalInfo += ` or '${expectedPosTag}'`;
            }
        }

        let expectedWordsList: string[] = [];
        expectedWords.forEach((x) => expectedWordsList.push(x));

        for (let i = 0; i < expectedWordsList.length; i++) {
            let expectedWord = expectedWordsList[i];
            if (i === 0 && expectedPartOfSpeech.size > 0) {
                additionalInfo += ` or the word '${expectedWord}'`;
            } else if (i === 0) {
                additionalInfo += ` be the word '${expectedWord}'`;
            } else {
                additionalInfo += ` or '${expectedWord}'`;
            }
        }

        for (let i = 0; i < expectedElementsAndProperties.length; i++) {
            let linguisticRuleElementAndProperty = expectedElementsAndProperties[i];
            let property = linguisticRuleElementAndProperty.property.toString().toLowerCase();
            let element = getStereotypeType(linguisticRuleElementAndProperty.element.element);
            if (i === 0 && (expectedPartOfSpeech.size > 0 || expectedWords.size > 0)) {
                additionalInfo += ` or the '${property} of a/an '${element}'`;
            } else if (i === 0) {
                additionalInfo += ` be the '${property} of a/an '${element}'`;
            } else {
                additionalInfo += ` or '${element}'`;
            }
        }

        for (let i = 0; i < linguisticFragmentHelpers.length; i++) {
            let linguisticFragmentPartHelper = linguisticFragmentHelpers[i];
            if ((i === 0 && (expectedPartOfSpeech.size > 0 || expectedWords.size > 0)) || expectedElementsAndProperties.length > 0) {
                additionalInfo += ` or one of the following fragment: '${linguisticFragmentPartHelper.expectedOption}'`;
            } else if (i === 0) {
                additionalInfo += ` to be one of the following fragments: '${linguisticFragmentPartHelper.expectedOption}'`;
            } else {
                additionalInfo += ` ,'${linguisticFragmentPartHelper.expectedOption}'`;
            }
        }
        return additionalInfo;
    }

    /**
     * Displays a validation error.
     *
     * @param severity         Linguistic rule severity level.
     * @param errorMessage     Error message to display.
     * @param elementAttribute Element attribute.
     * @param issueCode        Issue code.
     * @param accept           The validation acceptor function to handle validation issues.
     * @param issueData        Issue data.
     */
    displayValidationError(
        element: AstNode,
        severity: LinguisticRuleSeverityLevel,
        errorMessage: string,
        elementAttribute: string,
        issueCode: string,
        accept: ValidationAcceptor,
        ...issueData: string[]
    ) {
        switch (severity) {
            case 'Error':
                accept('error', errorMessage, { node: element, property: elementAttribute, code: issueCode, data: issueData });
                break;

            case 'Warning':
                accept('warning', errorMessage, { node: element, property: elementAttribute, code: issueCode, data: issueData });
                break;

            default:
                throw new Error(`${severity} is not supported`);
        }
    }

    /**
     * Gets error message to display for a given pattern.
     *
     * @param patterns Pattern that didn't match.
     * @return Error message.
     */
    private getWrongPatternErrorMessage(patterns: LinguisticPattern[]): string {
        let errorMessage = "This text must follow the pattern '";

        for (let i = 0; i < patterns.length; i++) {
            let patternPart = patterns[i];
            if (i > 0) {
                errorMessage += ' + ';
            }

            errorMessage += '(';
            let parts = patternPart.parts;
            for (let j = 0; j < parts.length; j++) {
                let patternOption = parts[j];

                if (j > 0) {
                    errorMessage += '|';
                }

                if (patternOption.$type === 'PartOfSpeech') {
                    let posTag = patternOption as PartOfSpeech;
                    errorMessage += posTag.posTag;
                } else if (patternOption.$type === 'Word') {
                    let word = patternOption as Word;
                    errorMessage += word.word;
                } else if (patternOption.$type === 'LinguisticRuleElementAndProperty') {
                    let element = patternOption as LinguisticRuleElementAndProperty;
                    errorMessage += getStereotypeType(element.element.element) + '.' + element.property;
                } else if (patternOption.$type === 'LinguisticFragmentRef') {
                    let linguisticOption = (patternOption as LinguisticFragmentRef).option;
                    errorMessage += linguisticOption.ref?.name;
                } else {
                    errorMessage += '';
                }
            }
            errorMessage += ')';
        }

        return errorMessage;
    }
}
