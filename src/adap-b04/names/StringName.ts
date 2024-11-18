import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        this.name = other;
        this.noComponents = this.toArray().length;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }
    private setNoComponents(noComponents: number) {
        this.noComponents = noComponents;
    }
    private toArray(): string[] {
        const regexEscapedDelimiter = this.getDelimiterCharacter().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const rx = new RegExp(`(?<!\\${ESCAPE_CHARACTER})${regexEscapedDelimiter}`, "g");
        return this.getName().split(rx);
    }

    public getComponent(i: number): string {
        return this.toArray()[i];
    }

    public setComponent(i: number, c: string) {
        let arr: string[] = this.toArray();
        arr[i] = c;
        let str: string = arr.join(this.getDelimiterCharacter());
        this.setNoComponents(arr.length);
        this.setName(str);
    }

    public insert(i: number, c: string) {
        let arr: string[] = this.toArray();
        arr.splice(i, 0, c);
        let str: string = arr.join(this.getDelimiterCharacter());
        this.setNoComponents(arr.length);
        this.setName(str);
    }

    public append(c: string) {
        this.setName(this.getName() + this.getDelimiterCharacter() + c);
        this.setNoComponents(this.getNoComponents() + 1);
    }

    public remove(i: number) {
        let arr: string[] = this.toArray();
        arr.splice(i, 1);
        let str: string = arr.join(this.getDelimiterCharacter());
        this.setNoComponents(arr.length);
        this.setName(str);
    }

    private getName(): string {
        return this.name;
    }
    private setName(name: string) {
        this.name = name;
    }
}