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
        this.setLength(this.name.length);
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.getName().replace(new RegExp(`[${ESCAPE_CHARACTER}${delimiter}]`, 'g'), match => ESCAPE_CHARACTER + match);
    }

    public asDataString(): string {
        return this.asString(this.getDelimiterCharacter());
    }

    public isEmpty(): boolean {
        return this.getLength() === 0;
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
        this.setLength(str.length);
        this.setName(str);
    }

    public insert(n: number, c: string): void {
        let arr: string[] = this.toArray();
        arr.splice(n, 0, c);
        let str: string = arr.join(this.delimiter);
        this.setLength(str.length);
        this.setName(str);
    }

    public append(c: string): void {
        this.setName(this.name + this.delimiter + c);
        this.setLength(this.name.length);
    }

    public remove(n: number): void {
        let arr: string[] = this.toArray();
        arr.splice(n, 1);
        let str: string = arr.join(this.delimiter);
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
        return this.name.split(rx);
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