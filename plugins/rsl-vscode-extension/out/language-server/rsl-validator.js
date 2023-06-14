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
        LinguisticLanguage: validator.checkLinguisticLanguage,
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
            newElementsText += `\r\n${(_b = concept.$cstNode) === null || _b === void 0 ? void 0 : _b.text}\r\n`;
        }
        accept('info', `Replace this specification with all elements from the ${systemName} system`, {
            node: element,
            code: IssueCodes.INCLUDE_ALL,
            data: [systemName, newElementsText],
        });
    }
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
    checkLinguisticLanguage(element, accept) {
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
                        data: [synonym, term.nameAlias, input],
                    });
                    break;
                }
            }
        }
    }
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
                let { wrongText, correctText } = this.getExcessTextToRemove(j, tokens, input);
                this.displayValidationError(element, rule.severity, errorMessage, elementAttribute, IssueCodes.REMOVE_EXCESS_TEXT, accept, input, wrongText, correctText);
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
        let wrongText = input.replace(correctText, '');
        return { wrongText, correctText };
    }
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
            this.displayValidationError(element, severityLevel, errorMessage, elementAttribute, IssueCodes.REPLACE_WORD, accept, originalText, expectedWord, input);
        }
        for (let patternOptionHelper of linguisticFragmentHelpers) {
            let expectedOption = patternOptionHelper.expectedOption;
            // Issue Data follows the convention "{wrongWord, correctWord}" to be recognized by a quick fix handler
            if (patternOptionHelper.optionType === linguisticFragmentPartHelper_1.OptionType.Word) {
                this.displayValidationError(element, severityLevel, errorMessage, elementAttribute, IssueCodes.REPLACE_WORD, accept, originalText, expectedOption, input);
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
    checkLinguisticPattern(element, pattern, tokens, tokenIteratorCount, input, elementAttribute, errorMessage, severityLevel, linguisticLanguageType, accept) {
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
                    let patternOptionHelper = new linguisticFragmentPartHelper_1.LinguisticFragmentPartHelper(linguisticLanguageType, element, this.nlpHelper, option, tokens, tokenIteratorCount);
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
                let patternOptionHelper = new linguisticFragmentPartHelper_1.LinguisticFragmentPartHelper(linguisticLanguageType, element, this.nlpHelper, fragmentPart, tokens, tokenIteratorCount);
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
            this.displayValidationError(element, severityLevel, errorMessage, elementAttribute, IssueCodes.REPLACE_WORD, accept, originalText, expectedWord, input);
        }
        for (let patternOptionHelper of linguisticFragmentHelpers) {
            let expectedOption = patternOptionHelper.expectedOption;
            // Issue Data follows the convention "{wrongWord, correctWord}" to be recognized by a quick fix handler
            if (patternOptionHelper.optionType === linguisticFragmentPartHelper_1.OptionType.Word) {
                this.displayValidationError(element, severityLevel, errorMessage, elementAttribute, IssueCodes.REPLACE_WORD, accept, originalText, expectedOption, input);
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
    getDetailedErrorInfo(originalText, expectedPartOfSpeech, expectedWords, expectedElementsAndProperties, linguisticFragmentHelpers) {
        let expectedPartOfSpeechesList = [];
        expectedPartOfSpeech.forEach((x) => expectedPartOfSpeechesList.push(x));
        let additionalInfo = `"\r\nThe word '${originalText}' is expected to`;
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