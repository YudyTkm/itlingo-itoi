"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RsltextGenerator = void 0;
const langium_1 = require("langium");
const ast_1 = require("../language-server/generated/ast");
const rsl_utilities_1 = require("../util/rsl-utilities");
const rsl_generator_1 = require("./rsl-generator");
/**
 * Represents a generator for RSLtext files based on the RslGenerator abstract class.
 */
class RsltextGenerator extends rsl_generator_1.RslGenerator {
    /**
     * Gets the file extension associated with the RSLtext generator.
     *
     * @returns The file extension.
     */
    getFileExtension() {
        return "txt";
    }
    /**
     * Generates the content of the RSLtext file based on the model.
     *
     * @returns The generated content.
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
            fileNode.append("----------------------------------------");
            fileNode.appendIf(system.vendor !== undefined, ` Vendor: ${system.vendor} `);
            fileNode.appendIf(system.version !== undefined, langium_1.NL, `Version: ${system.version}`);
            fileNode.appendIf(system.description !== undefined, langium_1.NL, `${system.description}`);
            fileNode.appendNewLine();
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
        }
        return (0, langium_1.toString)(fileNode);
    }
    /**
     * Retrieves the content for a given flow.
     *
     * @param flow     The flow to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getFlowContent(flow, fileNode) {
        var _a;
        const type = (0, ast_1.isActiveFlowTypeOriginal)(flow.type)
            ? flow.type.type
            : flow.type.type.$refText;
        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(flow.nameAlias !== undefined, ` (${flow.nameAlias})`);
        fileNode.append(`${flow.name} is a ${type} flow with ${(_a = flow.activeElements) === null || _a === void 0 ? void 0 : _a.refActiveElement}`);
        fileNode.append(".");
        fileNode.appendNewLine();
    }
    /**
     * Retrieves the content for a given task.
     *
     * @param task     The task to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getTaskContent(task, fileNode) {
        var _a, _b;
        const type = (0, ast_1.isActiveTaskTypeOriginal)(task.type)
            ? task.type.type
            : task.type.type.$refText;
        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(task.nameAlias !== undefined, ` (${task.nameAlias})`);
        fileNode.append(` ${task.name} is a ${type} task`);
        if (task.participant) {
            if (task.type.type === "Send") {
                fileNode.append(`, sent by ${task.participant.$refText} to ${(_a = task.participantTarget) === null || _a === void 0 ? void 0 : _a.$refText}`);
            }
            else if (task.type.type === "Receive") {
                fileNode.append(`, received by ${task.participant.$refText} from ${(_b = task.participantTarget) === null || _b === void 0 ? void 0 : _b.$refText}`);
            }
            else {
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
    getEventContent(event, fileNode) {
        var _a;
        const type = (0, ast_1.isActiveEventTypeOriginal)(event.type)
            ? event.type.type
            : event.type.type.$refText;
        fileNode.appendNewLineIfNotEmpty();
        fileNode.appendIf(event.nameAlias !== undefined, ` (${event.nameAlias})`);
        fileNode.append(` (${event.name}) is a ${type} event`);
        fileNode.appendIf(event.stakeholder !== undefined, `, occurs in the scope of ${(_a = event.stakeholder) === null || _a === void 0 ? void 0 : _a.$refText}`);
        fileNode.append(".");
        fileNode.appendNewLine();
    }
    /**
     * Retrieves the content for a given actor.
     *
     * @param actor    The actor to be processed.
     * @param fileNode Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getActorContent(actor, fileNode) {
        const type = (0, ast_1.isActorTypeOriginal)(actor.type)
            ? actor.type.type
            : actor.type.type.$refText;
        fileNode.appendIf(actor.nameAlias !== undefined, actor.nameAlias);
        fileNode.append(` (${actor.name}) is a ${type}`);
        fileNode.appendIf(actor.description !== undefined, `, described as ${actor.description}`);
        fileNode.append(".");
        fileNode.appendNewLine();
    }
    /**
     * Retrieves the content for a given stakeholder.
     *
     * @param stakeholder The stakeholder to be processed.
     * @param fileNode    Implementation of {@link GeneratorNode} serving as container for `string` segments.
     */
    getStakeholderContent(stakeholder, fileNode) {
        const type = (0, ast_1.isStakeholderTypeOriginal)(stakeholder.type)
            ? stakeholder.type.type
            : stakeholder.type.type.$refText;
        fileNode.appendNewLineIfNotEmpty();
        let subType = "";
        if (stakeholder.subType) {
            subType = (0, ast_1.isStakeholderSubTypeOriginal)(stakeholder.subType)
                ? stakeholder.subType.type
                : stakeholder.subType.type.$refText;
            fileNode.append(subType);
            fileNode.appendNewLine();
        }
        fileNode.appendIf(stakeholder.nameAlias !== undefined, ` ${stakeholder.nameAlias} `);
        fileNode.append(` (${stakeholder.name}) is a `);
        if (stakeholder.subType) {
            fileNode.append(subType);
        }
        else {
            fileNode.append(type);
        }
        fileNode.appendIf(stakeholder.description !== undefined, `, described as ${stakeholder.description}`);
        fileNode.append(".");
        fileNode.appendNewLine();
    }
}
exports.RsltextGenerator = RsltextGenerator;
//# sourceMappingURL=rsl-text-generator.js.map