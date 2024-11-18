import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        // PRE
        this.assertValidString(new IllegalArgumentException("No valid string given!"), other);

        this.name = other;
        this.noComponents = this.toArray().length;

        // POST
        this.assertValidString(new IllegalArgumentException("Failed executing constructor!"), this.getName());
        this.assertValidNumber(new IllegalArgumentException("Failed executing constructor!"), this.getNoComponents());

        // CLASS INV
        this.assertValidState();
    }

    public getNoComponents(): number {
        // CLASS INV
        this.assertValidState();

        let length: number = this.noComponents;

        // POST
        this.assertValidNumber(new IllegalArgumentException("Failed executing getNoComponents()!"), length);

        return length;
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
        // CLASS INV
        this.assertValidState();

        // PRE
        this.assertValidIndex(new IllegalArgumentException("No valid index given!"), i);

        let str = this.toArray()[i];

        // POST
        this.assertEscapedString(new IllegalArgumentException("String is not valid (null or unescaped)!"), str);
        return str;
    }

    public setComponent(i: number, c: string) {
        // CLASS INV
        this.assertValidState();

        // PRE
        this.assertValidIndex(new IllegalArgumentException("No valid index given!"), i);
        this.assertEscapedString(new IllegalArgumentException("String is not valid (null or unescaped)!"), c);

        let arr: string[] = this.toArray();
        arr[i] = c;
        let str: string = arr.join(this.getDelimiterCharacter());
        this.setNoComponents(arr.length);
        this.setName(str);

        // POST
        this.assertValidNumber(new IllegalArgumentException("Failed setting number of components!"), this.getNoComponents());
        this.assertValidString(new IllegalArgumentException("Failed setting name!"), this.getName());
    }

    public insert(i: number, c: string) {
        // CLASS INV
        this.assertValidState();

        // PRE
        this.assertValidIndex(new IllegalArgumentException("No valid index given!"), i);
        this.assertEscapedString(new IllegalArgumentException("String is not valid (null or unescaped)!"), c);

        let arr: string[] = this.toArray();
        arr.splice(i, 0, c);
        let str: string = arr.join(this.getDelimiterCharacter());
        this.setNoComponents(arr.length);
        this.setName(str);

        // POST
        this.assertValidNumber(new IllegalArgumentException("Failed setting number of components!"), this.getNoComponents());
        this.assertValidString(new IllegalArgumentException("Failed setting name!"), this.getName());
    }

    public append(c: string) {
        // CLASS INV
        this.assertValidState();

        // PRE
        this.assertEscapedString(new IllegalArgumentException("String is not valid (null or unescaped)!"), c);

        this.setName(this.getName() + this.getDelimiterCharacter() + c);
        this.setNoComponents(this.getNoComponents() + 1);

        // POST
        this.assertValidNumber(new IllegalArgumentException("Failed setting number of components!"), this.getNoComponents());
        this.assertValidString(new IllegalArgumentException("Failed setting name!"), this.getName());
    }

    public remove(i: number) {
        // CLASS INV
        this.assertValidState();

        // PRE
        this.assertValidIndex(new IllegalArgumentException("No valid index given!"), i);
        
        let oldNoComponents: number = this.getNoComponents();
        let arr: string[] = this.toArray();
        arr.splice(i, 1);
        let str: string = arr.join(this.getDelimiterCharacter());
        this.setNoComponents(arr.length);
        this.setName(str);

        // POST
        this.assertSuccessfulRemoval(new IllegalArgumentException("Failed setting number of components!"), oldNoComponents);
    }

    private getName(): string {
        return this.name;
    }
    private setName(name: string) {
        this.name = name;
    }
}