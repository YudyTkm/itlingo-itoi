"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Provides a mapping between the tags used in the nlp-compromise framework and the Universal Dependencies (UD) tags.
 * It allows for converting tags from the nlp-compromise framework to their corresponding UD tags.
 */
class UniversalPosMapper {
    static toUD(term) {
        if (term.tags.has('ProperNoun') && term.tags.has('Plural')) {
            return 'PROPN';
        }
        if (term.tags.has('Possessive') && term.tags.has('Pronoun')) {
            return 'DET';
        }
        if (term.normal === 'there') {
            return 'PRON';
        }
        if (term.normal === 'to') {
            return 'PART';
        }
        let arr = term.tagRank || [];
        for (let i = 0; i < arr.length; i += 1) {
            if (UniversalPosMapper.mapping.hasOwnProperty(arr[i])) {
                let result = UniversalPosMapper.mapping[arr[i]];
                if (result) {
                    return result;
                }
            }
        }
        return 'X';
    }
    /**
     * Maps the tags in a given view to their corresponding UD tags.
     * The mapped UD tag for each term is stored in the `term.ud` property.
     * All possible UD tags for a term are stored in the `term.possibleTags` property.
     * @param view - The view object containing the tags to be mapped.
     */
    static map(view) {
        view.compute('tagRank');
        view.docs.forEach((terms) => {
            terms.forEach((term) => {
                term.ud = UniversalPosMapper.toUD(term);
                term.possibleTags = new Set();
                term.possibleTags.add(term.ud);
                if (term.switch) {
                    let arr = term.switch.split('|') || [];
                    for (let i = 0; i < arr.length; i += 1) {
                        if (UniversalPosMapper.mapping.hasOwnProperty(arr[i])) {
                            let result = UniversalPosMapper.mapping[arr[i]];
                            if (result) {
                                term.possibleTags.add(result);
                            }
                        }
                    }
                }
            });
        });
    }
}
/**
 * A static mapping object that maps nlp-compromise tags to their corresponding UD tags.
 * The keys represent nlp-compromise tags, and the values represent their corresponding UD tags
 * For more information, please visit:
 * [Tagset en::penn](https://universaldependencies.org/tagset-conversion/en-penn-uposf.html),
 * [Compromise/tags](https://observablehq.com/@spencermountain/compromise-tags),
 * [penn.js](https://github.com/spencermountain/compromise/blob/master/src/2-two/preTagger/compute/penn.js)
 */
UniversalPosMapper.mapping = {
    // adverbs
    // 'Comparative': 'RBR',
    // 'Superlative': 'RBS',
    Adverb: 'ADV',
    // adjectives
    Comparative: 'ADJ',
    Superlative: 'ADJ',
    Adjective: 'ADJ',
    TO: 'PART',
    // verbs
    Modal: 'VERB',
    Auxiliary: 'VERB',
    Gerund: 'VERB',
    PastTense: 'VERB',
    Participle: 'VERB',
    PresentTense: 'VERB',
    Infinitive: 'VERB',
    Particle: 'ADP',
    Verb: 'VERB',
    // pronouns
    Pronoun: 'PRON',
    // misc
    Cardinal: 'NUM',
    Conjunction: 'CCONJ',
    Determiner: 'DET',
    Preposition: 'ADP',
    // 'Determiner': 'WDT',
    // 'Expression': 'FW',
    QuestionWord: 'PRON',
    Expression: 'INTJ',
    //nouns
    Possessive: 'PART',
    ProperNoun: 'PROPN',
    Person: 'PROPN',
    Place: 'PROPN',
    Organization: 'PROPN',
    Singular: 'PROPN',
    Plural: 'NOUN',
    Noun: 'NOUN',
    There: 'EX', //'there'
    // 'Adverb':'WRB',
    // 'Noun':'PDT', //predeterminer
    // 'Noun':'SYM', //symbol
    // 'Noun':'NFP', //
    //  WDT 	Wh-determiner
    // 	WP 	Wh-pronoun
    // 	WP$ 	Possessive wh-pronoun
    // 	WRB 	Wh-adverb
};
exports.default = UniversalPosMapper;
//# sourceMappingURL=universalPosMapper.js.map