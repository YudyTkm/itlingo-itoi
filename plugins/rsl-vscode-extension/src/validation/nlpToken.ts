export class NlpToken {
    private _originalText: string;
    private _pos: string;
    private _lemma: string;
    private _possibleTags = new Set<string>();

    constructor(originalText: string, pos: string, lemma: string, possibleTags: Set<string>) {
        this._originalText = originalText;
        this._pos = pos;
        this._lemma = lemma;
        this._possibleTags = possibleTags;
    }

    public get lemma(): string {
        return this._lemma;
    }

    public set lemma(value: string) {
        this._lemma = value;
    }

    public get pos(): string {
        return this._pos;
    }

    public set pos(value: string) {
        this._pos = value;
    }

    public get possibleTags() {
        return this._possibleTags;
    }

    public set possibleTags(value) {
        this._possibleTags = value;
    }

    public get originalText(): string {
        return this._originalText;
    }

    public set originalText(value: string) {
        this._originalText = value;
    }
}
