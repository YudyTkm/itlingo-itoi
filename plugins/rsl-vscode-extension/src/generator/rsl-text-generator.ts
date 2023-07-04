import { CompositeGeneratorNode, NL, toString } from "langium";
import {
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
  Stakeholder,
  StakeholderSubTypeExtendedRef,
  StakeholderSubTypeOriginal,
  StakeholderTypeExtendedRef,
  StakeholderTypeOriginal,
  isActiveEventTypeOriginal,
  isActiveFlowTypeOriginal,
  isActiveTaskTypeOriginal,
  isActorTypeOriginal,
  isStakeholderSubTypeOriginal,
  isStakeholderTypeOriginal,
} from "../language-server/generated/ast";
import {
  getActiveEvents,
  getActiveFlows,
  getActiveTasks,
  getActors,
  getStakeholders,
} from "../util/rsl-utilities";
import { RslGenerator } from "./rsl-generator";

/**
 * Represents a generator for RSLtext files based on the RslGenerator abstract class.
 */
export class RsltextGenerator extends RslGenerator {
  /**
   * Gets the file extension associated with the RSLtext generator.
   *
   * @returns The file extension.
   */
  public override getFileExtension(): string {
    return "txt";
  }

  /**
   * Generates the content of the RSLtext file based on the model.
   *
   * @returns The generated content.
   */
  public override generate(): string {
    const fileNode = new CompositeGeneratorNode();

    for (const packageSystem of this.model.packages) {
      const system = packageSystem.system;
      if (!system) {
        continue;
      }

      fileNode.append(`System: ${system.name}`);
      fileNode.appendIf(
        system.nameAlias !== undefined,
        ` (${system.nameAlias})`
      );
      fileNode.appendIf(system.isReusable, NL, `isReusable`);
      fileNode.appendIf(system.isFinal, NL, `isFinal`);
      fileNode.appendNewLine();

      fileNode.append("----------------------------------------");
      fileNode.appendIf(
        system.vendor !== undefined,
        ` Vendor: ${system.vendor} `
      );
      fileNode.appendIf(
        system.version !== undefined,
        NL,
        `Version: ${system.version}`
      );
      fileNode.appendIf(
        system.description !== undefined,
        NL,
        `${system.description}`
      );
      fileNode.appendNewLine();

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
    }

    return toString(fileNode);
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
    fileNode.appendIf(flow.nameAlias !== undefined, ` (${flow.nameAlias})`);
    fileNode.append(
      `${flow.name} is a ${type} flow with ${flow.activeElements?.refActiveElement}`
    );
    fileNode.append(".");
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
    fileNode.appendIf(task.nameAlias !== undefined, ` (${task.nameAlias})`);

    fileNode.append(` ${task.name} is a ${type} task`);
    if (task.participant) {
      if (task.type.type === "Send") {
        fileNode.append(
          `, sent by ${task.participant.$refText} to ${task.participantTarget?.$refText}`
        );
      } else if (task.type.type === "Receive") {
        fileNode.append(
          `, received by ${task.participant.$refText} from ${task.participantTarget?.$refText}`
        );
      } else {
        fileNode.append(`, performed by ${task.participant.$refText}`);
      }
      fileNode.append(".");
      fileNode.appendNewLine();
    }
  }

  /**
   * Retrieves the content for a given event.
   *
   * @param event    The event to be processed.
   * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
   */
  private getEventContent(
    event: ActiveEvent,
    fileNode: CompositeGeneratorNode
  ) {
    const type = isActiveEventTypeOriginal(event.type)
      ? (event.type as ActiveEventTypeOriginal).type
      : (event.type as ActiveEventTypeExtendedRef).type.$refText;

    fileNode.appendNewLineIfNotEmpty();
    fileNode.appendIf(event.nameAlias !== undefined, ` (${event.nameAlias})`);
    fileNode.append(` (${event.name}) is a ${type} event`);
    fileNode.appendIf(
      event.stakeholder !== undefined,
      `, occurs in the scope of ${event.stakeholder?.$refText}`
    );
    fileNode.append(".");
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

    fileNode.appendIf(actor.nameAlias !== undefined, actor.nameAlias);
    fileNode.append(` (${actor.name}) is a ${type}`);
    fileNode.appendIf(
      actor.description !== undefined,
      `, described as ${actor.description}`
    );
    fileNode.append(".");
    fileNode.appendNewLine();
  }

  /**
   * Retrieves the content for a given stakeholder.
   *
   * @param stakeholder The stakeholder to be processed.
   * @param fileNode    Implementation of {@link GeneratorNode} serving as container for `string` segments.
   */
  private getStakeholderContent(
    stakeholder: Stakeholder,
    fileNode: CompositeGeneratorNode
  ) {
    const type = isStakeholderTypeOriginal(stakeholder.type)
      ? (stakeholder.type as StakeholderTypeOriginal).type
      : (stakeholder.type as StakeholderTypeExtendedRef).type.$refText;

    fileNode.appendNewLineIfNotEmpty();
    let subType: string = "";
    if (stakeholder.subType) {
      subType = isStakeholderSubTypeOriginal(stakeholder.subType)
        ? (stakeholder.subType as StakeholderSubTypeOriginal).type
        : (stakeholder.subType as StakeholderSubTypeExtendedRef).type.$refText;

      fileNode.append(subType);
      fileNode.appendNewLine();
    }

    fileNode.appendIf(
      stakeholder.nameAlias !== undefined,
      ` ${stakeholder.nameAlias} `
    );
    fileNode.append(` (${stakeholder.name}) is a `);
    if (stakeholder.subType) {
      fileNode.append(subType);
    } else {
      fileNode.append(type);
    }

    fileNode.appendIf(
      stakeholder.description !== undefined,
      `, described as ${stakeholder.description}`
    );
    fileNode.append(".");
    fileNode.appendNewLine();
  }
}
