import * as vscode from 'vscode';
import { RslGenerator } from './rsl-generator';

/**
 * Factory class for executing instances of RslGenerator.
 */
export class RslGeneratorFactory {
    /**
     * Executes the provided RslGenerator instance by validating it and generating the content.
     *
     * @param generator The RslGenerator instance to execute.
     */
    public async execute(generator: RslGenerator) {
        try {
            await generator.validate();

            const content = generator.generate();
            generator.execute(content);
        } catch (e) {
            if (e instanceof Error) {
                vscode.window.showErrorMessage(e.message);
            } else {
                vscode.window.showErrorMessage(`Error executing RslGenerator: ${e}`);
            }
        }
    }
}
