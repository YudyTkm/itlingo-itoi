"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionType = exports.LinguisticFragmentPartHelper = void 0;
const ast_1 = require("../language-server/generated/ast");
const rsl_utilities_1 = require("../util/rsl-utilities");
const langium_1 = require("langium");
/**
 * Represents a helper to check a linguistic fragment part of a linguistic pattern.
 */
class LinguisticFragmentPartHelper {
    /**
     * Initializes a new `LinguisticFragmentPartHelper` instance.
     *
     * @param linguisticLanguageType The language associated with the input.
     * @param element                Element being verified.
     * @param nlpHelper              NLP framework helper.
     * @param fragmentPart           The part of the linguistic fragment.
     * @param tokens                 NLP Tokens associated with the input. Optional.
     * @param tokenIteratorCount     Tokens iterator count. Optional.
     */
    constructor(linguisticLanguageType, element, nlpHelper, fragmentPart, tokens, tokenIteratorCount) {
        this._linguisticLanguageType = linguisticLanguageType;
        this._element = element;
        this._nlpHelper = nlpHelper;
        this._tokens = tokens;
        this._fragmentPart = fragmentPart;
        this._tokenIteratorCount = tokenIteratorCount;
        if ((0, ast_1.isPartOfSpeech)(fragmentPart)) {
            let posTag = fragmentPart.posTag;
            this._expectedOption = posTag;
            this._optionType = OptionType.PartOfSpeech;
        }
        else if ((0, ast_1.isWord)(fragmentPart)) {
            let word = fragmentPart.word;
            this._expectedOption = word;
            this._optionType = OptionType.Word;
        }
        else if ((0, ast_1.isLinguisticRuleElementAndProperty)(fragmentPart)) {
            this._expectedOption = '';
            this._expectedRuleElementProperty = fragmentPart;
            this._optionType = OptionType.ElementAndProperty;
        }
        else {
            throw new Error('type ' + fragmentPart.$type + 'is not implemented.');
        }
    }
    /**
     * Gets the option type.
     */
    get optionType() {
        return this._optionType;
    }
    /**
     * Gets the expected option.
     */
    get expectedOption() {
        return this._expectedOption;
    }
    /**
     * Gets the expected element property.
     */
    get expectedRuleElementProperty() {
        return this._expectedRuleElementProperty;
    }
    /**
     * Gets the matching text for `originalTextToMatch`.
     *
     * @param originalTextToMatch The original text to check.
     * @return The string that matches the original text. In case of failure returns
     *         an empty string.
     */
    getMatchingText(originalTextToMatch) {
        if ((0, ast_1.isPartOfSpeech)(this._fragmentPart)) {
            let posTag = this._expectedOption;
            let actualTag = this.getPosTag(posTag);
            let tokens = this._nlpHelper.getTokens(this._linguisticLanguageType, originalTextToMatch);
            for (let token of tokens) {
                let result = token.possibleTags.has(actualTag);
                if (result) {
                    return originalTextToMatch;
                }
            }
        }
        else if ((0, ast_1.isWord)(this._fragmentPart)) {
            let text = this._expectedOption;
            if (originalTextToMatch.startsWith(text)) {
                return text;
            }
        }
        else if ((0, ast_1.isLinguisticRuleElementAndProperty)(this._fragmentPart)) {
            let linguisticRuleElementAndProperty = this._fragmentPart;
            let desiredElement = (0, rsl_utilities_1.getStereotypeType)(linguisticRuleElementAndProperty.element.element);
            let property = linguisticRuleElementAndProperty.property;
            const system = (0, langium_1.getContainerOfType)(this._element, ast_1.isSystem);
            if (!system) {
                throw new Error('Failed to find the system element');
            }
            let elementNames = (0, rsl_utilities_1.getVisibleElements)(system, desiredElement, property);
            let tokens = this._nlpHelper.getTokens(this._linguisticLanguageType, originalTextToMatch);
            for (let token of tokens) {
                for (let elementName of elementNames) {
                    if (elementName.toLowerCase() === token.lemma.toLowerCase() ||
                        elementName.toLowerCase() === token.originalText.toLowerCase()) {
                        return elementName;
                    }
                }
            }
        }
        return '';
    }
    /**
     * Checks if the input is valid according to the fragment part.
     *
     * @returns An object containing the result of the validation and the updated token iterator count.
     */
    validateInput() {
        let tokens = this._tokens;
        let tokenIteratorCount = this._tokenIteratorCount;
        if ((0, ast_1.isPartOfSpeech)(this._fragmentPart)) {
            let posTag = this._expectedOption;
            let actualTag = this.getPosTag(posTag);
            let result = tokens[tokenIteratorCount].possibleTags.has(actualTag);
            return { result: result, tokenIteratorCount: tokenIteratorCount };
        }
        else if ((0, ast_1.isWord)(this._fragmentPart)) {
            let text = this._expectedOption;
            let wordTokens = this._nlpHelper.getTokens(this._linguisticLanguageType, text);
            let result = this.checkText(wordTokens, tokenIteratorCount, tokens, false);
            return result;
        }
        else if ((0, ast_1.isLinguisticRuleElementAndProperty)(this._fragmentPart)) {
            let linguisticRuleElementAndProperty = this._fragmentPart;
            let element = (0, rsl_utilities_1.getStereotypeType)(linguisticRuleElementAndProperty.element.element);
            let property = linguisticRuleElementAndProperty.property;
            const system = (0, langium_1.getContainerOfType)(this._element, ast_1.isSystem);
            if (!system) {
                throw new Error('Failed to find the system element');
            }
            let elementsText = (0, rsl_utilities_1.getVisibleElements)(system, element, property);
            let token = tokens[tokenIteratorCount];
            let possibleTokensIteratorCount = new Set();
            for (let elementText of elementsText) {
                const useLemma = property === 'name';
                const wordTokens = this._nlpHelper.getTokens(this._linguisticLanguageType, elementText);
                if (wordTokens[0].lemma.toLowerCase() === token.lemma.toLowerCase() ||
                    wordTokens[0].originalText.toLowerCase() === token.originalText.toLowerCase()) {
                    if (tokenIteratorCount + wordTokens.length > tokens.length) {
                        continue;
                    }
                    let result = this.checkText(wordTokens, tokenIteratorCount, tokens, useLemma);
                    if (result.result) {
                        possibleTokensIteratorCount.add(result.tokenIteratorCount);
                    }
                }
            }
            if (possibleTokensIteratorCount.size > 0) {
                return { result: true, tokenIteratorCount: Math.max(...possibleTokensIteratorCount) }; // check if this works!
            }
            return { result: false, tokenIteratorCount: tokenIteratorCount };
        }
        return { result: false, tokenIteratorCount: tokenIteratorCount };
    }
    checkText(expectedWordTokens, tokenIteratorCount, tokens, useLemma) {
        if (tokenIteratorCount + expectedWordTokens.length > tokens.length) {
            return { result: false, tokenIteratorCount: tokenIteratorCount };
        }
        let currentIndex = tokenIteratorCount;
        let result = false;
        tokenIteratorCount--;
        for (let expectedWordToken of expectedWordTokens) {
            tokenIteratorCount++;
            currentIndex = tokenIteratorCount;
            let token = tokens[currentIndex];
            if (!token) {
                result = false;
                break;
            }
            if (useLemma) {
                result = expectedWordToken.lemma.toLowerCase() === token.lemma.toLowerCase();
            }
            else {
                result = expectedWordToken.originalText.toLowerCase() === token.originalText.toLocaleLowerCase();
            }
            if (!result) {
                break;
            }
            this._expectedOption = this._expectedOption.replace(`/\b${expectedWordToken.originalText}\b\s*/g`, '');
        }
        tokenIteratorCount = currentIndex;
        return { result, tokenIteratorCount };
    }
    /**
     * Converts the part-of-speech tag defined in the grammar to the part-of-speech tag notation.
     *
     * @param posTagDescription The part-of-speech tag description to convert.
     * @returns The abbreviated notation of part-of-speech.
     */
    getPosTag(posTagDescription) {
        switch (posTagDescription) {
            case 'Adjective':
                return 'ADJ';
            case 'Adposition':
                return 'ADP';
            case 'Adverb':
                return 'ADV';
            case 'Auxiliary':
                return 'AUX';
            case 'CoordinatingConjunction':
                return 'CCONJ';
            case 'Determiner':
                return 'DET';
            case 'Interjection':
                return 'INTJ';
            case 'Noun':
                return 'NOUN';
            case 'Numeral':
                return 'NUM';
            case 'Particle':
                return 'PART';
            case 'Pronoun':
                return 'PRON';
            case 'ProperNoun':
                return 'PROPN';
            case 'Punctuation':
                return 'PUNCT';
            case 'SubordinatingConjunction':
                return 'SCONJ';
            case 'Symbol':
                return 'SYM';
            case 'Verb':
                return 'VERB';
            case 'Other':
                return 'X';
            default:
                return '';
        }
    }
}
exports.LinguisticFragmentPartHelper = LinguisticFragmentPartHelper;
/**
 * Possible fragment options as defined in the grammar.
 */
var OptionType;
(function (OptionType) {
    OptionType[OptionType["ElementAndProperty"] = 0] = "ElementAndProperty";
    OptionType[OptionType["PartOfSpeech"] = 1] = "PartOfSpeech";
    OptionType[OptionType["Word"] = 2] = "Word";
})(OptionType = exports.OptionType || (exports.OptionType = {}));
//# sourceMappingURL=linguisticFragmentPartHelper.js.map