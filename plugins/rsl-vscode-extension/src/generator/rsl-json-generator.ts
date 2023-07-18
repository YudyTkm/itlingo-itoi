import { RslGenerator } from './rsl-generator';

/**
 * Represents a JSON generator for RSL.
 */
export class RslJsonGenerator extends RslGenerator {
    /**
     * Gets the file extension associated with the generator.
     *
     * @returns The file extension.
     */
    public override getFileExtension(): string {
        return '.json';
    }

    /**
     * Generates the JSON content by serializing the RSL model.
     *
     * @returns The generated JSON content as a Buffer.
     */
    public override generate(): Buffer {
        return Buffer.from(this.services.serializer.JsonSerializer.serialize(this.model, { space: 2 }));
    }
}
