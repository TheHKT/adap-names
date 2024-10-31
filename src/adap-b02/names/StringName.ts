import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    protected name: string = "";
    protected length: number = 0;

    constructor(other: string, delimiter?: string) {
        if (delimiter) {
            this.delimiter = delimiter;
        }
        this.name = other;
        this.doSetLength(this.doGetName().length);
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.toArray().map(component => this.addEscapeCharacters(component, delimiter)).join(delimiter);
    }

    public asDataString(): string {
        return this.asString(this.getDelimiterCharacter());
    }

    private addEscapeCharacters(s: string, delimiter: string): string {
        return s.replace(new RegExp(`[${ESCAPE_CHARACTER}${delimiter}]`, 'g'), match => ESCAPE_CHARACTER + match);
    }

    public isEmpty(): boolean {
        return this.doGetLength() === 0;
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
        arr[n] = c;
        let str: string = arr.join(this.delimiter);
        this.doSetLength(str.length);
        this.doSetName(str);
    }

    public insert(n: number, c: string): void {
        let arr: string[] = this.toArray();
        arr.splice(n, 0, c);
        let str: string = arr.join(this.delimiter);
        this.doSetLength(str.length);
        this.doSetName(str);
    }

    public append(c: string): void {
        this.doSetName(this.name + this.delimiter + c);
        this.doSetLength(this.name.length);
    }

    public remove(n: number): void {
        let arr: string[] = this.toArray();
        arr.splice(n, 1);
        let str: string = arr.join(this.delimiter);
        this.doSetLength(str.length);
        this.doSetName(str);
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    private toArray(): string[] {
        const regexEscapedDelimiter = this.getDelimiterCharacter().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const rx = new RegExp(`(?<!\\${ESCAPE_CHARACTER})${regexEscapedDelimiter}`, "g");
        return this.name.split(rx);
    }

    protected doSetLength(n: number): void {
        this.setLength(n);
    }

    protected doGetLength(): number {
        return this.getLength();
    }

    protected doSetName(n: string): void {
        this.setName(n);
    }

    protected doGetName(): string {
        return this.getName();
    }

    public setLength(n: number): void {
        this.length=n;
    }

    public getLength(): number {
        return this.length;
    }

    public setName(n: string): void {
        this.name = n;
    }

    public getName(): string {
        return this.name;
    }
}