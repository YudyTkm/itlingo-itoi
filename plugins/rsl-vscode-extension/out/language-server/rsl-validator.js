"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RslValidator = exports.IssueCodes = exports.registerValidationChecks = void 0;
const langium_1 = require("langium");
const ast_1 = require("./generated/ast");
const linguisticFragmentPartHelper_1 = require("../validation/linguisticFragmentPartHelper");
const rsl_utilities_1 = require("../util/rsl-utilities");
const nlpHelper_1 = require("../validation/nlpHelper");
/**
 * Register custom validation checks.
 */
function registerValidationChecks(services) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.RslValidator;
    const checks = {
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
exports.registerValidationChecks = registerValidationChecks;
var IssueCodes;
(function (IssueCodes) {
    IssueCodes.ISSUE_CODE_PREFIX = 'org.itlingo.rsl.';
    IssueCodes.CREATE_ELEMENT = IssueCodes.ISSUE_CODE_PREFIX + 'CreateElement';
    IssueCodes.LINGUISTIC_RULE = IssueCodes.ISSUE_CODE_PREFIX + 'LinguisticRule';
    IssueCodes.SELECT_ELEMENT = IssueCodes.ISSUE_CODE_PREFIX + 'SelectElement';
    IssueCodes.REPLACE_WORD = IssueCodes.ISSUE_CODE_PREFIX + 'Replace';
    IssueCodes.INVALID_NAME = IssueCodes.ISSUE_CODE_PREFIX + 'InvalidName';
    IssueCodes.INVALID_ID = IssueCodes.ISSUE_CODE_PREFIX + 'InvalidID';
    IssueCodes.INCONSISTENT_TERM = IssueCodes.ISSUE_CODE_PREFIX + 'InconsistentTerm';
    IssueCodes.REMOVE_EXCESS_TEXT = IssueCodes.ISSUE_CODE_PREFIX + 'RemoveExcessText';
    /* Hierarchy cycle error codes */
    IssueCodes.STEP_NEXT_HIERARCHY_CYCLE = IssueCodes.ISSUE_CODE_PREFIX + 'StepNextHierarchyCycle';
    IssueCodes.PARTOF_HIERARCHY_CYCLE = IssueCodes.ISSUE_CODE_PREFIX + 'PartOfHierarchyCycle';
    IssueCodes.ISA_HIERARCHY_CYCLE = IssueCodes.ISSUE_CODE_PREFIX + 'IsAHierarchyCycle';
    /* Bad Hierarchy error codes */
    IssueCodes.BAD_UC_HIERARCHY = IssueCodes.ISSUE_CODE_PREFIX + 'BadUCHierarchy';
    /* */
    IssueCodes.SM_INIT_FINAL_STATES = IssueCodes.ISSUE_CODE_PREFIX + 'SMStates';
    IssueCodes.SYS_RELATION_CYCLE = IssueCodes.ISSUE_CODE_PREFIX + 'SysRelCycle';
    IssueCodes.RELATION_CYCLE = IssueCodes.ISSUE_CODE_PREFIX + 'RelCycle';
    /* Invalid types error codes */
    IssueCodes.INVALID_SUBTYPE = IssueCodes.ISSUE_CODE_PREFIX + 'invalidSubType';
    /* Inconsistent element fragments error codes */
    IssueCodes.INVALID_AT_PARTICIPANTTARGET = IssueCodes.ISSUE_CODE_PREFIX + 'invalidATParticipantTarget';
    IssueCodes.INVALID_AF_CONDITION = IssueCodes.ISSUE_CODE_PREFIX + 'invalidAFCondition';
    IssueCodes.INVALID_LINGUISTICLANGUAGE = IssueCodes.ISSUE_CODE_PREFIX + 'LinguisticLanguage';
    IssueCodes.INCLUDE_ELEMENT = IssueCodes.ISSUE_CODE_PREFIX + 'IncludeElement';
    IssueCodes.INCLUDE_ALL = IssueCodes.ISSUE_CODE_PREFIX + 'IncludeAll';
})(IssueCodes = exports.IssueCodes || (exports.IssueCodes = {}));
/**
 * Implementation of custom validations.
 */
class RslValidator {
    constructor() {
        this.nlpHelper = new nlpHelper_1.NlpHelper();
    }
    /**
     * Checks if ActiveFlow type condition is consistent.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkActiveFlowCondition(element, accept) {
        if (!element.condition || !element.type) {
            return;
        }
        const type = (0, ast_1.isActiveFlowTypeOriginal)(element.type)
            ? element.type.type
            : element.type.type.$refText;
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
    checkActiveTaskParticipantTarget(element, accept) {
        if (!element.participantTarget || !element.type) {
            return;
        }
        const type = (0, ast_1.isActiveTaskTypeOriginal)(element.type)
            ? element.type.type
            : element.type.type.$refText;
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
    checkBehaviorElement(element, accept) {
        const system = (0, langium_1.getContainerOfType)(element, ast_1.isSystem);
        if (!system) {
            return;
        }
        const linguisticRules = (0, rsl_utilities_1.getLinguisticRules)(system);
        const linguisticLanguage = (0, rsl_utilities_1.getLinguisticLanguageType)(system);
        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);
        const glossaryTerms = (0, rsl_utilities_1.getGlossaryTerms)(system);
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
    checkConstraintTypeSubType(element, accept) {
        if (!element.type || !element.subType) {
            return;
        }
        const type = (0, ast_1.isConstraintTypeOriginal)(element.type)
            ? element.type.type
            : element.type.type.$refText;
        const subType = (0, ast_1.isConstraintSubTypeOriginal)(element.subType)
            ? element.subType.type
            : element.subType.type.$refText;
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
    checkDataAttributeElement(element, accept) {
        const system = (0, langium_1.getContainerOfType)(element, ast_1.isSystem);
        if (!system) {
            return;
        }
        const linguisticRules = (0, rsl_utilities_1.getLinguisticRules)(system);
        const linguisticLanguage = (0, rsl_utilities_1.getLinguisticLanguageType)(system);
        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);
        const glossaryTerms = (0, rsl_utilities_1.getGlossaryTerms)(system);
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
    checkGoalTypeSubType(element, accept) {
        if (!element.type || !element.subType) {
            return;
        }
        const type = (0, ast_1.isGoalTypeOriginal)(element.type)
            ? element.type.type
            : element.type.type.$refText;
        const subType = (0, ast_1.isGoalSubTypeOriginal)(element.subType)
            ? element.subType.type
            : element.subType.type.$refText;
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
    checkIncludeAll(element, accept) {
        var _a, _b;
        if (!element.system) {
            return;
        }
        const system = element.system.ref;
        if (!(system === null || system === void 0 ? void 0 : system.systemConcepts)) {
            return;
        }
        const systemName = system.name;
        let newElementsText = '';
        for (let concept of system.systemConcepts) {
            if (!((_a = concept.$cstNode) === null || _a === void 0 ? void 0 : _a.text)) {
                continue;
            }
            newElementsText += `${langium_1.EOL}${(_b = concept.$cstNode) === null || _b === void 0 ? void 0 : _b.text}${langium_1.EOL}`;
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
    checkIncludeElement(element, accept) {
        var _a, _b;
        if (!element.element || !element.type) {
            return;
        }
        const elementType = element.type.type;
        let newElement = element.element.ref;
        if (!newElement) {
            return;
        }
        let newElementText = '';
        if ((_a = newElement.$cstNode) === null || _a === void 0 ? void 0 : _a.text) {
            newElementText = (_b = newElement.$cstNode) === null || _b === void 0 ? void 0 : _b.text;
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
    checkLinguisticFragment(element, accept) {
        const system = (0, langium_1.getContainerOfType)(element, ast_1.isSystem);
        if (!system) {
            return;
        }
        const linguisticRules = (0, rsl_utilities_1.getLinguisticRules)(system);
        const linguisticLanguage = (0, rsl_utilities_1.getLinguisticLanguageType)(system);
        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);
        const glossaryTerms = (0, rsl_utilities_1.getGlossaryTerms)(system);
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
    checkLinguisticRule(element, accept) {
        const system = (0, langium_1.getContainerOfType)(element, ast_1.isSystem);
        if (!system) {
            return;
        }
        const linguisticRules = (0, rsl_utilities_1.getLinguisticRules)(system);
        const linguisticLanguage = (0, rsl_utilities_1.getLinguisticLanguageType)(system);
        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);
        const glossaryTerms = (0, rsl_utilities_1.getGlossaryTerms)(system);
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
    checkMainScenario(element, accept) {
        const system = (0, langium_1.getContainerOfType)(element, ast_1.isSystem);
        if (!system) {
            return;
        }
        const linguisticRules = (0, rsl_utilities_1.getLinguisticRules)(system);
        const linguisticLanguage = (0, rsl_utilities_1.getLinguisticLanguageType)(system);
        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);
        const glossaryTerms = (0, rsl_utilities_1.getGlossaryTerms)(system);
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
    checkNoCycleInActiveTaskPartOfHierarchy(element, accept) {
        var _a, _b, _c, _d, _e;
        let partOfElement = element.partOf;
        if (!partOfElement) {
            return;
        }
        if (((_a = partOfElement.ref) === null || _a === void 0 ? void 0 : _a.name) === element.name) {
            accept('error', "Constraint '" + element.name + "' is part of itself", {
                node: element,
                property: 'partOf',
                code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
            });
            return;
        }
        let visitedElements = new Set();
        visitedElements.add(element.name);
        while (partOfElement) {
            if (!((_b = partOfElement.ref) === null || _b === void 0 ? void 0 : _b.name)) {
                break;
            }
            if (visitedElements.has((_c = partOfElement.ref) === null || _c === void 0 ? void 0 : _c.name)) {
                accept('error', "Cycle in hierarchy of Constraint '" + element.name + "'", {
                    node: element,
                    property: 'partOf',
                    code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
                });
                break;
            }
            visitedElements.add((_d = partOfElement.ref) === null || _d === void 0 ? void 0 : _d.name);
            partOfElement = (_e = partOfElement.ref) === null || _e === void 0 ? void 0 : _e.partOf;
        }
    }
    /**
     * Checks if the actor element has a cycle in its 'is-a' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInActorIsAHierarchy(element, accept) {
        var _a, _b, _c, _d, _e;
        let superElement = element.super;
        if (!superElement) {
            return;
        }
        if (((_a = superElement.ref) === null || _a === void 0 ? void 0 : _a.name) === element.name) {
            accept('error', "Actor '" + element.name + "' extends itself", {
                node: element,
                property: 'super',
                code: IssueCodes.ISA_HIERARCHY_CYCLE,
            });
            return;
        }
        let visitedElements = new Set();
        visitedElements.add(element.name);
        while (superElement) {
            if (!((_b = superElement.ref) === null || _b === void 0 ? void 0 : _b.name)) {
                break;
            }
            if (visitedElements.has((_c = superElement.ref) === null || _c === void 0 ? void 0 : _c.name)) {
                accept('error', "Cycle in hierarchy of Actor '" + element.name + "'", {
                    node: element,
                    property: 'super',
                    code: IssueCodes.ISA_HIERARCHY_CYCLE,
                });
                break;
            }
            visitedElements.add((_d = superElement.ref) === null || _d === void 0 ? void 0 : _d.name);
            superElement = (_e = superElement.ref) === null || _e === void 0 ? void 0 : _e.super;
        }
    }
    /**
     * Checks if the constraint element has a cycle in its part-of relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInConstraintPartOfHierarchy(element, accept) {
        var _a, _b, _c, _d, _e;
        let partOfElement = element.partOf;
        if (!partOfElement) {
            return;
        }
        if (((_a = partOfElement.ref) === null || _a === void 0 ? void 0 : _a.name) === element.name) {
            accept('error', "Constraint '" + element.name + "' is part of itself", {
                node: element,
                property: 'partOf',
                code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
            });
            return;
        }
        let visitedElements = new Set();
        visitedElements.add(element.name);
        while (partOfElement) {
            if (!((_b = partOfElement.ref) === null || _b === void 0 ? void 0 : _b.name)) {
                break;
            }
            if (visitedElements.has((_c = partOfElement.ref) === null || _c === void 0 ? void 0 : _c.name)) {
                accept('error', "Cycle in hierarchy of Constraint '" + element.name + "'", {
                    node: element,
                    property: 'partOf',
                    code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
                });
                break;
            }
            visitedElements.add((_d = partOfElement.ref) === null || _d === void 0 ? void 0 : _d.name);
            partOfElement = (_e = partOfElement.ref) === null || _e === void 0 ? void 0 : _e.partOf;
        }
    }
    /**
     * Checks if the data entity element has a cycle in its 'is-a' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInDataEntityIsAHierarchy(element, accept) {
        var _a, _b, _c, _d, _e;
        let superElement = element.super;
        if (!superElement) {
            return;
        }
        if (((_a = superElement.ref) === null || _a === void 0 ? void 0 : _a.name) === element.name) {
            accept('error', "DataEntity '" + element.name + "' extends itself", {
                node: element,
                property: 'super',
                code: IssueCodes.ISA_HIERARCHY_CYCLE,
            });
            return;
        }
        let visitedElements = new Set();
        visitedElements.add(element.name);
        while (superElement) {
            if (!((_b = superElement.ref) === null || _b === void 0 ? void 0 : _b.name)) {
                break;
            }
            if (visitedElements.has((_c = superElement.ref) === null || _c === void 0 ? void 0 : _c.name)) {
                accept('error', "Cycle in hierarchy of DataEntity '" + element.name + "'", {
                    node: element,
                    property: 'super',
                    code: IssueCodes.ISA_HIERARCHY_CYCLE,
                });
                break;
            }
            visitedElements.add((_d = superElement.ref) === null || _d === void 0 ? void 0 : _d.name);
            superElement = (_e = superElement.ref) === null || _e === void 0 ? void 0 : _e.super;
        }
    }
    /**
     * Checks if the FR element has a cycle in its 'part-of' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInFRPartOfHierarchy(element, accept) {
        var _a, _b, _c, _d, _e;
        let partOfElement = element.partOf;
        if (!partOfElement) {
            return;
        }
        if (((_a = partOfElement.ref) === null || _a === void 0 ? void 0 : _a.name) === element.name) {
            accept('error', "FR '" + element.name + "' is part of itself", {
                node: element,
                property: 'partOf',
                code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
            });
            return;
        }
        let visitedElements = new Set();
        visitedElements.add(element.name);
        while (partOfElement) {
            if (!((_b = partOfElement.ref) === null || _b === void 0 ? void 0 : _b.name)) {
                break;
            }
            if (visitedElements.has((_c = partOfElement.ref) === null || _c === void 0 ? void 0 : _c.name)) {
                accept('error', "Cycle in hierarchy of FR '" + element.name + "'", {
                    node: element,
                    property: 'partOf',
                    code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
                });
                break;
            }
            visitedElements.add((_d = partOfElement.ref) === null || _d === void 0 ? void 0 : _d.name);
            partOfElement = (_e = partOfElement.ref) === null || _e === void 0 ? void 0 : _e.partOf;
        }
    }
    /**
     * Checks if the glossary term element has a cycle in its 'is-a' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInGlossaryTermIsAHierarchy(element, accept) {
        var _a, _b, _c, _d, _e;
        let superElement = element.super;
        if (!superElement) {
            return;
        }
        if (((_a = superElement.ref) === null || _a === void 0 ? void 0 : _a.name) === element.name) {
            accept('error', "GlossaryTerm '" + element.name + "' extends itself", {
                node: element,
                property: 'super',
                code: IssueCodes.ISA_HIERARCHY_CYCLE,
            });
            return;
        }
        let visitedElements = new Set();
        visitedElements.add(element.name);
        while (superElement) {
            if (!((_b = superElement.ref) === null || _b === void 0 ? void 0 : _b.name)) {
                break;
            }
            if (visitedElements.has((_c = superElement.ref) === null || _c === void 0 ? void 0 : _c.name)) {
                accept('error', "Cycle in hierarchy of GlossaryTerm '" + element.name + "'", {
                    node: element,
                    property: 'super',
                    code: IssueCodes.ISA_HIERARCHY_CYCLE,
                });
                break;
            }
            visitedElements.add((_d = superElement.ref) === null || _d === void 0 ? void 0 : _d.name);
            superElement = (_e = superElement.ref) === null || _e === void 0 ? void 0 : _e.super;
        }
    }
    /**
     * Checks if the glossary term element has a cycle in its 'part-of' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInGlossaryTermPartOfHierarchy(element, accept) {
        var _a, _b, _c, _d, _e;
        let partOfElement = element.partOf;
        if (!partOfElement) {
            return;
        }
        if (((_a = partOfElement.ref) === null || _a === void 0 ? void 0 : _a.name) === element.name) {
            accept('error', "GlossaryTerm '" + element.name + "' is part of itself", {
                node: element,
                property: 'partOf',
                code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
            });
            return;
        }
        let visitedElements = new Set();
        visitedElements.add(element.name);
        while (partOfElement) {
            if (!((_b = partOfElement.ref) === null || _b === void 0 ? void 0 : _b.name)) {
                break;
            }
            if (visitedElements.has((_c = partOfElement.ref) === null || _c === void 0 ? void 0 : _c.name)) {
                accept('error', "Cycle in hierarchy of GlossaryTerm '" + element.name + "'", {
                    node: element,
                    property: 'partOf',
                    code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
                });
                break;
            }
            visitedElements.add((_d = partOfElement.ref) === null || _d === void 0 ? void 0 : _d.name);
            partOfElement = (_e = partOfElement.ref) === null || _e === void 0 ? void 0 : _e.partOf;
        }
    }
    /**
     * Checks if the goal element has a cycle in its 'part-of' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInGoalPartOfHierarchy(element, accept) {
        var _a, _b, _c, _d, _e;
        let partOfElement = element.partOf;
        if (!partOfElement) {
            return;
        }
        if (((_a = partOfElement.ref) === null || _a === void 0 ? void 0 : _a.name) === element.name) {
            accept('error', "Goal '" + element.name + "' is part of itself", {
                node: element,
                property: 'partOf',
                code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
            });
            return;
        }
        let visitedElements = new Set();
        visitedElements.add(element.name);
        while (partOfElement) {
            if (!((_b = partOfElement.ref) === null || _b === void 0 ? void 0 : _b.name)) {
                break;
            }
            if (visitedElements.has((_c = partOfElement.ref) === null || _c === void 0 ? void 0 : _c.name)) {
                accept('error', "Cycle in hierarchy of Goal '" + element.name + "'", {
                    node: element,
                    property: 'partOf',
                    code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
                });
                break;
            }
            visitedElements.add((_d = partOfElement.ref) === null || _d === void 0 ? void 0 : _d.name);
            partOfElement = (_e = partOfElement.ref) === null || _e === void 0 ? void 0 : _e.partOf;
        }
    }
    /**
     * Checks if the QR element has a cycle in its 'part-of' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInQRPartOfHierarchy(element, accept) {
        var _a, _b, _c, _d, _e;
        let partOfElement = element.partOf;
        if (!partOfElement) {
            return;
        }
        if (((_a = partOfElement.ref) === null || _a === void 0 ? void 0 : _a.name) === element.name) {
            accept('error', "QR '" + element.name + "' is part of itself", {
                node: element,
                property: 'partOf',
                code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
            });
            return;
        }
        let visitedElements = new Set();
        visitedElements.add(element.name);
        while (partOfElement) {
            if (!((_b = partOfElement.ref) === null || _b === void 0 ? void 0 : _b.name)) {
                break;
            }
            if (visitedElements.has((_c = partOfElement.ref) === null || _c === void 0 ? void 0 : _c.name)) {
                accept('error', "Cycle in hierarchy of QR '" + element.name + "'", {
                    node: element,
                    property: 'partOf',
                    code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
                });
                break;
            }
            visitedElements.add((_d = partOfElement.ref) === null || _d === void 0 ? void 0 : _d.name);
            partOfElement = (_e = partOfElement.ref) === null || _e === void 0 ? void 0 : _e.partOf;
        }
    }
    /**
     * Checks if the risk element has a cycle in its 'part-of' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInRiskPartOfHierarchy(element, accept) {
        var _a, _b, _c, _d, _e;
        let partOfElement = element.partOf;
        if (!element.name || !partOfElement) {
            return;
        }
        if (((_a = partOfElement.ref) === null || _a === void 0 ? void 0 : _a.name) === element.name) {
            accept('error', "Risk '" + element.name + "' is part of itself", {
                node: element,
                property: 'partOf',
                code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
            });
            return;
        }
        let visitedElements = new Set();
        visitedElements.add(element.name);
        while (partOfElement) {
            if (!((_b = partOfElement.ref) === null || _b === void 0 ? void 0 : _b.name)) {
                break;
            }
            if (visitedElements.has((_c = partOfElement.ref) === null || _c === void 0 ? void 0 : _c.name)) {
                accept('error', "Cycle in hierarchy of Risk '" + element.name + "'", {
                    node: element,
                    property: 'partOf',
                    code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
                });
                break;
            }
            visitedElements.add((_d = partOfElement.ref) === null || _d === void 0 ? void 0 : _d.name);
            partOfElement = (_e = partOfElement.ref) === null || _e === void 0 ? void 0 : _e.partOf;
        }
    }
    /**
     * Checks if the stakeholder element has a cycle in its 'is-a' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInStakeholderIsAHierarchy(element, accept) {
        var _a, _b, _c, _d, _e;
        let superElement = element.super;
        if (!superElement) {
            return;
        }
        if (((_a = superElement.ref) === null || _a === void 0 ? void 0 : _a.name) === element.name) {
            accept('error', "Stakeholder '" + element.name + "' extends itself", {
                node: element,
                property: 'super',
                code: IssueCodes.ISA_HIERARCHY_CYCLE,
            });
            return;
        }
        let visitedElements = new Set();
        visitedElements.add(element.name);
        while (superElement) {
            if (!((_b = superElement.ref) === null || _b === void 0 ? void 0 : _b.name)) {
                break;
            }
            if (visitedElements.has((_c = superElement.ref) === null || _c === void 0 ? void 0 : _c.name)) {
                accept('error', "Cycle in hierarchy of Stakeholder '" + element.name + "'", {
                    node: element,
                    property: 'super',
                    code: IssueCodes.ISA_HIERARCHY_CYCLE,
                });
                break;
            }
            visitedElements.add((_d = superElement.ref) === null || _d === void 0 ? void 0 : _d.name);
            superElement = (_e = superElement.ref) === null || _e === void 0 ? void 0 : _e.super;
        }
    }
    /**
     * Checks if the stakeholder element has a cycle in its 'part-of' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInStakeholderPartOfHierarchy(element, accept) {
        var _a, _b, _c, _d, _e;
        let partOfElement = element.partOf;
        if (!partOfElement) {
            return;
        }
        if (((_a = partOfElement.ref) === null || _a === void 0 ? void 0 : _a.name) === element.name) {
            accept('error', "Stakeholder '" + element.name + "' is part of itself", {
                node: element,
                property: 'partOf',
                code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
            });
            return;
        }
        let visitedElements = new Set();
        visitedElements.add(element.name);
        while (partOfElement) {
            if (!((_b = partOfElement.ref) === null || _b === void 0 ? void 0 : _b.name)) {
                break;
            }
            if (visitedElements.has((_c = partOfElement.ref) === null || _c === void 0 ? void 0 : _c.name)) {
                accept('error', "Cycle in hierarchy of Stakeholder '" + element.name + "'", {
                    node: element,
                    property: 'partOf',
                    code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
                });
                break;
            }
            visitedElements.add((_d = partOfElement.ref) === null || _d === void 0 ? void 0 : _d.name);
            partOfElement = (_e = partOfElement.ref) === null || _e === void 0 ? void 0 : _e.partOf;
        }
    }
    /**
     * Checks if the step element has a cycle in its 'next' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInStepsHierarchy(element, accept) {
        var _a, _b, _c, _d, _e;
        let nextElement = element.next;
        if (!nextElement) {
            return;
        }
        if (((_a = nextElement.ref) === null || _a === void 0 ? void 0 : _a.name) === element.name) {
            accept('error', "Step '" + element.name + "' has a cycle in 'next' relationship", {
                node: element,
                property: 'next',
                code: IssueCodes.STEP_NEXT_HIERARCHY_CYCLE,
            });
            return;
        }
        let visitedElements = new Set();
        visitedElements.add(element.name);
        while (nextElement) {
            if (!((_b = nextElement.ref) === null || _b === void 0 ? void 0 : _b.name)) {
                break;
            }
            if (visitedElements.has((_c = nextElement.ref) === null || _c === void 0 ? void 0 : _c.name)) {
                accept('error', "Cycle in 'next' relationship of '" + element.name + "'", {
                    node: element,
                    property: 'next',
                    code: IssueCodes.STEP_NEXT_HIERARCHY_CYCLE,
                });
                break;
            }
            visitedElements.add((_d = nextElement.ref) === null || _d === void 0 ? void 0 : _d.name);
            nextElement = (_e = nextElement.ref) === null || _e === void 0 ? void 0 : _e.next;
        }
    }
    /**
     * Checks if the user story element has a cycle in its part-of relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInUserStoryPartOfHierarchy(element, accept) {
        var _a, _b, _c, _d, _e;
        let partOfElement = element.partOf;
        if (!partOfElement) {
            return;
        }
        if (((_a = partOfElement.ref) === null || _a === void 0 ? void 0 : _a.name) === element.name) {
            accept('error', "UserStory '" + element.name + "' is part of itself", {
                node: element,
                property: 'partOf',
                code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
            });
            return;
        }
        let visitedElements = new Set();
        visitedElements.add(element.name);
        while (partOfElement) {
            if (!((_b = partOfElement.ref) === null || _b === void 0 ? void 0 : _b.name)) {
                break;
            }
            if (visitedElements.has((_c = partOfElement.ref) === null || _c === void 0 ? void 0 : _c.name)) {
                accept('error', "Cycle in hierarchy of UserStory '" + element.name + "'", {
                    node: element,
                    property: 'partOf',
                    code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
                });
                break;
            }
            visitedElements.add((_d = partOfElement.ref) === null || _d === void 0 ? void 0 : _d.name);
            partOfElement = (_e = partOfElement.ref) === null || _e === void 0 ? void 0 : _e.partOf;
        }
    }
    /**
     * Checks if the vulnerability element has a cycle in its 'is-a' relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInVulnerabilityIsAHierarchy(element, accept) {
        var _a, _b, _c, _d, _e;
        let superElement = element.super;
        if (!superElement) {
            return;
        }
        if (((_a = superElement.ref) === null || _a === void 0 ? void 0 : _a.name) === element.name) {
            accept('error', "Vulnerability '" + element.name + "' extends itself", {
                node: element,
                property: 'super',
                code: IssueCodes.ISA_HIERARCHY_CYCLE,
            });
            return;
        }
        let visitedElements = new Set();
        visitedElements.add(element.name);
        while (superElement) {
            if (!((_b = superElement.ref) === null || _b === void 0 ? void 0 : _b.name)) {
                break;
            }
            if (visitedElements.has((_c = superElement.ref) === null || _c === void 0 ? void 0 : _c.name)) {
                accept('error', "Cycle in hierarchy of Vulnerability '" + element.name + "'", {
                    node: element,
                    property: 'super',
                    code: IssueCodes.ISA_HIERARCHY_CYCLE,
                });
                break;
            }
            visitedElements.add((_d = superElement.ref) === null || _d === void 0 ? void 0 : _d.name);
            superElement = (_e = superElement.ref) === null || _e === void 0 ? void 0 : _e.super;
        }
    }
    /**
     * Checks if the vulnerability element has a cycle in its 'part-of'
     * relationships.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkNoCycleInVulnerabilityPartOfHierarchy(element, accept) {
        var _a, _b, _c, _d, _e;
        let partOfElement = element.partOf;
        if (!partOfElement) {
            return;
        }
        if (((_a = partOfElement.ref) === null || _a === void 0 ? void 0 : _a.name) === element.name) {
            accept('error', "Vulnerability '" + element.name + "' is part of itself", {
                node: element,
                property: 'partOf',
                code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
            });
            return;
        }
        let visitedElements = new Set();
        visitedElements.add(element.name);
        while (partOfElement) {
            if (!((_b = partOfElement.ref) === null || _b === void 0 ? void 0 : _b.name)) {
                break;
            }
            if (visitedElements.has((_c = partOfElement.ref) === null || _c === void 0 ? void 0 : _c.name)) {
                accept('error', "Cycle in hierarchy of Vulnerability '" + element.name + "'", {
                    node: element,
                    property: 'partOf',
                    code: IssueCodes.PARTOF_HIERARCHY_CYCLE,
                });
                break;
            }
            visitedElements.add((_d = partOfElement.ref) === null || _d === void 0 ? void 0 : _d.name);
            partOfElement = (_e = partOfElement.ref) === null || _e === void 0 ? void 0 : _e.partOf;
        }
    }
    /**
     * Checks if the name ID is unique and checks name, name alias and descriptions
     * of OtherElements taking into account synonyms and linguistic rules defined.
     *
     * @param element RSL element to check.
     * @param accept  The validation acceptor function to handle validation issues.
     */
    checkOtherElement(element, accept) {
        if (!element.name) {
            return;
        }
        const system = (0, langium_1.getContainerOfType)(element, ast_1.isSystem);
        if (!system) {
            return;
        }
        const linguisticRules = (0, rsl_utilities_1.getLinguisticRules)(system);
        const linguisticLanguage = (0, rsl_utilities_1.getLinguisticLanguageType)(system);
        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);
        const glossaryTerms = (0, rsl_utilities_1.getGlossaryTerms)(system);
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
    checkQRTypeSubType(element, accept) {
        if (!element.type || !element.subType) {
            return;
        }
        const type = (0, ast_1.isQRTypeOriginal)(element.type)
            ? element.type.type
            : element.type.type.$refText;
        const subType = (0, ast_1.isQRSubTypeOriginal)(element.subType)
            ? element.subType.type
            : element.subType.type.$refText;
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
    checkRequirement(element, accept) {
        const system = (0, langium_1.getContainerOfType)(element, ast_1.isSystem);
        if (!system) {
            return;
        }
        const linguisticRules = (0, rsl_utilities_1.getLinguisticRules)(system);
        const linguisticLanguage = (0, rsl_utilities_1.getLinguisticLanguageType)(system);
        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);
        const glossaryTerms = (0, rsl_utilities_1.getGlossaryTerms)(system);
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
    checkRequirementsRelationSrcTrgt(element, accept) {
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
    checkRiskTypeSubType(element, accept) {
        if (!element.type || !element.subType) {
            return;
        }
        const type = (0, ast_1.isRiskTypeOriginal)(element.type)
            ? element.type.type
            : element.type.type.$refText;
        const subType = (0, ast_1.isRiskSubTypeOriginal)(element.subType)
            ? element.subType.type
            : element.subType.type.$refText;
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
    checkScenario(element, accept) {
        const system = (0, langium_1.getContainerOfType)(element, ast_1.isSystem);
        if (!system) {
            return;
        }
        const linguisticRules = (0, rsl_utilities_1.getLinguisticRules)(system);
        const linguisticLanguage = (0, rsl_utilities_1.getLinguisticLanguageType)(system);
        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);
        const glossaryTerms = (0, rsl_utilities_1.getGlossaryTerms)(system);
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
    checkStakeholderTypeSubType(element, accept) {
        if (!element.type || !element.subType) {
            return;
        }
        const type = (0, ast_1.isStakeholderTypeOriginal)(element.type)
            ? element.type.type
            : element.type.type.$refText;
        const subType = (0, ast_1.isStakeholderSubTypeOriginal)(element.subType)
            ? element.subType.type
            : element.subType.type.$refText;
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
    checkStateMachineStates(element, accept) {
        var _a;
        let states = (_a = element.states) === null || _a === void 0 ? void 0 : _a.states;
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
    checkStep(element, accept) {
        const system = (0, langium_1.getContainerOfType)(element, ast_1.isSystem);
        if (!system) {
            return;
        }
        const linguisticRules = (0, rsl_utilities_1.getLinguisticRules)(system);
        const linguisticLanguage = (0, rsl_utilities_1.getLinguisticLanguageType)(system);
        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);
        const glossaryTerms = (0, rsl_utilities_1.getGlossaryTerms)(system);
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
    checkStructureElement(element, accept) {
        const system = (0, langium_1.getContainerOfType)(element, ast_1.isSystem);
        if (!system) {
            return;
        }
        const linguisticRules = (0, rsl_utilities_1.getLinguisticRules)(system);
        const linguisticLanguage = (0, rsl_utilities_1.getLinguisticLanguageType)(system);
        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);
        const glossaryTerms = (0, rsl_utilities_1.getGlossaryTerms)(system);
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
    checkSystemRelation(element, accept) {
        const system = (0, langium_1.getContainerOfType)(element, ast_1.isSystem);
        if (!system) {
            return;
        }
        const linguisticRules = (0, rsl_utilities_1.getLinguisticRules)(system);
        const linguisticLanguage = (0, rsl_utilities_1.getLinguisticLanguageType)(system);
        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);
        const glossaryTerms = (0, rsl_utilities_1.getGlossaryTerms)(system);
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
    checkSystemRelationSrcTrgt(element, accept) {
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
    checkSystemSet(element, accept) {
        const system = (0, langium_1.getContainerOfType)(element, ast_1.isSystem);
        if (!system) {
            return;
        }
        const linguisticRules = (0, rsl_utilities_1.getLinguisticRules)(system);
        const linguisticLanguage = (0, rsl_utilities_1.getLinguisticLanguageType)(system);
        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);
        const glossaryTerms = (0, rsl_utilities_1.getGlossaryTerms)(system);
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
    checkSystemTypeSubType(element, accept) {
        if (!element.type || !element.subType) {
            return;
        }
        const type = (0, ast_1.isSystemTypeOriginal)(element.type)
            ? element.type.type
            : element.type.type.$refText;
        const subType = (0, ast_1.isSystemSubTypeOriginal)(element.subType)
            ? element.subType.type
            : element.subType.type.$refText;
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
    checkTest(element, accept) {
        const system = (0, langium_1.getContainerOfType)(element, ast_1.isSystem);
        if (!system) {
            return;
        }
        const linguisticRules = (0, rsl_utilities_1.getLinguisticRules)(system);
        const linguisticLanguage = (0, rsl_utilities_1.getLinguisticLanguageType)(system);
        this.checkLinguisticRules(linguisticRules, element, element.name, 'name', 'id', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.nameAlias, 'nameAlias', 'name', linguisticLanguage, accept);
        this.checkLinguisticRules(linguisticRules, element, element.description, 'description', 'description', linguisticLanguage, accept);
        const glossaryTerms = (0, rsl_utilities_1.getGlossaryTerms)(system);
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
    checkUniqueLinguisticLanguage(element, accept) {
        const system = (0, langium_1.getContainerOfType)(element, ast_1.isSystem);
        if (!system) {
            return;
        }
        const linguisticRules = (0, rsl_utilities_1.getLinguisticLanguages)(system);
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
    checkUseCaseExtendsItself(element, accept) {
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
    checkVulnerabilityTypeSubType(element, accept) {
        if (!element.type || !element.subType) {
            return;
        }
        const type = (0, ast_1.isVulnerabilityTypeOriginal)(element.type)
            ? element.type.type
            : element.type.type.$refText;
        const subType = (0, ast_1.isVulnerabilitySubTypeOriginal)(element.subType)
            ? element.subType.type
            : element.subType.type.$refText;
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
    checkSynonyms(glossaryTerms, element, input, elementAttribute, accept) {
        if (!input) {
            return;
        }
        const inputToCheck = input.toLowerCase();
        for (let term of glossaryTerms) {
            if (!term.nameAlias || !(0, rsl_utilities_1.isGlossaryTermApplicableTo)(term, element)) {
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
                        data: [synonym, term.nameAlias],
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
    checkUniqueElementId(inputElementName, element, system, accept) {
        let foundDuplicate = false;
        for (let concept of system.systemConcepts) {
            if (concept) {
                let elementName = concept.name;
                if (element !== concept && elementName === inputElementName) {
                    foundDuplicate = true;
                    break;
                }
            }
            else if (concept) {
                let elementName = concept.name;
                if (element !== concept && elementName === inputElementName) {
                    foundDuplicate = true;
                    break;
                }
            }
            else if (concept) {
                let elementName = concept.name;
                if (element !== concept && elementName === inputElementName) {
                    foundDuplicate = true;
                    break;
                }
            }
            else if (concept) {
                let elementName = concept.name;
                if (element !== concept && elementName === inputElementName) {
                    foundDuplicate = true;
                    break;
                }
            }
            else if (concept) {
                let elementName = concept.name;
                if (element !== concept && elementName === inputElementName) {
                    foundDuplicate = true;
                    break;
                }
            }
            else if (concept) {
                let elementName = concept.name;
                if (element !== concept && elementName === inputElementName) {
                    foundDuplicate = true;
                    break;
                }
            }
            else if (concept) {
                let elementName = concept.name;
                if (element !== concept && elementName === inputElementName) {
                    foundDuplicate = true;
                    break;
                }
            }
            else {
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
    checkLinguisticRules(rules, element, input, elementAttribute, ruleProperty, languageType, accept) {
        if (!input) {
            return;
        }
        const rslElementName = element.$type;
        for (let rule of rules) {
            const patterns = rule.pattern;
            if (!patterns ||
                rule.property.property !== ruleProperty ||
                (0, rsl_utilities_1.getStereotypeType)(rule.property.element.element) !== rslElementName) {
                continue;
            }
            let errorMessage = this.getWrongPatternErrorMessage(patterns);
            if (ruleProperty === 'id') {
                let charIterator = 0;
                for (let pattern of patterns) {
                    let checkLinguisticPattern = this.checkElementIdLinguisticPattern(element, pattern, input, charIterator, elementAttribute, errorMessage, rule.severity, languageType, accept);
                    if (!checkLinguisticPattern.result) {
                        return;
                    }
                }
                return;
            }
            let tokens = this.nlpHelper.getTokens(languageType, input);
            if (tokens.length === 0) {
                this.displayValidationError(element, rule.severity, errorMessage, elementAttribute, IssueCodes.LINGUISTIC_RULE, accept, input);
                return;
            }
            let j = 0;
            for (let pattern of patterns) {
                let token = tokens[j];
                if (!token) {
                    this.displayValidationError(element, rule.severity, errorMessage, elementAttribute, IssueCodes.LINGUISTIC_RULE, accept, input);
                    return;
                }
                let checkLinguisticPattern = this.checkLinguisticPattern(element, pattern, tokens, j, input, elementAttribute, errorMessage, rule.severity, languageType, accept);
                if (!checkLinguisticPattern.result) {
                    return;
                }
                j = checkLinguisticPattern.tokenIteratorCount;
                j++;
            }
            if (j < tokens.length) {
                const wrongText = this.getExcessTextToRemove(j, tokens, input);
                this.displayValidationError(element, rule.severity, errorMessage, elementAttribute, IssueCodes.REMOVE_EXCESS_TEXT, accept, wrongText);
                return;
            }
        }
    }
    getExcessTextToRemove(tokenIteratorCount, tokens, input) {
        let correctText = '';
        for (let w = 0; w < tokenIteratorCount; w++) {
            if (w === 0) {
                correctText += tokens[w].originalText;
            }
            else {
                correctText += ' ' + tokens[w].originalText;
            }
        }
        return input.replace(correctText, '');
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
    checkElementIdLinguisticPattern(element, pattern, input, characterIterator, elementAttribute, errorMessage, severityLevel, languageType, accept) {
        let originalText = input.substring(characterIterator, input.length);
        if (!originalText) {
            this.displayValidationError(element, severityLevel, errorMessage, elementAttribute, IssueCodes.LINGUISTIC_RULE, accept, input);
            return { result: false, charIteratorCount: characterIterator };
        }
        let expectedPartOfSpeech = new Set();
        let expectedWords = new Set();
        let expectedElementsAndProperties = [];
        let linguisticFragmentHelpers = [];
        let possibleCharIterators = new Set();
        for (let fragmentPart of pattern.parts) {
            if ((0, ast_1.isLinguisticFragmentRef)(fragmentPart)) {
                let linguisticOption = fragmentPart.option.ref;
                if (!linguisticOption) {
                    continue;
                }
                for (let option of linguisticOption.options) {
                    let linguisticFragmentHelper = new linguisticFragmentPartHelper_1.LinguisticFragmentPartHelper(languageType, element, this.nlpHelper, option, undefined, undefined);
                    if (!linguisticFragmentHelpers.find((x) => x.optionType === linguisticFragmentPartHelper_1.OptionType.PartOfSpeech)) {
                        linguisticFragmentHelpers.push(linguisticFragmentHelper);
                    }
                    let result = linguisticFragmentHelper.getMatchingText(originalText);
                    if (!result) {
                        possibleCharIterators.add(result.length);
                    }
                }
            }
            else {
                let patternOptionHelper = new linguisticFragmentPartHelper_1.LinguisticFragmentPartHelper(languageType, element, this.nlpHelper, fragmentPart, undefined, undefined);
                let result = patternOptionHelper.getMatchingText(originalText);
                if (patternOptionHelper.optionType === linguisticFragmentPartHelper_1.OptionType.PartOfSpeech) {
                    expectedPartOfSpeech.add(patternOptionHelper.expectedOption);
                }
                else if (patternOptionHelper.optionType === linguisticFragmentPartHelper_1.OptionType.Word) {
                    expectedWords.add(patternOptionHelper.expectedOption);
                }
                else if (patternOptionHelper.optionType === linguisticFragmentPartHelper_1.OptionType.ElementAndProperty) {
                    expectedElementsAndProperties.push(patternOptionHelper.expectedRuleElementProperty);
                }
                else {
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
            this.displayValidationError(element, severityLevel, errorMessage, elementAttribute, IssueCodes.LINGUISTIC_RULE, accept, originalText);
            return { result: false, charIteratorCount: characterIterator };
        }
        let additionalInfo = this.getDetailedErrorInfo(originalText, expectedPartOfSpeech, expectedWords, expectedElementsAndProperties, linguisticFragmentHelpers);
        errorMessage += additionalInfo;
        if (expectedWords.size === 0 && expectedElementsAndProperties.length === 0 && linguisticFragmentHelpers.length === 0) {
            this.displayValidationError(element, severityLevel, errorMessage, elementAttribute, IssueCodes.LINGUISTIC_RULE, accept, originalText);
            return { result: false, tokenIteratorCount: characterIterator };
        }
        for (let expectedWord of expectedWords) {
            // Issue Data follows the convention "{wrongWord, correctWord}" to be recognized by a quick fix handler
            this.displayValidationError(element, severityLevel, errorMessage, elementAttribute, IssueCodes.REPLACE_WORD, accept, originalText, expectedWord);
        }
        for (let patternOptionHelper of linguisticFragmentHelpers) {
            let expectedOption = patternOptionHelper.expectedOption;
            // Issue Data follows the convention "{wrongWord, correctWord}" to be recognized by a quick fix handler
            if (patternOptionHelper.optionType === linguisticFragmentPartHelper_1.OptionType.Word) {
                this.displayValidationError(element, severityLevel, errorMessage, elementAttribute, IssueCodes.REPLACE_WORD, accept, originalText, expectedOption);
            }
            else if (patternOptionHelper.optionType === linguisticFragmentPartHelper_1.OptionType.ElementAndProperty) {
                this.displayValidationError(element, severityLevel, errorMessage, elementAttribute, IssueCodes.SELECT_ELEMENT, accept, originalText, expectedOption, patternOptionHelper.expectedRuleElementProperty.toString());
            }
            else if (patternOptionHelper.optionType === linguisticFragmentPartHelper_1.OptionType.PartOfSpeech) {
                this.displayValidationError(element, severityLevel, errorMessage, elementAttribute, IssueCodes.LINGUISTIC_RULE, accept, originalText, expectedOption);
            }
            else {
                throw new Error(`${patternOptionHelper.optionType} is not supported`);
            }
        }
        for (let elementAndProperty of expectedElementsAndProperties) {
            // Issue Data follows the convention "{wrongWord, correctWord}" to be recognized by a quick fix handler
            this.displayValidationError(element, severityLevel, errorMessage, elementAttribute, IssueCodes.CREATE_ELEMENT, accept, originalText, (0, rsl_utilities_1.getStereotypeType)(elementAndProperty.element.element), elementAndProperty.property);
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
    checkLinguisticPattern(element, pattern, tokens, tokenIteratorCount, input, elementAttribute, errorMessage, severityLevel, languageType, accept) {
        let originalText = tokens[tokenIteratorCount].originalText;
        let expectedPartOfSpeech = new Set();
        let expectedWords = new Set();
        let expectedElementsAndProperties = [];
        let linguisticFragmentHelpers = [];
        for (let fragmentPart of pattern.parts) {
            if ((0, ast_1.isLinguisticFragmentRef)(fragmentPart)) {
                let linguisticOption = fragmentPart.option.ref;
                if (!linguisticOption) {
                    continue;
                }
                for (let option of linguisticOption.options) {
                    let patternOptionHelper = new linguisticFragmentPartHelper_1.LinguisticFragmentPartHelper(languageType, element, this.nlpHelper, option, tokens, tokenIteratorCount);
                    if (!linguisticFragmentHelpers.find((x) => x.optionType === linguisticFragmentPartHelper_1.OptionType.PartOfSpeech)) {
                        linguisticFragmentHelpers.push(patternOptionHelper);
                    }
                    let validateInput = patternOptionHelper.validateInput();
                    originalText = tokens[validateInput.tokenIteratorCount].originalText;
                    if (validateInput.result) {
                        return validateInput;
                    }
                }
            }
            else {
                let patternOptionHelper = new linguisticFragmentPartHelper_1.LinguisticFragmentPartHelper(languageType, element, this.nlpHelper, fragmentPart, tokens, tokenIteratorCount);
                let validateInput = patternOptionHelper.validateInput();
                if (patternOptionHelper.optionType === linguisticFragmentPartHelper_1.OptionType.PartOfSpeech) {
                    expectedPartOfSpeech.add(patternOptionHelper.expectedOption);
                }
                else if (patternOptionHelper.optionType === linguisticFragmentPartHelper_1.OptionType.Word) {
                    expectedWords.add(patternOptionHelper.expectedOption);
                }
                else if (patternOptionHelper.optionType === linguisticFragmentPartHelper_1.OptionType.ElementAndProperty) {
                    expectedElementsAndProperties.push(patternOptionHelper.expectedRuleElementProperty);
                }
                else {
                    // nothing to do
                }
                originalText = tokens[validateInput.tokenIteratorCount].originalText;
                if (validateInput.result) {
                    return validateInput;
                }
            }
        }
        let additionalInfo = this.getDetailedErrorInfo(originalText, expectedPartOfSpeech, expectedWords, expectedElementsAndProperties, linguisticFragmentHelpers);
        errorMessage += additionalInfo;
        if (expectedWords.size === 0 && expectedElementsAndProperties.length === 0 && linguisticFragmentHelpers.length === 0) {
            this.displayValidationError(element, severityLevel, errorMessage, elementAttribute, IssueCodes.LINGUISTIC_RULE, accept, originalText);
            return { result: false, tokenIteratorCount: tokenIteratorCount };
        }
        for (let expectedWord of expectedWords) {
            // Issue Data follows the convention "{wrongWord, correctWord}" to be recognized by a quick fix handler
            this.displayValidationError(element, severityLevel, errorMessage, elementAttribute, IssueCodes.REPLACE_WORD, accept, originalText, expectedWord);
        }
        for (let patternOptionHelper of linguisticFragmentHelpers) {
            let expectedOption = patternOptionHelper.expectedOption;
            // Issue Data follows the convention "{wrongWord, correctWord}" to be recognized by a quick fix handler
            if (patternOptionHelper.optionType === linguisticFragmentPartHelper_1.OptionType.Word) {
                this.displayValidationError(element, severityLevel, errorMessage, elementAttribute, IssueCodes.REPLACE_WORD, accept, originalText, expectedOption);
            }
            else if (patternOptionHelper.optionType === linguisticFragmentPartHelper_1.OptionType.ElementAndProperty) {
                this.displayValidationError(element, severityLevel, errorMessage, elementAttribute, IssueCodes.SELECT_ELEMENT, accept, originalText, expectedOption, patternOptionHelper.expectedRuleElementProperty.toString());
            }
            else if (patternOptionHelper.optionType === linguisticFragmentPartHelper_1.OptionType.PartOfSpeech) {
                this.displayValidationError(element, severityLevel, errorMessage, elementAttribute, IssueCodes.LINGUISTIC_RULE, accept, originalText, expectedOption);
            }
            else {
                throw new Error(`${patternOptionHelper.optionType} is not supported`);
            }
        }
        for (let elementAndProperty of expectedElementsAndProperties) {
            // Issue Data follows the convention "{wrongWord, correctWord}" to be recognized by a quick fix handler
            this.displayValidationError(element, severityLevel, errorMessage, elementAttribute, IssueCodes.CREATE_ELEMENT, accept, originalText, (0, rsl_utilities_1.getStereotypeType)(elementAndProperty.element.element), elementAndProperty.property);
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
    getDetailedErrorInfo(originalText, expectedPartOfSpeech, expectedWords, expectedElementsAndProperties, linguisticFragmentHelpers) {
        let expectedPartOfSpeechesList = [];
        expectedPartOfSpeech.forEach((x) => expectedPartOfSpeechesList.push(x));
        let additionalInfo = `"${langium_1.EOL}The word '${originalText}' is expected to`;
        for (let i = 0; i < expectedPartOfSpeechesList.length; i++) {
            let expectedPosTag = expectedPartOfSpeechesList[i];
            if (i === 0) {
                additionalInfo += ` be categorized as '${expectedPosTag}'`;
            }
            else {
                additionalInfo += ` or '${expectedPosTag}'`;
            }
        }
        let expectedWordsList = [];
        expectedWords.forEach((x) => expectedWordsList.push(x));
        for (let i = 0; i < expectedWordsList.length; i++) {
            let expectedWord = expectedWordsList[i];
            if (i === 0 && expectedPartOfSpeech.size > 0) {
                additionalInfo += ` or the word '${expectedWord}'`;
            }
            else if (i === 0) {
                additionalInfo += ` be the word '${expectedWord}'`;
            }
            else {
                additionalInfo += ` or '${expectedWord}'`;
            }
        }
        for (let i = 0; i < expectedElementsAndProperties.length; i++) {
            let linguisticRuleElementAndProperty = expectedElementsAndProperties[i];
            let property = linguisticRuleElementAndProperty.property.toString().toLowerCase();
            let element = (0, rsl_utilities_1.getStereotypeType)(linguisticRuleElementAndProperty.element.element);
            if (i === 0 && (expectedPartOfSpeech.size > 0 || expectedWords.size > 0)) {
                additionalInfo += ` or the '${property} of a/an '${element}'`;
            }
            else if (i === 0) {
                additionalInfo += ` be the '${property} of a/an '${element}'`;
            }
            else {
                additionalInfo += ` or '${element}'`;
            }
        }
        for (let i = 0; i < linguisticFragmentHelpers.length; i++) {
            let linguisticFragmentPartHelper = linguisticFragmentHelpers[i];
            if ((i === 0 && (expectedPartOfSpeech.size > 0 || expectedWords.size > 0)) || expectedElementsAndProperties.length > 0) {
                additionalInfo += ` or one of the following fragment: '${linguisticFragmentPartHelper.expectedOption}'`;
            }
            else if (i === 0) {
                additionalInfo += ` to be one of the following fragments: '${linguisticFragmentPartHelper.expectedOption}'`;
            }
            else {
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
    displayValidationError(element, severity, errorMessage, elementAttribute, issueCode, accept, ...issueData) {
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
    getWrongPatternErrorMessage(patterns) {
        var _a;
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
                    let posTag = patternOption;
                    errorMessage += posTag.posTag;
                }
                else if (patternOption.$type === 'Word') {
                    let word = patternOption;
                    errorMessage += word.word;
                }
                else if (patternOption.$type === 'LinguisticRuleElementAndProperty') {
                    let element = patternOption;
                    errorMessage += (0, rsl_utilities_1.getStereotypeType)(element.element.element) + '.' + element.property;
                }
                else if (patternOption.$type === 'LinguisticFragmentRef') {
                    let linguisticOption = patternOption.option;
                    errorMessage += (_a = linguisticOption.ref) === null || _a === void 0 ? void 0 : _a.name;
                }
                else {
                    errorMessage += '';
                }
            }
            errorMessage += ')';
        }
        return errorMessage;
    }
}
exports.RslValidator = RslValidator;
//# sourceMappingURL=rsl-validator.js.map