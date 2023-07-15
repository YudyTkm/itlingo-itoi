import { CompositeGeneratorNode, EOL, NL, toString } from 'langium';
import {
    ActionTypeExtendedRef,
    ActionTypeOriginal,
    ActiveEvent,
    ActiveEventTypeExtendedRef,
    ActiveEventTypeOriginal,
    ActiveFlow,
    ActiveFlowTypeExtendedRef,
    ActiveFlowTypeOriginal,
    ActiveTask,
    ActiveTaskTypeExtendedRef,
    ActiveTaskTypeOriginal,
    Actor,
    ActorTypeExtendedRef,
    ActorTypeOriginal,
    FR,
    FRTypeExtendedRef,
    FRTypeOriginal,
    GlossaryTerm,
    GlossaryTermTypeExtendedRef,
    GlossaryTermTypeOriginal,
    Goal,
    GoalSubTypeExtendedRef,
    GoalSubTypeOriginal,
    GoalTypeExtendedRef,
    GoalTypeOriginal,
    QR,
    QRSubTypeExtendedRef,
    QRSubTypeOriginal,
    QRTypeExtendedRef,
    QRTypeOriginal,
    Risk,
    RiskSubTypeExtendedRef,
    RiskSubTypeOriginal,
    RiskTypeExtendedRef,
    RiskTypeOriginal,
    Stakeholder,
    StakeholderSubTypeExtendedRef,
    StakeholderSubTypeOriginal,
    StakeholderTypeExtendedRef,
    StakeholderTypeOriginal,
    StateMachine,
    StateMachineTypeExtendedRef,
    StateMachineTypeOriginal,
    UseCase,
    UseCaseTypeExtendedRef,
    UseCaseTypeOriginal,
    UserStory,
    UserStoryTypeExtendedRef,
    UserStoryTypeOriginal,
    Vulnerability,
    VulnerabilitySubTypeExtendedRef,
    VulnerabilitySubTypeOriginal,
    VulnerabilityTypeExtendedRef,
    VulnerabilityTypeOriginal,
    isActionTypeOriginal,
    isActiveEventTypeOriginal,
    isActiveFlowTypeOriginal,
    isActiveTaskTypeOriginal,
    isActorTypeOriginal,
    isFRTypeOriginal,
    isGlossaryTermTypeOriginal,
    isGoalSubTypeOriginal,
    isGoalTypeOriginal,
    isQRSubTypeOriginal,
    isQRTypeOriginal,
    isRiskSubTypeOriginal,
    isRiskTypeOriginal,
    isStakeholderSubTypeOriginal,
    isStakeholderTypeOriginal,
    isStateMachineTypeOriginal,
    isUseCaseTypeOriginal,
    isUserStoryTypeOriginal,
    isVulnerabilitySubTypeOriginal,
    isVulnerabilityTypeOriginal,
} from '../language-server/generated/ast';
import { RslGenerator } from './rsl-generator';
import {
    getGlossaryTerms,
    getStakeholders,
    getActors,
    getActiveEvents,
    getActiveTasks,
    getActiveFlows,
    getFRs,
    getGoals,
    getQRs,
    getRisks,
    getVulnerabilities,
    getStateMachines,
    getUseCases,
    getUserStories,
} from '../util/rsl-utilities';

/**
 * Represents a plain text generator for RSL.
 */
export class RsltextGenerator extends RslGenerator {
    /**
     * Gets the file extension associated with the generator.
     *
     * @returns The file extension.
     */
    public override getFileExtension(): string {
        return '.txt';
    }

    /**
     * Generates the content of the plain text file based on the RSL model.
     *
     * @returns The generated text content as a Buffer.
     */
    public override generate(): Buffer {
        const fileNode = new CompositeGeneratorNode();

        for (const packageSystem of this.model.packages) {
            const system = packageSystem.system;
            if (!system) {
                continue;
            }

            fileNode.append(`System: ${system.name}`);
            fileNode.appendIf(system.nameAlias !== undefined, ` (${system.nameAlias})`);
            fileNode.appendIf(system.isReusable, NL, `isReusable`);
            fileNode.appendIf(system.isFinal, NL, `isFinal`);
            fileNode.appendNewLine();

            fileNode.append('----------------------------------------');
            fileNode.appendIf(system.vendor !== undefined, ` Vendor: ${system.vendor} `);
            fileNode.appendIf(system.version !== undefined, NL, `Version: ${system.version}`);
            fileNode.appendIf(system.description !== undefined, NL, `${system.description}`);
            fileNode.appendNewLine();

            const terms = getGlossaryTerms(system);
            if (terms.length > 0) {
                fileNode.append(NL, `#Terms`, NL);
                fileNode.append(`----------------------------------------`, NL);
                terms.forEach((x) => this.getTermContent(x, fileNode));
            }

            const stakeholders = getStakeholders(system);
            if (stakeholders.length > 0) {
                fileNode.append(NL, `#Stakeholders`, NL);
                fileNode.append(`----------------------------------------`, NL);
                stakeholders.forEach((x) => this.getStakeholderContent(x, fileNode));
            }

            const actors = getActors(system);
            if (actors.length > 0) {
                fileNode.append(NL, `#Actors`, NL);
                fileNode.append(`----------------------------------------`, NL);
                actors.forEach((x) => this.getActorContent(x, fileNode));
            }

            const events = getActiveEvents(system);
            if (events.length > 0) {
                fileNode.append(NL, `#Events`, NL);
                fileNode.append(`----------------------------------------`, NL);
                events.forEach((x) => this.getEventContent(x, fileNode));
            }

            const tasks = getActiveTasks(system);
            if (tasks.length > 0) {
                fileNode.append(NL, `#Tasks`, NL);
                fileNode.append(`----------------------------------------`, NL);
                tasks.forEach((x) => this.getTaskContent(x, fileNode));
            }

            const flows = getActiveFlows(system);
            if (flows.length > 0) {
                fileNode.append(NL, `#Flows`, NL);
                fileNode.append(`----------------------------------------`, NL);
                flows.forEach((x) => this.getFlowContent(x, fileNode));
            }

            const frs = getFRs(system);
            if (frs.length > 0) {
                fileNode.append(NL, `#FRs`, NL);
                fileNode.append(`----------------------------------------`, NL);
                frs.forEach((x) => this.getFRContent(x, fileNode));
            }

            const goals = getGoals(system);
            if (goals.length > 0) {
                fileNode.append(NL, `#Goals`, NL);
                fileNode.append(`----------------------------------------`, NL);
                goals.forEach((x) => this.getGoalContent(x, fileNode));
            }

            const qrs = getQRs(system);
            if (qrs.length > 0) {
                fileNode.append(NL, `#QRs`, NL);
                fileNode.append(`----------------------------------------`, NL);
                qrs.forEach((x) => this.getQRContent(x, fileNode));
            }

            const risks = getRisks(system);
            if (risks.length > 0) {
                fileNode.append(NL, `#Risks`, NL);
                fileNode.append(`----------------------------------------`, NL);
                risks.forEach((x) => this.getRiskContent(x, fileNode));
            }

            const vulnerabilities = getVulnerabilities(system);
            if (vulnerabilities.length > 0) {
                fileNode.append(NL, `#Vulnerabilities`, NL);
                fileNode.append(`----------------------------------------`, NL);
                vulnerabilities.forEach((x) => this.getVulnerabilityContent(x, fileNode));
            }

            const stateMachines = getStateMachines(system);
            if (stateMachines.length > 0) {
                fileNode.append(NL, `#StateMachines`, NL);
                fileNode.append(`----------------------------------------`, NL);
                stateMachines.forEach((x) => this.getStateMachineContent(x, fileNode));
            }

            const useCases = getUseCases(system);
            if (useCases.length > 0) {
                fileNode.append(NL, `#UseCases`, NL);
                fileNode.append(`----------------------------------------`, NL);
                useCases.forEach((x) => this.getUseCasesContent(x, fileNode));
            }

            const useStories = getUserStories(system);
            if (useStories.length > 0) {
                fileNode.append(NL, `#UserStories`, NL);
                fileNode.append(`----------------------------------------`, NL);
                useStories.forEach((x) => this.getUserStoryContent(x, fileNode));
            }
        }

        return Buffer.from(toString(fileNode));
    }

    /**
     * Retrieves the content for a given vulnerability.
     *
     * @param vulnerability The vulnerability to be processed.
     * @param fileNode      Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getVulnerabilityContent(vulnerability: Vulnerability, fileNode: CompositeGeneratorNode): void {
        const type = isVulnerabilityTypeOriginal(vulnerability.type)
            ? (vulnerability.type as VulnerabilityTypeOriginal).type
            : (vulnerability.type as VulnerabilityTypeExtendedRef).type.$refText;

        let subType: string = '';
        if (vulnerability.subType) {
            subType = isVulnerabilitySubTypeOriginal(vulnerability.subType)
                ? (vulnerability.subType as VulnerabilitySubTypeOriginal).type
                : (vulnerability.subType as VulnerabilitySubTypeExtendedRef).type.$refText;
        }

        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(vulnerability.nameAlias !== undefined, `${vulnerability.nameAlias} `);
        fileNode.append(`(${vulnerability.name}) is a ${vulnerability.subType ? subType : type}`);

        fileNode.appendIf(vulnerability.description !== undefined, `, described as ${vulnerability.description}`);
        fileNode.append('.');

        fileNode.appendIf(
            vulnerability.tags.length !== 0,
            NL,
            `Tags: ${vulnerability.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`
        );

        fileNode.appendIf(vulnerability.attack !== undefined, NL, `Attack: ${vulnerability.attack}`);
        fileNode.appendIf(vulnerability.attackVector !== undefined, NL, `AttackVector: ${vulnerability.attackVector}`);
        fileNode.appendIf(vulnerability.score !== undefined, NL, `Score: ${vulnerability.score}`);
        fileNode.appendIf(
            vulnerability.solution !== undefined && vulnerability.solution.refs.length !== 0,
            NL,
            `Solution: ${vulnerability.solution?.refs.map((x) => x.$refText).join(', ')}`
        );

        fileNode.appendIf(vulnerability.partOf !== undefined, NL, `PartOf: ${vulnerability.partOf?.$refText}`);
        fileNode.appendIf(vulnerability.super !== undefined, NL, `Super: ${vulnerability.super?.$refText}`);

        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }

    /**
     * Retrieves the content for a given user story.
     *
     * @param userStory The user story to be processed.
     * @param fileNode  Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getUserStoryContent(userStory: UserStory, fileNode: CompositeGeneratorNode): void {
        const type = isUserStoryTypeOriginal(userStory.type)
            ? (userStory.type as UserStoryTypeOriginal).type
            : (userStory.type as UserStoryTypeExtendedRef).type.$refText;

        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(userStory.nameAlias !== undefined, `${userStory.nameAlias} `);
        fileNode.append(`(${userStory.name}) is a ${type}`);
        fileNode.appendIf(userStory.description !== undefined, `, described as ${userStory.description}`);
        fileNode.append('.');

        fileNode.appendIf(
            userStory.acceptanceCriteria.length !== 0,
            NL,
            `AcceptanceCriteria: ${userStory.acceptanceCriteria.map((x) => x.name).join(', ')}`
        );

        fileNode.appendIf(userStory.actor !== undefined, NL, `Actor: ${userStory.actor}`);
        fileNode.appendIf(userStory.goal !== undefined, NL, `Goal: ${userStory.goal}`);
        fileNode.appendIf(userStory.isAbstract, NL, `IsAbstract`);
        fileNode.appendIf(userStory.isConcrete, NL, `IsConcrete`);
        fileNode.appendIf(userStory.isNegative, NL, `IsNegative`);
        fileNode.appendIf(userStory.isPositive, NL, `IsPositive`);
        fileNode.appendIf(userStory.isProblem, NL, `IsProblem`);
        fileNode.appendIf(userStory.isSolution, NL, `IsSolution`);
        fileNode.appendIf(userStory.otherRole !== undefined, NL, `OtherRole: ${userStory.otherRole}`);
        fileNode.appendIf(userStory.priority !== undefined, NL, `Priority: ${userStory.priority?.type}`);
        fileNode.appendIf(userStory.reason !== undefined, NL, `Reason: ${userStory.reason}`);
        fileNode.appendIf(userStory.stakeholder !== undefined, NL, `Stakeholder: ${userStory.stakeholder?.$refText}`);
        fileNode.appendIf(userStory.goal !== undefined, NL, `Goal: ${userStory.goal}`);
        fileNode.appendIf(userStory.partOf !== undefined, NL, `PartOf: ${userStory.partOf?.$refText}`);

        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }

    /**
     * Retrieves the content for a given use case.
     *
     * @param useCase  The use case to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getUseCasesContent(useCase: UseCase, fileNode: CompositeGeneratorNode): void {
        const type = isUseCaseTypeOriginal(useCase.type)
            ? (useCase.type as UseCaseTypeOriginal).type
            : (useCase.type as UseCaseTypeExtendedRef).type.$refText;

        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(useCase.nameAlias !== undefined, `${useCase.nameAlias} `);
        fileNode.append(`(${useCase.name}) is a ${type}`);
        fileNode.appendIf(useCase.description !== undefined, `, described as ${useCase.description}`);
        fileNode.append('.');

        fileNode.appendIf(
            useCase.acceptanceCriteria.length !== 0,
            NL,
            `AcceptanceCriteria: ${useCase.acceptanceCriteria.map((x) => x.name).join(', ')}`
        );

        fileNode.appendIf(
            useCase.tags.length !== 0,
            NL,
            `Tags: ${useCase.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`
        );

        fileNode.appendIf(
            useCase.actions !== undefined,
            NL,
            `Actions: ${useCase.actions?.actions.map((x) => (isActionTypeOriginal(x) ? (x as ActionTypeOriginal).type : (x as ActionTypeExtendedRef).type.$refText)).join(', ')}`);

        fileNode.appendIf(useCase.dataEntity !== undefined, NL, `DataEntity: ${useCase.dataEntity?.$refText}`);
        fileNode.appendIf(
            useCase.extends.length !== 0,
            NL,
            `Extends: ${useCase.extends.map((x) => `${x.extensionPoint.$refText} of use case ${x.usecase.$refText}`).join(', ')}`
        );
        fileNode.appendIf(
            useCase.extensionPoints !== undefined && useCase.extensionPoints.extensionPoints.length !== 0,
            NL,
            `ExtensionPoints: ${useCase.extensionPoints?.extensionPoints.map(
                (x) => `${x.name}${x.description ? ' described as ' : ''}`
            ).join(', ')}`
        );

        fileNode.appendIf(
            useCase.includes !== undefined && useCase.includes.includes.length !== 0,
            NL,
            `Includes: ${useCase.includes?.includes.map((x) => `[${x.refs.map((y) => y.$refText).join(' ')}]`).join(', ')}`
        );

        fileNode.appendIf(useCase.isAbstract, NL, `IsAbstract`);
        fileNode.appendIf(useCase.isConcrete, NL, `IsConcrete`);
        fileNode.appendIf(useCase.isNegative, NL, `IsNegative`);
        fileNode.appendIf(useCase.isPositive, NL, `IsPositive`);
        fileNode.appendIf(useCase.isProblem, NL, `IsProblem`);
        fileNode.appendIf(useCase.isSolution, NL, `IsSolution`);

        fileNode.appendIf(
            useCase.mainScenarios.length !== 0,
            NL,
            `MainScenarios: ${useCase.mainScenarios.map((x) => x.name).join(', ')}`
        );
        fileNode.appendIf(useCase.precondition !== undefined, NL, `PreCondition: ${useCase.precondition}`);
        fileNode.appendIf(useCase.postcondition !== undefined, NL, `PostCondition: ${useCase.postcondition}`);
        fileNode.appendIf(useCase.primaryActor !== undefined, NL, `PrimaryActor: ${useCase.primaryActor?.$refText}`);
        fileNode.appendIf(useCase.priority !== undefined, NL, `Priority: ${useCase.priority?.type}`);
        fileNode.appendIf(useCase.stakeholder !== undefined, `Stakeholder: ${useCase.stakeholder?.$refText}`);
        fileNode.appendIf(
            useCase.supportingActors.length !== 0,
            NL,
            `Supporting Actors: ${useCase.supportingActors.map((x) => `[${x.refs.map((y) => y.$refText).join(' ')}]`).join(', ')}`
        );

        fileNode.appendIf(useCase.triggeredBy !== undefined, NL, `TriggeredBy: ${useCase.triggeredBy?.$refText}`);

        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }

    /**
     * Retrieves the content for a given state machine.
     *
     * @param stateMachine The state machine to be processed.
     * @param fileNode     Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getStateMachineContent(stateMachine: StateMachine, fileNode: CompositeGeneratorNode): void {
        const type = isStateMachineTypeOriginal(stateMachine.type)
            ? (stateMachine.type as StateMachineTypeOriginal).type
            : (stateMachine.type as StateMachineTypeExtendedRef).type.$refText;

        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(stateMachine.nameAlias !== undefined, `${stateMachine.nameAlias} `);
        fileNode.append(`(${stateMachine.name}) is a ${type}`);
        fileNode.appendIf(stateMachine.description !== undefined, `, described as ${stateMachine.description}`);
        fileNode.append('.');

        fileNode.appendIf(stateMachine.entity !== undefined, NL, `Entity: ${stateMachine.entity?.$refText}`);

        fileNode.appendIf(
            stateMachine.states?.states !== undefined,
            NL,
            `States: ${stateMachine.states?.states.map((x) => `${EOL}${x.name}${x.nameAlias ? ` ${x.nameAlias}` : ''}${x.isInitial ? ` isInitial` : ''}${x.isFinal ? ` isFinal` : ''}${x.onEntry ? ` ${x.onEntry}` : ''}${x.onExit ? ` ${x.onExit}` : ''}${x.transitions.length !== 0 ? `${EOL}${x.transitions.map((y) => `\tuse case ${y.ucAction.useCase.$refText} action ${(isActionTypeOriginal(y.ucAction.action)) ? (y.ucAction.action as ActionTypeOriginal).type : (y.ucAction.action as ActionTypeExtendedRef).type.$refText}${y.nextstate ? ` next state ${y.nextstate.$refText}` : ''}`).join(EOL)}` : ''}`).join()}`);

        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(
            stateMachine.tags.length !== 0,
            NL,
            `Tags: ${stateMachine.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`
        );

        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }

    /**
     * Retrieves the content for a given risk.
     *
     * @param risk     The risk to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getRiskContent(risk: Risk, fileNode: CompositeGeneratorNode): void {
        const type = isRiskTypeOriginal(risk.type)
            ? (risk.type as RiskTypeOriginal).type
            : (risk.type as RiskTypeExtendedRef).type.$refText;

        let subType: string = '';
        if (risk.subType) {
            subType = isRiskSubTypeOriginal(risk.subType)
                ? (risk.subType as RiskSubTypeOriginal).type
                : (risk.subType as RiskSubTypeExtendedRef).type.$refText;
        }

        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(risk.nameAlias !== undefined, `${risk.nameAlias} `);
        fileNode.append(`(${risk.name}) is a ${risk.subType ? subType : type}`);

        fileNode.appendIf(risk.description !== undefined, `, described as ${risk.description}`);
        fileNode.append('.');

        fileNode.appendIf(
            risk.acceptanceCriteria.length !== 0,
            NL,
            `AcceptanceCriteria: ${risk.acceptanceCriteria.map((x) => x.name).join(', ')}`
        );

        fileNode.appendIf(
            risk.assessment !== undefined,
            NL,
            `Assessment:
            ${risk.assessment?.consequence ? ` with consequence ${risk.assessment?.consequence}` : ''}
            ${risk.assessment?.impact ? ` with impact ${risk.assessment?.impact}` : ''}
            ${risk.assessment?.impactLevel ? ` with impact level ${risk.assessment?.impactLevel}` : ''}
            ${risk.assessment?.probability ? ` with probability ${risk.assessment?.probability}` : ''}`);

        fileNode.appendIf(risk.negativeRequirement !== undefined, NL, `NegativeRequirement: ${risk.negativeRequirement?.$refText}`);
        fileNode.appendIf(risk.partOf !== undefined, NL, `partOf: ${risk.partOf?.$refText}`);
        fileNode.appendIf(risk.refVulnerabilities.length !== 0, NL, `Vulnerabilities: ${risk.refVulnerabilities.map(x => x.$refText).join(', ')}`);
        fileNode.appendIf(risk.status !== undefined, NL, `Status: ${risk.status?.type}`);
        fileNode.appendIf(
            risk.treatments.length !== 0,
            NL,
            `Treatments: ${risk.treatments.map((x) => `${x.name} ${x.nameAlias ? ` ${x.nameAlias}` : ''}
              ${x.type ? ` of type ${x.type.type}` : ''}
              ${x.description ? ` described as ${x.description}` : ''}
              ${x.owner ? ` with the owner ${x.owner.$refText}` : ''}
              ${x.solution ? ` with the solution [${x.solution.refs.map((y) => y.$refText).join(' ')}]` : ''}
              `).join(', ')}`);

        fileNode.appendIf(
            risk.tags.length !== 0,
            NL,
            `Tags: ${risk.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`
        );

        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }

    /**
     * Retrieves the content for a given quality requirement.
     *
     * @param qr       The quality requirement to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getQRContent(qr: QR, fileNode: CompositeGeneratorNode): void {
        const type = isQRTypeOriginal(qr.type) ? (qr.type as QRTypeOriginal).type : (qr.type as QRTypeExtendedRef).type.$refText;

        let subType: string = '';
        if (qr.subType) {
            subType = isQRSubTypeOriginal(qr.subType)
                ? (qr.subType as QRSubTypeOriginal).type
                : (qr.subType as QRSubTypeExtendedRef).type.$refText;
        }

        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(qr.nameAlias !== undefined, `${qr.nameAlias} `);
        fileNode.append(`(${qr.name}) is a ${qr.subType ? subType : type}`);
        fileNode.appendIf(qr.description !== undefined, `, described as ${qr.description}`);
        fileNode.append('.');

        fileNode.appendIf(
            qr.acceptanceCriteria.length !== 0,
            NL,
            `AcceptanceCriteria: ${qr.acceptanceCriteria.map((x) => x.name).join(', ')}`
        );

        fileNode.appendIf(qr.isAbstract, NL, `IsAbstract`);
        fileNode.appendIf(qr.isConcrete, NL, `IsConcrete`);
        fileNode.appendIf(qr.isNegative, NL, `IsNegative`);
        fileNode.appendIf(qr.isPositive, NL, `IsPositive`);
        fileNode.appendIf(qr.isProblem, NL, `IsProblem`);
        fileNode.appendIf(qr.isSolution, NL, `IsSolution`);

        fileNode.appendIf(
            qr.tags.length !== 0,
            NL,
            `Tags: ${qr.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`
        );

        fileNode.appendIf(
            qr.expression !== undefined,
            NL,
            `Expression: ${qr.expression?.metric.type} ${qr.expression?.operator.value} ${qr.expression?.value}`);

        fileNode.appendIf(qr.partOf !== undefined, NL, `PartOf: ${qr.partOf?.$refText}`);
        fileNode.appendIf(qr.priority !== undefined, NL, `Priority: ${qr.priority?.type}`);
        fileNode.appendIf(qr.stakeholder !== undefined, NL, `Stakeholder: ${qr.stakeholder?.$refText}`);

        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }

    /**
     * Retrieves the content for a given goal.
     *
     * @param goal     The goal to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getGoalContent(goal: Goal, fileNode: CompositeGeneratorNode): void {
        const type = isGoalTypeOriginal(goal.type)
            ? (goal.type as GoalTypeOriginal).type
            : (goal.type as GoalTypeExtendedRef).type.$refText;

        let subType: string = '';
        if (goal.subType) {
            subType = isGoalSubTypeOriginal(goal.subType)
                ? (goal.subType as GoalSubTypeOriginal).type
                : (goal.subType as GoalSubTypeExtendedRef).type.$refText;
        }

        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(goal.nameAlias !== undefined, `${goal.nameAlias} `);
        fileNode.append(`(${goal.name}) is a ${goal.subType ? subType : type}`);
        fileNode.appendIf(goal.description !== undefined, `, described as ${goal.description}`);
        fileNode.append('.');

        fileNode.appendIf(
            goal.acceptanceCriteria.length !== 0,
            NL,
            `AcceptanceCriteria: ${goal.acceptanceCriteria.map((x) => x.name).join(', ')}`
        );

        fileNode.appendIf(goal.isAbstract, NL, `IsAbstract`);
        fileNode.appendIf(goal.isConcrete, NL, `IsConcrete`);
        fileNode.appendIf(goal.isNegative, NL, `IsNegative`);
        fileNode.appendIf(goal.isPositive, NL, `IsPositive`);
        fileNode.appendIf(goal.isProblem, NL, `IsProblem`);
        fileNode.appendIf(goal.isSolution, NL, `IsSolution`);

        fileNode.appendIf(
            goal.tags.length !== 0,
            NL,
            `Tags: ${goal.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`
        );

        fileNode.appendIf(goal.partOf !== undefined, NL, `PartOf: ${goal.partOf?.$refText}`);
        fileNode.appendIf(goal.priority !== undefined, NL, `Priority: ${goal.priority?.type}`);
        fileNode.appendIf(goal.stakeholder !== undefined, NL, `Stakeholder: ${goal.stakeholder?.$refText}`);

        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }

    /**
     * Retrieves the content for a given glossary term.
     *
     * @param term     The glossary term to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getTermContent(term: GlossaryTerm, fileNode: CompositeGeneratorNode): void {
        const type = isGlossaryTermTypeOriginal(term.type)
            ? (term.type as GlossaryTermTypeOriginal).type
            : (term.type as GlossaryTermTypeExtendedRef).type.$refText;

        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(term.nameAlias !== undefined, `${term.nameAlias} `);
        fileNode.append(`(${term.name}) is a ${type}`);
        fileNode.appendIf(term.description !== undefined, `, described as ${term.description}`);
        fileNode.append('.');

        fileNode.appendIf(term.acronym !== undefined, NL, `Acronym: ${term.acronym}`);
        fileNode.appendIf(term.applicableTo !== undefined, NL, `Applicable To: ${term.applicableTo?.refs.map((y) => y.type).join(', ')}`);
        fileNode.appendIf(
            term.tags.length !== 0,
            NL,
            `Tags: ${term.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`
        );
        fileNode.appendIf(term.partOf !== undefined, NL, `PartOf: ${term.partOf?.$refText}`);
        fileNode.appendIf(term.super !== undefined, NL, `Super: ${term.super?.$refText}`);
        fileNode.appendIf(term.synonyms.length !== 0, NL, `Synonyms: ${term.synonyms.join(', ')}`);

        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }

    /**
     * Retrieves the content for a given functional requirement.
     *
     * @param fr       The functional requirement to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getFRContent(fr: FR, fileNode: CompositeGeneratorNode): void {
        const type = isFRTypeOriginal(fr.type) ? (fr.type as FRTypeOriginal).type : (fr.type as FRTypeExtendedRef).type.$refText;

        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(fr.nameAlias !== undefined, `${fr.nameAlias} `);
        fileNode.append(`(${fr.name}) is a ${type}`);
        fileNode.appendIf(fr.description !== undefined, `, described as ${fr.description}`);
        fileNode.append('.');

        fileNode.appendIf(
            fr.acceptanceCriteria.length !== 0,
            NL,
            `AcceptanceCriteria: ${fr.acceptanceCriteria.map((x) => x.name).join(', ')}`
        );

        fileNode.appendIf(fr.isAbstract, NL, `IsAbstract`);
        fileNode.appendIf(fr.isConcrete, NL, `IsConcrete`);
        fileNode.appendIf(fr.isNegative, NL, `IsNegative`);
        fileNode.appendIf(fr.isPositive, NL, `IsPositive`);
        fileNode.appendIf(fr.isProblem, NL, `IsProblem`);
        fileNode.appendIf(fr.isSolution, NL, `IsSolution`);

        fileNode.appendIf(
            fr.tags.length !== 0,
            NL,
            `Tags: ${fr.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`
        );

        fileNode.appendIf(fr.partOf !== undefined, NL, `PartOf: ${fr.partOf?.$refText}`);
        fileNode.appendIf(fr.priority !== undefined, NL, `Priority: ${fr.priority?.type}`);
        fileNode.appendIf(fr.stakeholder !== undefined, NL, `Stakeholder: ${fr.stakeholder?.$refText}`);

        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }

    /**
     * Retrieves the content for a given flow.
     *
     * @param flow     The flow to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    private getFlowContent(flow: ActiveFlow, fileNode: CompositeGeneratorNode) {
        const type = isActiveFlowTypeOriginal(flow.type)
            ? (flow.type as ActiveFlowTypeOriginal).type
            : (flow.type as ActiveFlowTypeExtendedRef).type.$refText;

        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(flow.nameAlias !== undefined, `${flow.nameAlias} `);
        fileNode.append(`(${flow.name}) is a ${type} flow with ${flow.activeElements?.refActiveElement ? `[${flow.activeElements?.refActiveElement.map((y) => y.$refText).join(' ')}]` : ''}`);
        fileNode.appendIf(flow.description !== undefined, `, described as ${flow.description}`);
        fileNode.append('.');

        fileNode.appendIf(flow.condition !== undefined, NL, `${flow.condition}`);
        fileNode.appendIf(
            flow.tags.length !== 0,
            NL,
            `Tags: ${flow.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`
        );

        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }

    /**
     * Retrieves the content for a given task.
     *
     * @param task     The task to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    private getTaskContent(task: ActiveTask, fileNode: CompositeGeneratorNode) {
        const type = isActiveTaskTypeOriginal(task.type)
            ? (task.type as ActiveTaskTypeOriginal).type
            : (task.type as ActiveTaskTypeExtendedRef).type.$refText;

        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(task.nameAlias !== undefined, `${task.nameAlias} `);
        fileNode.append(`(${task.name}) is a ${type} task`);
        fileNode.appendIf(task.description !== undefined, `, described as ${task.description}`);

        if (task.participant) {
            if (task.type.type === 'Send') {
                fileNode.append(`, sent by ${task.participant.$refText} to ${task.participantTarget?.$refText}`);
            } else if (task.type.type === 'Receive') {
                fileNode.append(`, received by ${task.participant.$refText} from ${task.participantTarget?.$refText}`);
            } else {
                fileNode.append(`, performed by ${task.participant.$refText}`);
            }
            fileNode.append('.');
        }

        fileNode.appendIf(task.partOf !== undefined, NL, `PartOf: ${task.partOf?.$refText}`);
        fileNode.appendIf(
            task.tags.length !== 0,
            NL,
            `Tags: ${task.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`
        );

        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }

    /**
     * Retrieves the content for a given event.
     *
     * @param event    The event to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    private getEventContent(event: ActiveEvent, fileNode: CompositeGeneratorNode) {
        const type = isActiveEventTypeOriginal(event.type)
            ? (event.type as ActiveEventTypeOriginal).type
            : (event.type as ActiveEventTypeExtendedRef).type.$refText;

        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(event.nameAlias !== undefined, `${event.nameAlias} `);
        fileNode.append(`(${event.name}) is a ${type} event`);
        fileNode.appendIf(event.description !== undefined, `, described as ${event.description}`);
        fileNode.appendIf(event.stakeholder !== undefined, `, occurs in the scope of ${event.stakeholder?.$refText}`);
        fileNode.append('.');

        fileNode.appendIf(event.isCatch, NL, `IsCatch`);
        fileNode.appendIf(event.isFinal, NL, `IsFinal`);
        fileNode.appendIf(event.isInitial, NL, `IsInitial`);
        fileNode.appendIf(event.isThrow, NL, `IsThrow`);

        fileNode.appendIf(
            event.tags.length !== 0,
            NL,
            `Tags: ${event.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`
        );

        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }

    /**
     * Retrieves the content for a given actor.
     *
     * @param actor    The actor to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    private getActorContent(actor: Actor, fileNode: CompositeGeneratorNode) {
        const type = isActorTypeOriginal(actor.type)
            ? (actor.type as ActorTypeOriginal).type
            : (actor.type as ActorTypeExtendedRef).type.$refText;

        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(actor.nameAlias !== undefined, `${actor.nameAlias} `);
        fileNode.append(`(${actor.name}) is a ${type}`);
        fileNode.appendIf(actor.description !== undefined, `, described as ${actor.description}`);
        fileNode.append('.');

        fileNode.appendIf(actor.super !== undefined, NL, `Super: ${actor.super?.$refText}`);
        fileNode.appendIf(actor.stakeholder !== undefined, NL, `Stakeholder: ${actor.stakeholder?.$refText}`);
        fileNode.appendIf(
            actor.tags.length !== 0,
            NL,
            `Tags: ${actor.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`
        );

        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }

    /**
     * Retrieves the content for a given stakeholder.
     *
     * @param stakeholder The stakeholder to be processed.
     * @param fileNode    Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    private getStakeholderContent(stakeholder: Stakeholder, fileNode: CompositeGeneratorNode) {
        const type = isStakeholderTypeOriginal(stakeholder.type)
            ? (stakeholder.type as StakeholderTypeOriginal).type
            : (stakeholder.type as StakeholderTypeExtendedRef).type.$refText;

        let subType: string = '';
        if (stakeholder.subType) {
            subType = isStakeholderSubTypeOriginal(stakeholder.subType)
                ? (stakeholder.subType as StakeholderSubTypeOriginal).type
                : (stakeholder.subType as StakeholderSubTypeExtendedRef).type.$refText;
        }

        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(stakeholder.nameAlias !== undefined, `${stakeholder.nameAlias} `);
        fileNode.append(`(${stakeholder.name}) is a ${stakeholder.subType ? subType : type}`);
        fileNode.appendIf(stakeholder.description !== undefined, `, described as ${stakeholder.description}`);
        fileNode.append('.');

        fileNode.appendIf(stakeholder.super !== undefined, NL, `Super: ${stakeholder.super?.$refText}`);
        fileNode.appendIf(stakeholder.partOf !== undefined, NL, `PartOf: ${stakeholder.partOf?.$refText}`);
        fileNode.appendIf(
            stakeholder.tags.length !== 0,
            NL,
            `Tags: ${stakeholder.tags.map((x) => `${x.nameAlias}${x.value ? ` with value: ${x.value}` : ''}`).join(', ')}`
        );

        fileNode.appendNewLine();
        fileNode.appendNewLine();
    }
}
