import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        if (delimiter) {
            this.delimiter = delimiter;
        }
        this.name = source;
        this.setLength(this.getName().length);
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.toArray().join(this.getDelimiter());
    }

    public asDataString(): string {
        return this.toArray().map(component => this.addEscapeCharacters(component, this.getDelimiter())).join(this.getDelimiter());
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
        return this.getLength() === 0;
    }

    public insert(n: number, c: string): void {
        let arr: string[] = this.toArray();
        arr.splice(n, 0, this.removeEscapeCharacters(c));
        let str: string = arr.join(this.getDelimiter());
        this.setLength(str.length);
        this.setName(str);
    }

    public append(c: string): void {
        this.setName(this.getName() + this.getDelimiter() + this.removeEscapeCharacters(c));
        this.setLength(this.getName().length);
    }

    public remove(n: number): void {
        let arr: string[] = this.toArray();
        arr.splice(n, 1);
        let str: string = arr.join(this.getDelimiter());
        this.setLength(str.length);
        this.setName(str);
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    private toArray(): string[] {
        const regexEscapedDelimiter = this.getDelimiterCharacter().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const rx = new RegExp(`(?<!\\${ESCAPE_CHARACTER})${regexEscapedDelimiter}`, "g");
        return this.getName().split(rx);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.toArray().length;
    }

    public getComponent(x: number): string {
        return this.toArray()[x];
    }

    public setComponent(n: number, c: string): void {
        let arr: string[] = this.toArray();
        arr[n] = this.removeEscapeCharacters(c);
        let str: string = arr.join(this.getDelimiter());
        this.setLength(str.length);
        this.setName(str);
    }

    public getLength(): number {
        return this.length;
    }

    public setLength(n: number): void {
        this.length=n;
    }

    public getName(): string {
        return this.name;
    }

    public setName(n: string): void {
        this.name = n;
    }

    public getDelimiter(): string {
        return this.delimiter;
    }
}