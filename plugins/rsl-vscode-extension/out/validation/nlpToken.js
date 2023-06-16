"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NlpToken = void 0;
class NlpToken {
    constructor(originalText, pos, lemma, possibleTags) {
        this._possibleTags = new Set();
        this._originalText = originalText;
        this._pos = pos;
        this._lemma = lemma;
        this._possibleTags = possibleTags;
    }
    get lemma() {
        return this._lemma;
    }
    set lemma(value) {
        this._lemma = value;
    }
    get pos() {
        return this._pos;
    }
    set pos(value) {
        this._pos = value;
    }
    get possibleTags() {
        return this._possibleTags;
    }
    set possibleTags(value) {
        this._possibleTags = value;
    }
    get originalText() {
        return this._originalText;
    }
    set originalText(value) {
        this._originalText = value;
    }
}
exports.NlpToken = NlpToken;
//# sourceMappingURL=nlpToken.js.map