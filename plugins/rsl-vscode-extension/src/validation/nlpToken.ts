/**
 * Represents an natural language processing (NLP) token with its associated properties.
 */
export class NlpToken {
    private _originalText: string;
    private _pos: string;
    private _lemma: string;
    private _possibleTags = new Set<string>();

    /**
     * Initializes a new `NlpToken` instance.
     *
     * @param originalText The original text of the token.
     * @param pos          The part-of-speech (POS) tag of the token.
     * @param lemma        The lemma (base form) of the token.
     * @param possibleTags A Set of possible tags for the token.
     */
    constructor(originalText: string, pos: string, lemma: string, possibleTags: Set<string>) {
        this._originalText = originalText;
        this._pos = pos;
        this._lemma = lemma;
        this._possibleTags = possibleTags;
    }

    /**
     * Gets the lemma (base form) of the token.
     */
    public get lemma(): string {
        return this._lemma;
    }

    /**
     * Gets the part-of-speech (POS) tag of the token.
     */
    public get pos(): string {
        return this._pos;
    }

    /**
     * Gets the possible tags for the token.
     */
    public get possibleTags() {
        return this._possibleTags;
    }

    /**
     * Gets the original text of the token.
     */
    public get originalText(): string {
        return this._originalText;
    }
}
