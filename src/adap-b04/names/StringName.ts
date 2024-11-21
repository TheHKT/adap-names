import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { Name } from "./Name";
import { MethodFailureException } from "../common/MethodFailureException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        // PRE
        this.assertValidString(new IllegalArgumentException("No valid string given!"), other);

        this.setName(other);
        this.setNoComponents(this.toArray().length);

        // POST
        this.assertValidString(new MethodFailureException("Failed executing constructor!"), this.getName());
        this.assertValidNumber(new MethodFailureException("Failed executing constructor!"), this.getNoComponents());

        // CLASS INV
        this.assertValidState();
    }

    public getNoComponents(): number {
        // CLASS INV
        this.assertValidState();

        let length: number = this.noComponents;

        // POST
        this.assertValidNumber(new MethodFailureException("Failed executing getNoComponents()!"), length);

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
        this.assertEscapedString(new MethodFailureException("String is not valid (null or unescaped)!"), str);
        
        return str;
    }

    public setComponent(i: number, c: string) {
        // CLASS INV
        this.assertValidState();
        // PRE
        this.assertValidIndex(new IllegalArgumentException("No valid index given!"), i);
        this.assertEscapedString(new IllegalArgumentException("String is not valid (null or unescaped)!"), c);
        // Collecting old values for post condition
        let clone: Name = this.clone();

        let arr: string[] = this.toArray();
        arr[i] = c;
        let str: string = arr.join(this.getDelimiterCharacter());
        this.setNoComponents(arr.length);
        this.setName(str);

        // POST
        try {
            this.assertValidNumber(new MethodFailureException("Failed setting number of components!"), this.getNoComponents());
            this.assertValidString(new MethodFailureException("Failed setting name!"), this.getName());
        } catch (e: any) {
            Object.assign(this, clone);
            throw e;
        }
    }

    public insert(i: number, c: string) {
        // CLASS INV
        this.assertValidState();
        // PRE
        this.assertValidIndex(new IllegalArgumentException("No valid index given!"), i);
        this.assertEscapedString(new IllegalArgumentException("String is not valid (null or unescaped)!"), c);
        // Cloning old state for post condition
        let clone: Name = this.clone();

        let arr: string[] = this.toArray();
        arr.splice(i, 0, c);
        let str: string = arr.join(this.getDelimiterCharacter());
        this.setNoComponents(arr.length);
        this.setName(str);

        // POST
        try {
            this.assertValidNumber(new MethodFailureException("Failed setting number of components!"), this.getNoComponents());
            this.assertValidString(new MethodFailureException("Failed setting name!"), this.getName());
        } catch (e: any) {
            Object.assign(this, clone);
            throw e;
        }
    }

    public append(c: string) {
        // CLASS INV
        this.assertValidState();
        // PRE
        this.assertEscapedString(new IllegalArgumentException("String is not valid (null or unescaped)!"), c);
        // Cloning old state for post condition
        let clone: Name = this.clone();

        this.setName(this.getName() + this.getDelimiterCharacter() + c);
        this.setNoComponents(this.getNoComponents() + 1);

        // POST
        try {
            this.assertValidNumber(new MethodFailureException("Failed setting number of components!"), this.getNoComponents());
            this.assertValidString(new MethodFailureException("Failed setting name!"), this.getName());
        } catch (e: any) {
            Object.assign(this, clone);
            throw e;
        }
    }

    public remove(i: number) {
        // CLASS INV
        this.assertValidState();
        // PRE
        this.assertValidIndex(new IllegalArgumentException("No valid index given!"), i);
        // Cloning old state for post condition
        let clone: Name = this.clone();

        let oldNoComponents: number = this.getNoComponents();
        let arr: string[] = this.toArray();
        arr.splice(i, 1);
        let str: string = arr.join(this.getDelimiterCharacter());
        this.setNoComponents(arr.length);
        this.setName(str);

        // POST
        try {
            this.assertSuccessfulRemoval(new MethodFailureException("Failed setting number of components!"), oldNoComponents);
        } catch (e: any) {
            Object.assign(this, clone);
            throw e;
        }
    }

    protected assertValidState(): void {
        super.assertValidState();
        //this.assertValidName();
    }
    private getName(): string {
        return this.name;
    }
    private setName(name: string) {
        this.name = name;
    }
}