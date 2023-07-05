"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NlpToken = void 0;
/**
 * Represents an natural language processing (NLP) token with its associated properties.
 */
class NlpToken {
    /**
     * Initializes a new `NlpToken` instance.
     *
     * @param originalText The original text of the token.
     * @param pos          The part-of-speech (POS) tag of the token.
     * @param lemma        The lemma (base form) of the token.
     * @param possibleTags A Set of possible tags for the token.
     */
    constructor(originalText, pos, lemma, possibleTags) {
        this._possibleTags = new Set();
        this._originalText = originalText;
        this._pos = pos;
        this._lemma = lemma;
        this._possibleTags = possibleTags;
    }
    /**
     * Gets the lemma (base form) of the token.
     */
    get lemma() {
        return this._lemma;
    }
    /**
     * Gets the part-of-speech (POS) tag of the token.
     */
    get pos() {
        return this._pos;
    }
    /**
     * Gets the possible tags for the token.
     */
    get possibleTags() {
        return this._possibleTags;
    }
    /**
     * Gets the original text of the token.
     */
    get originalText() {
        return this._originalText;
    }
}
exports.NlpToken = NlpToken;
//# sourceMappingURL=nlpToken.js.map