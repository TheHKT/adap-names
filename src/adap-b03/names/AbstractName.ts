import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        if(delimiter)
            this.delimiter = delimiter;
        else
            this.delimiter = DEFAULT_DELIMITER;
    }

    public asString(delimiter: string = this.delimiter): string {
        let str: string[] = this.getComponents();
        let length: number = this.getNoComponents();

        for (let i: number = 0; i < length; i++) {
            str[i] = this.removeEscapeCharacters(str[i], delimiter);
        }
        return str.join(delimiter)
    }

    protected removeEscapeCharacters(s: string, delimiter: string): string {
        let buff: string = "Ǽ"; // \. or \\.
        let masked: string = s.replaceAll(delimiter + delimiter, buff);
        return masked.replaceAll(delimiter, "").replaceAll(buff, delimiter);
    }

    public toString(): string {
        return this.getComponents().join(this.getDelimiterCharacter())
    }

    public asDataString(): string {
        let str: string[] = this.getComponents();
        return str.map(component => this.addEscapeCharacters(component, this.getDelimiterCharacter())).join(this.getDelimiterCharacter());
    }

    private addEscapeCharacters(s: string, delimiter: string): string {
        return s.replace(new RegExp(`[${ESCAPE_CHARACTER}${delimiter}]`, 'g'), match => ESCAPE_CHARACTER + match);
    }

    private getComponents(): string[] {
        let str: string[] = [];
        let length: number = this.getNoComponents();

        for (let i: number = 0; i < length; i++) {
            str.push(this.getComponent(i));
        }
        return str;
    }

    public isEqual(other: Name): boolean {
        return (this.toString() == other.toString());
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.toString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public clone(): Name {
        return { ...this };
    }

    public isEmpty(): boolean {
        return this.getComponents().length === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }
}