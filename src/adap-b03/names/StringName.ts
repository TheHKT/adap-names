import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        this.name = other;
        this.noComponents = this.getName().length;
    }

    getNoComponents(): number {
        return this.toArray().length;
    }
    private toArray(): string[] {
        const regexEscapedDelimiter = this.getDelimiterCharacter().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const rx = new RegExp(`(?<!\\${ESCAPE_CHARACTER})${regexEscapedDelimiter}`, "g");
        return this.getName().split(rx);
    }

    getComponent(i: number): string {
        return this.toArray()[i];
    }
    setComponent(i: number, c: string) {
        let arr: string[] = this.toArray();
        arr[i] = c;
        let str: string = arr.join(this.getDelimiterCharacter());
        this.setLength(str.length);
        this.setName(str);
    }

    insert(i: number, c: string) {
        let arr: string[] = this.toArray();
        arr.splice(i, 0, c);
        let str: string = arr.join(this.getDelimiterCharacter());
        this.setLength(str.length);
        this.setName(str);
    }
    append(c: string) {
        this.setName(this.getName() + this.getDelimiterCharacter() + c);
        this.setLength(this.getName().length);
    }
    remove(i: number) {
        let arr: string[] = this.toArray();
        arr.splice(i, 1);
        let str: string = arr.join(this.getDelimiterCharacter());
        this.setLength(str.length);
        this.setName(str);
    }

    private getName(): string {
        return this.name;
    }
    private setName(name: string) {
        this.name = name;
    }

    private setLength(length: number) {
        this.noComponents = length;
    }



}