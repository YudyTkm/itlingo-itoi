class UniversalPosMapper {
    // https://universaldependencies.org/tagset-conversion/en-penn-uposf.html
    // https://observablehq.com/@spencermountain/compromise-tags
    // https://github.com/spencermountain/compromise/blob/master/src/2-two/preTagger/compute/penn.js
    private static mapping: { [key: string]: string } = {
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
        Gerund: 'VERB', //throwing
        PastTense: 'VERB', //threw
        Participle: 'VERB', //thrown
        PresentTense: 'VERB', //throws
        Infinitive: 'VERB', //throw
        Particle: 'ADP', //phrasal particle
        Verb: 'VERB', // throw

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

    private static toUD(term: any): string | null {
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

    public static map(view: any): void {
        view.compute('tagRank');
        view.docs.forEach((terms: any) => {
            terms.forEach((term: any) => {
                term.ud = UniversalPosMapper.toUD(term);
                term.possibleTags = new Set<string>();
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

export default UniversalPosMapper;
