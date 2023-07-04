import { DefaultJsonSerializer } from 'langium';

/**
 * Custom JSON serializer implementation for the RSL language.
 */
export class RslJsonSerializer extends DefaultJsonSerializer {
    /**
     * A set of properties to ignore during serialization.
     */
    protected override ignoreProperties = new Set([
        '$container',
        '$containerProperty',
        '$containerIndex',
        '$document',
        '$cstNode',
        '$type',
    ]);
}
