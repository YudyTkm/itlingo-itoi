import { RslGenerator } from './rsl-generator';

/**
 * Represents a JSON generator for RSL (Requirements Specification Language).
 */
export class RslJsonGenerator extends RslGenerator {
    /**
     * Gets the file extension associated with the JSON generator.
     *
     * @returns The file extension.
     */
    public override getFileExtension(): string {
        return 'json';
    }

    /**
     * Generates the JSON content by serializing the model.
     *
     * @returns The generated JSON content.
     */
    public override generate(): string {
        return this.services.serializer.JsonSerializer.serialize(this.model, { space: 2 });
    }
}
