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
        return this.components.map(component => this.addEscapeCharacters(component, delimiter)).join(delimiter);
    }

    public asDataString(): string {
        return this.asString(this.getDelimiterCharacter());
    }

    private addEscapeCharacters(s: string, delimiter: string): string {
        return s.replace(new RegExp(`[${ESCAPE_CHARACTER}${delimiter}]`, 'g'), match => ESCAPE_CHARACTER + match);
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
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
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        for(let i = 0; i<other.getNoComponents(); i++){
            this.append(other.getComponent(i));
        }
    }

}