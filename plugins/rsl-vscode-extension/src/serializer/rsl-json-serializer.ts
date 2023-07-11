import { DefaultJsonSerializer } from 'langium';
import { RslServices } from '../language-server/rsl-module';

/**
 * Custom JSON serializer implementation for the RSL language.
 */
export class RslJsonSerializer extends DefaultJsonSerializer {

    constructor(services: RslServices){
        super(services);
    }
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
