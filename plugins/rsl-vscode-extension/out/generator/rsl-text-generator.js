"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RsltextGenerator = void 0;
const langium_1 = require("langium");
const ast_1 = require("../language-server/generated/ast");
const rsl_generator_1 = require("./rsl-generator");
const rsl_utilities_1 = require("../util/rsl-utilities");
/**
 * Represents a plain text generator for RSL.
 */
class RsltextGenerator extends rsl_generator_1.RslGenerator {
    /**
     * Gets the file extension associated with the generator.
     *
     * @returns The file extension.
     */
    getFileExtension() {
        return '.txt';
    }
    /**
     * Generates the content of the plain text file based on the RSL model.
     *
     * @returns The generated text content as a Buffer.
     */
    generate() {
        const fileNode = new langium_1.CompositeGeneratorNode();
        for (const packageSystem of this.model.packages) {
            const system = packageSystem.system;
            if (!system) {
                continue;
            }
            fileNode.append(`System: ${system.name}`);
            fileNode.appendIf(system.nameAlias !== undefined, ` (${system.nameAlias})`);
            fileNode.appendIf(system.isReusable, langium_1.NL, `isReusable`);
            fileNode.appendIf(system.isFinal, langium_1.NL, `isFinal`);
            fileNode.appendNewLine();
            fileNode.append('----------------------------------------');
            fileNode.appendIf(system.vendor !== undefined, ` Vendor: ${system.vendor} `);
            fileNode.appendIf(system.version !== undefined, langium_1.NL, `Version: ${system.version}`);
            fileNode.appendIf(system.description !== undefined, langium_1.NL, `${system.description}`);
            fileNode.appendNewLine();
            const terms = (0, rsl_utilities_1.getGlossaryTerms)(system);
            if (terms.length > 0) {
                fileNode.append(langium_1.NL, `#Terms`, langium_1.NL);
                fileNode.append(`----------------------------------------`, langium_1.NL);
                terms.forEach((x) => this.getTermContent(x, fileNode));
            }
            const stakeholders = (0, rsl_utilities_1.getStakeholders)(system);
            if (stakeholders.length > 0) {
                fileNode.append(langium_1.NL, `#Stakeholders`, langium_1.NL);
                fileNode.append(`----------------------------------------`, langium_1.NL);
                stakeholders.forEach((x) => this.getStakeholderContent(x, fileNode));
            }
            const actors = (0, rsl_utilities_1.getActors)(system);
            if (actors.length > 0) {
                fileNode.append(langium_1.NL, `#Actors`, langium_1.NL);
                fileNode.append(`----------------------------------------`, langium_1.NL);
                actors.forEach((x) => this.getActorContent(x, fileNode));
            }
            const events = (0, rsl_utilities_1.getActiveEvents)(system);
            if (events.length > 0) {
                fileNode.append(langium_1.NL, `#Events`, langium_1.NL);
                fileNode.append(`----------------------------------------`, langium_1.NL);
                events.forEach((x) => this.getEventContent(x, fileNode));
            }
            const tasks = (0, rsl_utilities_1.getActiveTasks)(system);
            if (tasks.length > 0) {
                fileNode.append(langium_1.NL, `#Tasks`, langium_1.NL);
                fileNode.append(`----------------------------------------`, langium_1.NL);
                tasks.forEach((x) => this.getTaskContent(x, fileNode));
            }
            const flows = (0, rsl_utilities_1.getActiveFlows)(system);
            if (flows.length > 0) {
                fileNode.append(langium_1.NL, `#Flows`, langium_1.NL);
                fileNode.append(`----------------------------------------`, langium_1.NL);
                flows.forEach((x) => this.getFlowContent(x, fileNode));
            }
            const frs = (0, rsl_utilities_1.getFRs)(system);
            if (frs.length > 0) {
                fileNode.append(langium_1.NL, `#FRs`, langium_1.NL);
                fileNode.append(`----------------------------------------`, langium_1.NL);
                frs.forEach((x) => this.getFRContent(x, fileNode));
            }
            const goals = (0, rsl_utilities_1.getGoals)(system);
            if (goals.length > 0) {
                fileNode.append(langium_1.NL, `#Goals`, langium_1.NL);
                fileNode.append(`----------------------------------------`, langium_1.NL);
                goals.forEach((x) => this.getGoalContent(x, fileNode));
            }
            const qrs = (0, rsl_utilities_1.getQRs)(system);
            if (qrs.length > 0) {
                fileNode.append(langium_1.NL, `#QRs`, langium_1.NL);
                fileNode.append(`----------------------------------------`, langium_1.NL);
                qrs.forEach((x) => this.getQRContent(x, fileNode));
            }
            const risks = (0, rsl_utilities_1.getRisks)(system);
            if (risks.length > 0) {
                fileNode.append(langium_1.NL, `#Risks`, langium_1.NL);
                fileNode.append(`----------------------------------------`, langium_1.NL);
                risks.forEach((x) => this.getRiskContent(x, fileNode));
            }
            const vulnerabilities = (0, rsl_utilities_1.getVulnerabilities)(system);
            if (vulnerabilities.length > 0) {
                fileNode.append(langium_1.NL, `#Vulnerabilities`, langium_1.NL);
                fileNode.append(`----------------------------------------`, langium_1.NL);
                vulnerabilities.forEach((x) => this.getVulnerabilityContent(x, fileNode));
            }
            const stateMachines = (0, rsl_utilities_1.getStateMachines)(system);
            if (stateMachines.length > 0) {
                fileNode.append(langium_1.NL, `#StateMachines`, langium_1.NL);
                fileNode.append(`----------------------------------------`, langium_1.NL);
                stateMachines.forEach((x) => this.getStateMachineContent(x, fileNode));
            }
            const useCases = (0, rsl_utilities_1.getUseCases)(system);
            if (useCases.length > 0) {
                fileNode.append(langium_1.NL, `#UseCases`, langium_1.NL);
                fileNode.append(`----------------------------------------`, langium_1.NL);
                useCases.forEach((x) => this.getUseCasesContent(x, fileNode));
            }
            const useStories = (0, rsl_utilities_1.getUserStories)(system);
            if (useStories.length > 0) {
                fileNode.append(langium_1.NL, `#UserStories`, langium_1.NL);
                fileNode.append(`----------------------------------------`, langium_1.NL);
                useStories.forEach((x) => this.getUserStoryContent(x, fileNode));
            }
        }
        return Buffer.from((0, langium_1.toString)(fileNode));
    }
    /**
     * Retrieves the content for a given vulnerability.
     *
     * @param vulnerability The vulnerability to be processed.
     * @param fileNode      Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getVulnerabilityContent(vulnerability, fileNode) {
        var _a, _b, _c;
        const type = (0, ast_1.isVulnerabilityTypeOriginal)(vulnerability.type)
            ? vulnerability.type.type
            : vulnerability.type.type.$refText;
        let subType = '';
        if (vulnerability.subType) {
            subType = (0, ast_1.isVulnerabilitySubTypeOriginal)(vulnerability.subType)
                ? vulnerability.subType.type
                : vulnerability.subType.type.$refText;
        }
        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(vulnerability.nameAlias !== undefined, `${vulnerability.nameAlias} `);
        fileNode.append(`(${vulnerability.name}) is a ${vulnerability.subType ? subType : type}`);
        fileNode.appendIf(vulnerability.description !== undefined, `, described as ${vulnerability.description}`);
        fileNode.append('.');
        fileNode.appendIf(vulnerability.tags.length !== 0, langium_1.NL, `Tags: ${vulnerability.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`);
        fileNode.appendIf(vulnerability.attack !== undefined, langium_1.NL, `Attack: ${vulnerability.attack}`);
        fileNode.appendIf(vulnerability.attackVector !== undefined, langium_1.NL, `AttackVector: ${vulnerability.attackVector}`);
        fileNode.appendIf(vulnerability.score !== undefined, langium_1.NL, `Score: ${vulnerability.score}`);
        fileNode.appendIf(vulnerability.solution !== undefined && vulnerability.solution.refs.length !== 0, langium_1.NL, `Solution: ${(_a = vulnerability.solution) === null || _a === void 0 ? void 0 : _a.refs.map((x) => x.$refText).join(', ')}`);
        fileNode.appendIf(vulnerability.partOf !== undefined, langium_1.NL, `PartOf: ${(_b = vulnerability.partOf) === null || _b === void 0 ? void 0 : _b.$refText}`);
        fileNode.appendIf(vulnerability.super !== undefined, langium_1.NL, `Super: ${(_c = vulnerability.super) === null || _c === void 0 ? void 0 : _c.$refText}`);
        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }
    /**
     * Retrieves the content for a given user story.
     *
     * @param userStory The user story to be processed.
     * @param fileNode  Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getUserStoryContent(userStory, fileNode) {
        var _a, _b, _c;
        const type = (0, ast_1.isUserStoryTypeOriginal)(userStory.type)
            ? userStory.type.type
            : userStory.type.type.$refText;
        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(userStory.nameAlias !== undefined, `${userStory.nameAlias} `);
        fileNode.append(`(${userStory.name}) is a ${type}`);
        fileNode.appendIf(userStory.description !== undefined, `, described as ${userStory.description}`);
        fileNode.append('.');
        fileNode.appendIf(userStory.acceptanceCriteria.length !== 0, langium_1.NL, `AcceptanceCriteria: ${userStory.acceptanceCriteria.map((x) => x.name).join(', ')}`);
        fileNode.appendIf(userStory.actor !== undefined, langium_1.NL, `Actor: ${userStory.actor}`);
        fileNode.appendIf(userStory.goal !== undefined, langium_1.NL, `Goal: ${userStory.goal}`);
        fileNode.appendIf(userStory.isAbstract, langium_1.NL, `IsAbstract`);
        fileNode.appendIf(userStory.isConcrete, langium_1.NL, `IsConcrete`);
        fileNode.appendIf(userStory.isNegative, langium_1.NL, `IsNegative`);
        fileNode.appendIf(userStory.isPositive, langium_1.NL, `IsPositive`);
        fileNode.appendIf(userStory.isProblem, langium_1.NL, `IsProblem`);
        fileNode.appendIf(userStory.isSolution, langium_1.NL, `IsSolution`);
        fileNode.appendIf(userStory.otherRole !== undefined, langium_1.NL, `OtherRole: ${userStory.otherRole}`);
        fileNode.appendIf(userStory.priority !== undefined, langium_1.NL, `Priority: ${(_a = userStory.priority) === null || _a === void 0 ? void 0 : _a.type}`);
        fileNode.appendIf(userStory.reason !== undefined, langium_1.NL, `Reason: ${userStory.reason}`);
        fileNode.appendIf(userStory.stakeholder !== undefined, langium_1.NL, `Stakeholder: ${(_b = userStory.stakeholder) === null || _b === void 0 ? void 0 : _b.$refText}`);
        fileNode.appendIf(userStory.goal !== undefined, langium_1.NL, `Goal: ${userStory.goal}`);
        fileNode.appendIf(userStory.partOf !== undefined, langium_1.NL, `PartOf: ${(_c = userStory.partOf) === null || _c === void 0 ? void 0 : _c.$refText}`);
        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }
    /**
     * Retrieves the content for a given use case.
     *
     * @param useCase  The use case to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getUseCasesContent(useCase, fileNode) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const type = (0, ast_1.isUseCaseTypeOriginal)(useCase.type)
            ? useCase.type.type
            : useCase.type.type.$refText;
        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(useCase.nameAlias !== undefined, `${useCase.nameAlias} `);
        fileNode.append(`(${useCase.name}) is a ${type}`);
        fileNode.appendIf(useCase.description !== undefined, `, described as ${useCase.description}`);
        fileNode.append('.');
        fileNode.appendIf(useCase.acceptanceCriteria.length !== 0, langium_1.NL, `AcceptanceCriteria: ${useCase.acceptanceCriteria.map((x) => x.name).join(', ')}`);
        fileNode.appendIf(useCase.tags.length !== 0, langium_1.NL, `Tags: ${useCase.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`);
        fileNode.appendIf(useCase.actions !== undefined, langium_1.NL, `Actions: ${(_a = useCase.actions) === null || _a === void 0 ? void 0 : _a.actions.map((x) => ((0, ast_1.isActionTypeOriginal)(x) ? x.type : x.type.$refText)).join(', ')}`);
        fileNode.appendIf(useCase.dataEntity !== undefined, langium_1.NL, `DataEntity: ${(_b = useCase.dataEntity) === null || _b === void 0 ? void 0 : _b.$refText}`);
        fileNode.appendIf(useCase.extends.length !== 0, langium_1.NL, `Extends: ${useCase.extends.map((x) => `${x.extensionPoint.$refText} of use case ${x.usecase.$refText}`).join(', ')}`);
        fileNode.appendIf(useCase.extensionPoints !== undefined && useCase.extensionPoints.extensionPoints.length !== 0, langium_1.NL, `ExtensionPoints: ${(_c = useCase.extensionPoints) === null || _c === void 0 ? void 0 : _c.extensionPoints.map((x) => `${x.name}${x.description ? ' described as ' : ''}`).join(', ')}`);
        fileNode.appendIf(useCase.includes !== undefined && useCase.includes.includes.length !== 0, langium_1.NL, `Includes: ${(_d = useCase.includes) === null || _d === void 0 ? void 0 : _d.includes.map((x) => `[${x.refs.map((y) => y.$refText).join(' ')}]`).join(', ')}`);
        fileNode.appendIf(useCase.isAbstract, langium_1.NL, `IsAbstract`);
        fileNode.appendIf(useCase.isConcrete, langium_1.NL, `IsConcrete`);
        fileNode.appendIf(useCase.isNegative, langium_1.NL, `IsNegative`);
        fileNode.appendIf(useCase.isPositive, langium_1.NL, `IsPositive`);
        fileNode.appendIf(useCase.isProblem, langium_1.NL, `IsProblem`);
        fileNode.appendIf(useCase.isSolution, langium_1.NL, `IsSolution`);
        fileNode.appendIf(useCase.mainScenarios.length !== 0, langium_1.NL, `MainScenarios: ${useCase.mainScenarios.map((x) => x.name).join(', ')}`);
        fileNode.appendIf(useCase.precondition !== undefined, langium_1.NL, `PreCondition: ${useCase.precondition}`);
        fileNode.appendIf(useCase.postcondition !== undefined, langium_1.NL, `PostCondition: ${useCase.postcondition}`);
        fileNode.appendIf(useCase.primaryActor !== undefined, langium_1.NL, `PrimaryActor: ${(_e = useCase.primaryActor) === null || _e === void 0 ? void 0 : _e.$refText}`);
        fileNode.appendIf(useCase.priority !== undefined, langium_1.NL, `Priority: ${(_f = useCase.priority) === null || _f === void 0 ? void 0 : _f.type}`);
        fileNode.appendIf(useCase.stakeholder !== undefined, `Stakeholder: ${(_g = useCase.stakeholder) === null || _g === void 0 ? void 0 : _g.$refText}`);
        fileNode.appendIf(useCase.supportingActors.length !== 0, langium_1.NL, `Supporting Actors: ${useCase.supportingActors.map((x) => `[${x.refs.map((y) => y.$refText).join(' ')}]`).join(', ')}`);
        fileNode.appendIf(useCase.triggeredBy !== undefined, langium_1.NL, `TriggeredBy: ${(_h = useCase.triggeredBy) === null || _h === void 0 ? void 0 : _h.$refText}`);
        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }
    /**
     * Retrieves the content for a given state machine.
     *
     * @param stateMachine The state machine to be processed.
     * @param fileNode     Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getStateMachineContent(stateMachine, fileNode) {
        var _a, _b, _c;
        const type = (0, ast_1.isStateMachineTypeOriginal)(stateMachine.type)
            ? stateMachine.type.type
            : stateMachine.type.type.$refText;
        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(stateMachine.nameAlias !== undefined, `${stateMachine.nameAlias} `);
        fileNode.append(`(${stateMachine.name}) is a ${type}`);
        fileNode.appendIf(stateMachine.description !== undefined, `, described as ${stateMachine.description}`);
        fileNode.append('.');
        fileNode.appendIf(stateMachine.entity !== undefined, langium_1.NL, `Entity: ${(_a = stateMachine.entity) === null || _a === void 0 ? void 0 : _a.$refText}`);
        fileNode.appendIf(((_b = stateMachine.states) === null || _b === void 0 ? void 0 : _b.states) !== undefined, langium_1.NL, `States: ${(_c = stateMachine.states) === null || _c === void 0 ? void 0 : _c.states.map((x) => `${langium_1.EOL}${x.name}${x.nameAlias ? ` ${x.nameAlias}` : ''}${x.isInitial ? ` isInitial` : ''}${x.isFinal ? ` isFinal` : ''}${x.onEntry ? ` ${x.onEntry}` : ''}${x.onExit ? ` ${x.onExit}` : ''}${x.transitions.length !== 0 ? `${langium_1.EOL}${x.transitions.map((y) => `\tuse case ${y.ucAction.useCase.$refText} action ${((0, ast_1.isActionTypeOriginal)(y.ucAction.action)) ? y.ucAction.action.type : y.ucAction.action.type.$refText}${y.nextstate ? ` next state ${y.nextstate.$refText}` : ''}`).join(langium_1.EOL)}` : ''}`).join()}`);
        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(stateMachine.tags.length !== 0, langium_1.NL, `Tags: ${stateMachine.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`);
        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }
    /**
     * Retrieves the content for a given risk.
     *
     * @param risk     The risk to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getRiskContent(risk, fileNode) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const type = (0, ast_1.isRiskTypeOriginal)(risk.type)
            ? risk.type.type
            : risk.type.type.$refText;
        let subType = '';
        if (risk.subType) {
            subType = (0, ast_1.isRiskSubTypeOriginal)(risk.subType)
                ? risk.subType.type
                : risk.subType.type.$refText;
        }
        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(risk.nameAlias !== undefined, `${risk.nameAlias} `);
        fileNode.append(`(${risk.name}) is a ${risk.subType ? subType : type}`);
        fileNode.appendIf(risk.description !== undefined, `, described as ${risk.description}`);
        fileNode.append('.');
        fileNode.appendIf(risk.acceptanceCriteria.length !== 0, langium_1.NL, `AcceptanceCriteria: ${risk.acceptanceCriteria.map((x) => x.name).join(', ')}`);
        fileNode.appendIf(risk.assessment !== undefined, langium_1.NL, `Assessment:
            ${((_a = risk.assessment) === null || _a === void 0 ? void 0 : _a.consequence) ? ` with consequence ${(_b = risk.assessment) === null || _b === void 0 ? void 0 : _b.consequence}` : ''}
            ${((_c = risk.assessment) === null || _c === void 0 ? void 0 : _c.impact) ? ` with impact ${(_d = risk.assessment) === null || _d === void 0 ? void 0 : _d.impact}` : ''}
            ${((_e = risk.assessment) === null || _e === void 0 ? void 0 : _e.impactLevel) ? ` with impact level ${(_f = risk.assessment) === null || _f === void 0 ? void 0 : _f.impactLevel}` : ''}
            ${((_g = risk.assessment) === null || _g === void 0 ? void 0 : _g.probability) ? ` with probability ${(_h = risk.assessment) === null || _h === void 0 ? void 0 : _h.probability}` : ''}`);
        fileNode.appendIf(risk.negativeRequirement !== undefined, langium_1.NL, `NegativeRequirement: ${(_j = risk.negativeRequirement) === null || _j === void 0 ? void 0 : _j.$refText}`);
        fileNode.appendIf(risk.partOf !== undefined, langium_1.NL, `partOf: ${(_k = risk.partOf) === null || _k === void 0 ? void 0 : _k.$refText}`);
        fileNode.appendIf(risk.refVulnerabilities.length !== 0, langium_1.NL, `Vulnerabilities: ${risk.refVulnerabilities.map(x => x.$refText).join(', ')}`);
        fileNode.appendIf(risk.status !== undefined, langium_1.NL, `Status: ${(_l = risk.status) === null || _l === void 0 ? void 0 : _l.type}`);
        fileNode.appendIf(risk.treatments.length !== 0, langium_1.NL, `Treatments: ${risk.treatments.map((x) => `${x.name} ${x.nameAlias ? ` ${x.nameAlias}` : ''}
              ${x.type ? ` of type ${x.type.type}` : ''}
              ${x.description ? ` described as ${x.description}` : ''}
              ${x.owner ? ` with the owner ${x.owner.$refText}` : ''}
              ${x.solution ? ` with the solution [${x.solution.refs.map((y) => y.$refText).join(' ')}]` : ''}
              `).join(', ')}`);
        fileNode.appendIf(risk.tags.length !== 0, langium_1.NL, `Tags: ${risk.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`);
        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }
    /**
     * Retrieves the content for a given quality requirement.
     *
     * @param qr       The quality requirement to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getQRContent(qr, fileNode) {
        var _a, _b, _c, _d, _e, _f;
        const type = (0, ast_1.isQRTypeOriginal)(qr.type) ? qr.type.type : qr.type.type.$refText;
        let subType = '';
        if (qr.subType) {
            subType = (0, ast_1.isQRSubTypeOriginal)(qr.subType)
                ? qr.subType.type
                : qr.subType.type.$refText;
        }
        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(qr.nameAlias !== undefined, `${qr.nameAlias} `);
        fileNode.append(`(${qr.name}) is a ${qr.subType ? subType : type}`);
        fileNode.appendIf(qr.description !== undefined, `, described as ${qr.description}`);
        fileNode.append('.');
        fileNode.appendIf(qr.acceptanceCriteria.length !== 0, langium_1.NL, `AcceptanceCriteria: ${qr.acceptanceCriteria.map((x) => x.name).join(', ')}`);
        fileNode.appendIf(qr.isAbstract, langium_1.NL, `IsAbstract`);
        fileNode.appendIf(qr.isConcrete, langium_1.NL, `IsConcrete`);
        fileNode.appendIf(qr.isNegative, langium_1.NL, `IsNegative`);
        fileNode.appendIf(qr.isPositive, langium_1.NL, `IsPositive`);
        fileNode.appendIf(qr.isProblem, langium_1.NL, `IsProblem`);
        fileNode.appendIf(qr.isSolution, langium_1.NL, `IsSolution`);
        fileNode.appendIf(qr.tags.length !== 0, langium_1.NL, `Tags: ${qr.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`);
        fileNode.appendIf(qr.expression !== undefined, langium_1.NL, `Expression: ${(_a = qr.expression) === null || _a === void 0 ? void 0 : _a.metric.type} ${(_b = qr.expression) === null || _b === void 0 ? void 0 : _b.operator.value} ${(_c = qr.expression) === null || _c === void 0 ? void 0 : _c.value}`);
        fileNode.appendIf(qr.partOf !== undefined, langium_1.NL, `PartOf: ${(_d = qr.partOf) === null || _d === void 0 ? void 0 : _d.$refText}`);
        fileNode.appendIf(qr.priority !== undefined, langium_1.NL, `Priority: ${(_e = qr.priority) === null || _e === void 0 ? void 0 : _e.type}`);
        fileNode.appendIf(qr.stakeholder !== undefined, langium_1.NL, `Stakeholder: ${(_f = qr.stakeholder) === null || _f === void 0 ? void 0 : _f.$refText}`);
        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }
    /**
     * Retrieves the content for a given goal.
     *
     * @param goal     The goal to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getGoalContent(goal, fileNode) {
        var _a, _b, _c;
        const type = (0, ast_1.isGoalTypeOriginal)(goal.type)
            ? goal.type.type
            : goal.type.type.$refText;
        let subType = '';
        if (goal.subType) {
            subType = (0, ast_1.isGoalSubTypeOriginal)(goal.subType)
                ? goal.subType.type
                : goal.subType.type.$refText;
        }
        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(goal.nameAlias !== undefined, `${goal.nameAlias} `);
        fileNode.append(`(${goal.name}) is a ${goal.subType ? subType : type}`);
        fileNode.appendIf(goal.description !== undefined, `, described as ${goal.description}`);
        fileNode.append('.');
        fileNode.appendIf(goal.acceptanceCriteria.length !== 0, langium_1.NL, `AcceptanceCriteria: ${goal.acceptanceCriteria.map((x) => x.name).join(', ')}`);
        fileNode.appendIf(goal.isAbstract, langium_1.NL, `IsAbstract`);
        fileNode.appendIf(goal.isConcrete, langium_1.NL, `IsConcrete`);
        fileNode.appendIf(goal.isNegative, langium_1.NL, `IsNegative`);
        fileNode.appendIf(goal.isPositive, langium_1.NL, `IsPositive`);
        fileNode.appendIf(goal.isProblem, langium_1.NL, `IsProblem`);
        fileNode.appendIf(goal.isSolution, langium_1.NL, `IsSolution`);
        fileNode.appendIf(goal.tags.length !== 0, langium_1.NL, `Tags: ${goal.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`);
        fileNode.appendIf(goal.partOf !== undefined, langium_1.NL, `PartOf: ${(_a = goal.partOf) === null || _a === void 0 ? void 0 : _a.$refText}`);
        fileNode.appendIf(goal.priority !== undefined, langium_1.NL, `Priority: ${(_b = goal.priority) === null || _b === void 0 ? void 0 : _b.type}`);
        fileNode.appendIf(goal.stakeholder !== undefined, langium_1.NL, `Stakeholder: ${(_c = goal.stakeholder) === null || _c === void 0 ? void 0 : _c.$refText}`);
        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }
    /**
     * Retrieves the content for a given glossary term.
     *
     * @param term     The glossary term to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getTermContent(term, fileNode) {
        var _a, _b, _c;
        const type = (0, ast_1.isGlossaryTermTypeOriginal)(term.type)
            ? term.type.type
            : term.type.type.$refText;
        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(term.nameAlias !== undefined, `${term.nameAlias} `);
        fileNode.append(`(${term.name}) is a ${type}`);
        fileNode.appendIf(term.description !== undefined, `, described as ${term.description}`);
        fileNode.append('.');
        fileNode.appendIf(term.acronym !== undefined, langium_1.NL, `Acronym: ${term.acronym}`);
        fileNode.appendIf(term.applicableTo !== undefined, langium_1.NL, `Applicable To: ${(_a = term.applicableTo) === null || _a === void 0 ? void 0 : _a.refs.map((y) => y.type).join(', ')}`);
        fileNode.appendIf(term.tags.length !== 0, langium_1.NL, `Tags: ${term.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`);
        fileNode.appendIf(term.partOf !== undefined, langium_1.NL, `PartOf: ${(_b = term.partOf) === null || _b === void 0 ? void 0 : _b.$refText}`);
        fileNode.appendIf(term.super !== undefined, langium_1.NL, `Super: ${(_c = term.super) === null || _c === void 0 ? void 0 : _c.$refText}`);
        fileNode.appendIf(term.synonyms.length !== 0, langium_1.NL, `Synonyms: ${term.synonyms.join(', ')}`);
        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }
    /**
     * Retrieves the content for a given functional requirement.
     *
     * @param fr       The functional requirement to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getFRContent(fr, fileNode) {
        var _a, _b, _c;
        const type = (0, ast_1.isFRTypeOriginal)(fr.type) ? fr.type.type : fr.type.type.$refText;
        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(fr.nameAlias !== undefined, `${fr.nameAlias} `);
        fileNode.append(`(${fr.name}) is a ${type}`);
        fileNode.appendIf(fr.description !== undefined, `, described as ${fr.description}`);
        fileNode.append('.');
        fileNode.appendIf(fr.acceptanceCriteria.length !== 0, langium_1.NL, `AcceptanceCriteria: ${fr.acceptanceCriteria.map((x) => x.name).join(', ')}`);
        fileNode.appendIf(fr.isAbstract, langium_1.NL, `IsAbstract`);
        fileNode.appendIf(fr.isConcrete, langium_1.NL, `IsConcrete`);
        fileNode.appendIf(fr.isNegative, langium_1.NL, `IsNegative`);
        fileNode.appendIf(fr.isPositive, langium_1.NL, `IsPositive`);
        fileNode.appendIf(fr.isProblem, langium_1.NL, `IsProblem`);
        fileNode.appendIf(fr.isSolution, langium_1.NL, `IsSolution`);
        fileNode.appendIf(fr.tags.length !== 0, langium_1.NL, `Tags: ${fr.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`);
        fileNode.appendIf(fr.partOf !== undefined, langium_1.NL, `PartOf: ${(_a = fr.partOf) === null || _a === void 0 ? void 0 : _a.$refText}`);
        fileNode.appendIf(fr.priority !== undefined, langium_1.NL, `Priority: ${(_b = fr.priority) === null || _b === void 0 ? void 0 : _b.type}`);
        fileNode.appendIf(fr.stakeholder !== undefined, langium_1.NL, `Stakeholder: ${(_c = fr.stakeholder) === null || _c === void 0 ? void 0 : _c.$refText}`);
        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }
    /**
     * Retrieves the content for a given flow.
     *
     * @param flow     The flow to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getFlowContent(flow, fileNode) {
        var _a, _b;
        const type = (0, ast_1.isActiveFlowTypeOriginal)(flow.type)
            ? flow.type.type
            : flow.type.type.$refText;
        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(flow.nameAlias !== undefined, `${flow.nameAlias} `);
        fileNode.append(`(${flow.name}) is a ${type} flow with ${((_a = flow.activeElements) === null || _a === void 0 ? void 0 : _a.refActiveElement) ? `[${(_b = flow.activeElements) === null || _b === void 0 ? void 0 : _b.refActiveElement.map((y) => y.$refText).join(' ')}]` : ''}`);
        fileNode.appendIf(flow.description !== undefined, `, described as ${flow.description}`);
        fileNode.append('.');
        fileNode.appendIf(flow.condition !== undefined, langium_1.NL, `${flow.condition}`);
        fileNode.appendIf(flow.tags.length !== 0, langium_1.NL, `Tags: ${flow.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`);
        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }
    /**
     * Retrieves the content for a given task.
     *
     * @param task     The task to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getTaskContent(task, fileNode) {
        var _a, _b, _c;
        const type = (0, ast_1.isActiveTaskTypeOriginal)(task.type)
            ? task.type.type
            : task.type.type.$refText;
        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(task.nameAlias !== undefined, `${task.nameAlias} `);
        fileNode.append(`(${task.name}) is a ${type} task`);
        fileNode.appendIf(task.description !== undefined, `, described as ${task.description}`);
        if (task.participant) {
            if (task.type.type === 'Send') {
                fileNode.append(`, sent by ${task.participant.$refText} to ${(_a = task.participantTarget) === null || _a === void 0 ? void 0 : _a.$refText}`);
            }
            else if (task.type.type === 'Receive') {
                fileNode.append(`, received by ${task.participant.$refText} from ${(_b = task.participantTarget) === null || _b === void 0 ? void 0 : _b.$refText}`);
            }
            else {
                fileNode.append(`, performed by ${task.participant.$refText}`);
            }
            fileNode.append('.');
        }
        fileNode.appendIf(task.partOf !== undefined, langium_1.NL, `PartOf: ${(_c = task.partOf) === null || _c === void 0 ? void 0 : _c.$refText}`);
        fileNode.appendIf(task.tags.length !== 0, langium_1.NL, `Tags: ${task.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`);
        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }
    /**
     * Retrieves the content for a given event.
     *
     * @param event    The event to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getEventContent(event, fileNode) {
        var _a;
        const type = (0, ast_1.isActiveEventTypeOriginal)(event.type)
            ? event.type.type
            : event.type.type.$refText;
        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(event.nameAlias !== undefined, `${event.nameAlias} `);
        fileNode.append(`(${event.name}) is a ${type} event`);
        fileNode.appendIf(event.description !== undefined, `, described as ${event.description}`);
        fileNode.appendIf(event.stakeholder !== undefined, `, occurs in the scope of ${(_a = event.stakeholder) === null || _a === void 0 ? void 0 : _a.$refText}`);
        fileNode.append('.');
        fileNode.appendIf(event.isCatch, langium_1.NL, `IsCatch`);
        fileNode.appendIf(event.isFinal, langium_1.NL, `IsFinal`);
        fileNode.appendIf(event.isInitial, langium_1.NL, `IsInitial`);
        fileNode.appendIf(event.isThrow, langium_1.NL, `IsThrow`);
        fileNode.appendIf(event.tags.length !== 0, langium_1.NL, `Tags: ${event.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`);
        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }
    /**
     * Retrieves the content for a given actor.
     *
     * @param actor    The actor to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getActorContent(actor, fileNode) {
        var _a, _b;
        const type = (0, ast_1.isActorTypeOriginal)(actor.type)
            ? actor.type.type
            : actor.type.type.$refText;
        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(actor.nameAlias !== undefined, `${actor.nameAlias} `);
        fileNode.append(`(${actor.name}) is a ${type}`);
        fileNode.appendIf(actor.description !== undefined, `, described as ${actor.description}`);
        fileNode.append('.');
        fileNode.appendIf(actor.super !== undefined, langium_1.NL, `Super: ${(_a = actor.super) === null || _a === void 0 ? void 0 : _a.$refText}`);
        fileNode.appendIf(actor.stakeholder !== undefined, langium_1.NL, `Stakeholder: ${(_b = actor.stakeholder) === null || _b === void 0 ? void 0 : _b.$refText}`);
        fileNode.appendIf(actor.tags.length !== 0, langium_1.NL, `Tags: ${actor.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`);
        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }
    /**
     * Retrieves the content for a given stakeholder.
     *
     * @param stakeholder The stakeholder to be processed.
     * @param fileNode    Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getStakeholderContent(stakeholder, fileNode) {
        var _a, _b;
        const type = (0, ast_1.isStakeholderTypeOriginal)(stakeholder.type)
            ? stakeholder.type.type
            : stakeholder.type.type.$refText;
        let subType = '';
        if (stakeholder.subType) {
            subType = (0, ast_1.isStakeholderSubTypeOriginal)(stakeholder.subType)
                ? stakeholder.subType.type
                : stakeholder.subType.type.$refText;
        }
        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(stakeholder.nameAlias !== undefined, `${stakeholder.nameAlias} `);
        fileNode.append(`(${stakeholder.name}) is a ${stakeholder.subType ? subType : type}`);
        fileNode.appendIf(stakeholder.description !== undefined, `, described as ${stakeholder.description}`);
        fileNode.append('.');
        fileNode.appendIf(stakeholder.super !== undefined, langium_1.NL, `Super: ${(_a = stakeholder.super) === null || _a === void 0 ? void 0 : _a.$refText}`);
        fileNode.appendIf(stakeholder.partOf !== undefined, langium_1.NL, `PartOf: ${(_b = stakeholder.partOf) === null || _b === void 0 ? void 0 : _b.$refText}`);
        fileNode.appendIf(stakeholder.tags.length !== 0, langium_1.NL, `Tags: ${stakeholder.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`);
        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }
}
exports.RsltextGenerator = RsltextGenerator;
//# sourceMappingURL=rsl-text-generator.js.map