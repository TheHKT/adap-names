import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export class StringArrayName implements Name {

    protected components: string[] = [];
    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(other: string[], delimiter?: string) {
        if (delimiter) {
            this.delimiter = delimiter;
        }
        this.components = other;
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.components.join(this.getDelimiter());
    }

    public asDataString(): string {
        return this.components.map(component => this.addEscapeCharacters(component, this.getDelimiter())).join(this.getDelimiter());
    }

    private addEscapeCharacters(s: string, delimiter: string): string {
        return s.replace(new RegExp(`[${ESCAPE_CHARACTER}${delimiter}]`, 'g'), match => ESCAPE_CHARACTER + match);
    }

    private removeEscapeCharacters(s: string): string {
        let buff: string = "Ǽ"; // \. or \\.
        let masked: string = s.replaceAll(this.getDelimiter() + this.getDelimiter(), buff);
        return masked.replaceAll(this.getDelimiter(), "").replaceAll(buff, this.getDelimiter());
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public insert(i: number, c: string): void {
        this.components.splice(i, 0, this.removeEscapeCharacters(c));
    }

    public append(c: string): void {
        this.components.push(this.removeEscapeCharacters(c));
    }

    public remove(i: number): void {
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        for(let i = 0; i<other.getNoComponents(); i++){
            this.append(other.getComponent(i));
        }
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.components[i] = this.removeEscapeCharacters(c);
    }

    public getDelimiter(): string {
        return this.delimiter;
    }
}