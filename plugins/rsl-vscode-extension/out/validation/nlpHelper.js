"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NlpHelper = void 0;
const nlpToken_1 = require("./nlpToken");
const universalPosMapper_1 = __importDefault(require("./universalPosMapper"));
/**
 * Represents a natural language processing (NLP) helper to annotate text.
 */
class NlpHelper {
    constructor() {
        this._tokensByInput = new Map();
        // private singularize(word: string) {
        //     const endings = {
        //         ves: 'fe',
        //         ies: 'y',
        //         i: 'us',
        //         zes: 'ze',
        //         ses: 's',
        //         es: 'e',
        //         s: '',
        //     };
        //     return word.replace(new RegExp(`(${Object.keys(endings).join('|')})$`), (r) => endings[r as keyof typeof endings]);
        // }
    }
    /**
     * Retrieves the NLP tokens for the given text and language type.
     *
     * @param languageType The linguistic language type.
     * @param text         The input text to process.
     * @returns An array of NlpToken objects representing the tokens in the text.
     */
    getTokens(languageType, text) {
        if (!text) {
            return [];
        }
        let cacheKey = `${languageType}_${text.replaceAll('\\s+', '').toLowerCase()}`;
        if (this._tokensByInput.has(cacheKey)) {
            return this._tokensByInput.get(cacheKey);
        }
        let nlp;
        switch (languageType) {
            case 'German':
                nlp = require('de-compromise');
                break;
            case 'French':
                nlp = require('fr-compromise');
                break;
            case 'Spanish':
                nlp = require('es-compromise');
                break;
            case 'Italian':
                nlp = require('it-compromise');
                break;
            case 'Portuguese':
                nlp = require('pt-compromise');
                break;
            case 'Japanese':
                nlp = require('ja-compromise');
                break;
            case 'English':
            default:
                nlp = require('compromise');
                break;
        }
        const doc = nlp(text);
        doc.compute('root');
        universalPosMapper_1.default.map(doc);
        let taggedTokens = [];
        doc.docs.forEach((terms) => {
            terms.forEach((term) => {
                taggedTokens.push(new nlpToken_1.NlpToken(term.text, term.ud, term.root ? term.root : term.text, term.possibleTags));
            });
        });
        this._tokensByInput.set(cacheKey, taggedTokens);
        return taggedTokens;
    }
}
exports.NlpHelper = NlpHelper;
//# sourceMappingURL=nlpHelper.js.map