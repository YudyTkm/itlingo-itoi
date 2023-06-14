import {
    LinguisticLanguageType,
    LinguisticFragmentPart,
    LinguisticRuleElementAndProperty,
    isPartOfSpeech,
    PartOfSpeech,
    isWord,
    Word,
    isLinguisticRuleElementAndProperty,
    isSystem,
} from '../language-server/generated/ast';
import { NlpToken } from './nlpToken';
import { NlpHelper } from './nlpHelper';
import { getStereotypeType, getVisibleElements } from '../util/rsl-utilities';
import { AstNode, getContainerOfType } from 'langium';

export class LinguisticFragmentPartHelper {
    private readonly _element: AstNode;
    private readonly _nlpHelper: NlpHelper;
    private readonly _linguisticLanguageType: LinguisticLanguageType;
    private readonly _fragmentPart: LinguisticFragmentPart;
    private readonly _optionType: OptionType;
    private readonly _tokens: NlpToken[] | undefined;
    private _tokenIteratorCount: number | undefined;
    private _expectedOption: string | undefined;
    private readonly _expectedRuleElementProperty: LinguisticRuleElementAndProperty | undefined;

    constructor(
        linguisticLanguageType: LinguisticLanguageType,
        element: AstNode,
        nlpHelper: NlpHelper,
        fragmentPart: LinguisticFragmentPart,
        tokens?: NlpToken[],
        tokenIteratorCount?: number
    ) {
        this._linguisticLanguageType = linguisticLanguageType;
        this._element = element;
        this._nlpHelper = nlpHelper;
        this._tokens = tokens;
        this._fragmentPart = fragmentPart;
        this._tokenIteratorCount = tokenIteratorCount;

        if (isPartOfSpeech(fragmentPart)) {
            let posTag = (fragmentPart as PartOfSpeech).posTag;
            this._expectedOption = posTag;
            this._optionType = OptionType.PartOfSpeech;
        } else if (isWord(fragmentPart)) {
            let word = (fragmentPart as Word).word;
            this._expectedOption = word;
            this._optionType = OptionType.Word;
        } else if (isLinguisticRuleElementAndProperty(fragmentPart)) {
            this._expectedOption = '';
            this._expectedRuleElementProperty = fragmentPart as LinguisticRuleElementAndProperty;
            this._optionType = OptionType.ElementAndProperty;
        } else {
            throw new Error('type ' + fragmentPart.$type + 'is not implemented.');
        }
    }

    public get optionType(): OptionType {
        return this._optionType;
    }

    public get expectedOption(): string | undefined {
        return this._expectedOption;
    }

    public get expectedRuleElementProperty(): LinguisticRuleElementAndProperty | undefined {
        return this._expectedRuleElementProperty;
    }

    public getMatchingText(originalTextToMatch: string) {
        if (isPartOfSpeech(this._fragmentPart)) {
            let posTag = this._expectedOption as string;
            let actualTag = this.getPosTag(posTag);
            let tokens = this._nlpHelper.getTokens(this._linguisticLanguageType, originalTextToMatch);

            for (let token of tokens) {
                let result = token.possibleTags.has(actualTag);

                if (result) {
                    return originalTextToMatch;
                }
            }
        } else if (isWord(this._fragmentPart)) {
            let text = this._expectedOption as string;
            if (originalTextToMatch.startsWith(text)) {
                return text;
            }
        } else if (isLinguisticRuleElementAndProperty(this._fragmentPart)) {
            let linguisticRuleElementAndProperty = this._fragmentPart as LinguisticRuleElementAndProperty;
            let desiredElement = getStereotypeType(linguisticRuleElementAndProperty.element.element);
            let property = linguisticRuleElementAndProperty.property;
            const system = getContainerOfType(this._element, isSystem);

            if (!system) {
                throw new Error('Failed to find the system element');
            }
            let elementNames = getVisibleElements(system, desiredElement, property);
            let tokens = this._nlpHelper.getTokens(this._linguisticLanguageType, originalTextToMatch);

            for (let token of tokens) {
                for (let elementName of elementNames) {
                    if (
                        elementName.toLowerCase() === token.lemma.toLowerCase() ||
                        elementName.toLowerCase() === token.originalText.toLowerCase()
                    ) {
                        return elementName;
                    }
                }
            }
        }

        return '';
    }

    public validateInput() {
        let tokens = this._tokens as NlpToken[];
        let tokenIteratorCount = this._tokenIteratorCount as number;
        if (isPartOfSpeech(this._fragmentPart)) {
            let posTag = this._expectedOption as string;
            let actualTag = this.getPosTag(posTag);
            let result = tokens[tokenIteratorCount].possibleTags.has(actualTag);

            return { result: result, tokenIteratorCount: tokenIteratorCount };
        } else if (isWord(this._fragmentPart)) {
            let text = this._expectedOption as string;
            let wordTokens = this._nlpHelper.getTokens(this._linguisticLanguageType, text);
            let result = this.checkElementText(wordTokens, tokenIteratorCount, tokens, false);

            return result;
        } else if (isLinguisticRuleElementAndProperty(this._fragmentPart)) {
            let linguisticRuleElementAndProperty = this._fragmentPart as LinguisticRuleElementAndProperty;
            let element = getStereotypeType(linguisticRuleElementAndProperty.element.element);
            let property = linguisticRuleElementAndProperty.property;

            const system = getContainerOfType(this._element, isSystem);

            if (!system) {
                throw new Error('Failed to find the system element');
            }

            let elementsText = getVisibleElements(system, element, property);
            let token = tokens[tokenIteratorCount];

            let possibleTokensIteratorCount = new Set<number>();
            for (let elementText of elementsText) {
                const useLemma = property === 'name';
                const wordTokens = this._nlpHelper.getTokens(this._linguisticLanguageType, elementText);

                if (
                    wordTokens[0].lemma.toLowerCase() === token.lemma.toLowerCase() ||
                    wordTokens[0].originalText.toLowerCase() === token.originalText.toLowerCase()
                ) {
                    if (tokenIteratorCount + wordTokens.length > tokens.length) {
                        continue;
                    }

                    let result = this.checkElementText(wordTokens, tokenIteratorCount, tokens, useLemma);
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

    private checkElementText(expectedWordTokens: NlpToken[], tokenIteratorCount: number, tokens: NlpToken[], useLemma: boolean) {
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
            } else {
                result = expectedWordToken.originalText.toLowerCase() === token.originalText.toLocaleLowerCase();
            }

            if (!result) {
                break;
            }

            this._expectedOption = (this._expectedOption as string).replace(`/\b${expectedWordToken.originalText}\b\s*/g`, '');
        }

        tokenIteratorCount = currentIndex;
        return { result, tokenIteratorCount };
    }

    private getPosTag(posTagDescription: string): string {
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

export enum OptionType {
    ElementAndProperty,
    PartOfSpeech,
    Word,
}
