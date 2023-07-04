import { LinguisticLanguageType } from '../language-server/generated/ast';
import { NlpToken } from './nlpToken';
import UniversalPosMapper from './universalPosMapper';

/**
 * Represents a natural language processing (NLP) helper to annotate text.
 */
export class NlpHelper {
    private readonly _tokensByInput: Map<string, NlpToken[]> = new Map<string, NlpToken[]>();

    /**
     * Retrieves the NLP tokens for the given text and language type.
     *
     * @param languageType The linguistic language type.
     * @param text         The input text to process.
     * @returns An array of NlpToken objects representing the tokens in the text.
     */
    public getTokens(languageType: LinguisticLanguageType, text: string): NlpToken[] {
        if (!text) {
            return [];
        }

        let cacheKey = `${languageType}_${text.replaceAll('\\s+', '').toLowerCase()}`;
        if (this._tokensByInput.has(cacheKey)) {
            return this._tokensByInput.get(cacheKey) as NlpToken[];
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

        UniversalPosMapper.map(doc);

        let taggedTokens: NlpToken[] = [];
        doc.docs.forEach((terms: any) => {
            terms.forEach((term: any) => {
                taggedTokens.push(new NlpToken(term.text, term.ud, term.root ? term.root : term.text, term.possibleTags));
            });
        });

        this._tokensByInput.set(cacheKey, taggedTokens);

        return taggedTokens;
    }

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
