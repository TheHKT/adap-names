import { ESCAPE_CHARACTER } from "../common/Printable";
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
        IllegalArgumentException.assertIsNotNullOrUndefined(other, "No valid string given!");

        this.setName(other);
        this.setNoComponents(this.toArray().length);

        // POST
        MethodFailureException.assertIsNotNullOrUndefined(this.getName(), "Failed executing constructor!");
        MethodFailureException.assertIsNotNullOrUndefined(this.getNoComponents(), "Failed executing constructor!");

        // CLASS INV
        this.ensureInvariants();
    }

    public getNoComponents(): number {
        // CLASS INV
        this.ensureInvariants();

        let length: number = this.noComponents;

        // POST
        MethodFailureException.assertIsNotNullOrUndefined(length, "Failed executing getNoComponents()!");

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
        this.ensureInvariants();
        // PRE
        this.assertValidIndex(IllegalArgumentException, i);

        let str = this.toArray()[i];

        // POST
        this.assertEscapedString(MethodFailureException, str);

        return str;
    }

    public setComponent(i: number, c: string) {
        // CLASS INV
        this.ensureInvariants();
        // PRE
        this.assertValidIndex(IllegalArgumentException, i);
        this.assertEscapedString(IllegalArgumentException, c);
        // Collecting old values for post condition
        let clone: Name = this.clone();

        let arr: string[] = this.toArray();
        arr[i] = c;
        let str: string = arr.join(this.getDelimiterCharacter());
        this.setNoComponents(arr.length);
        this.setName(str);

        // POST
        try {
            MethodFailureException.assertIsNotNullOrUndefined(this.getNoComponents(), "Failed setting component!");
            MethodFailureException.assertIsNotNullOrUndefined(this.getName(), "Failed setting component!");
        } catch (e: any) {
            Object.assign(this, clone);
            throw e;
        }
    }

    public insert(i: number, c: string) {
        // CLASS INV
        this.ensureInvariants();
        // PRE
        this.assertValidIndex(IllegalArgumentException, i);
        this.assertEscapedString(IllegalArgumentException, c);
        // Cloning old state for post condition
        let clone: Name = this.clone();
        let oldNoComponents: number = this.getNoComponents();

        let arr: string[] = this.toArray();
        arr.splice(i, 0, c);
        let str: string = arr.join(this.getDelimiterCharacter());
        this.setNoComponents(arr.length);
        this.setName(str);

        // POST
        try {
            this.assertValidComponentAddition(MethodFailureException, i, oldNoComponents);
        } catch (e: any) {
            Object.assign(this, clone);
            throw e;
        }
    }

    public append(c: string) {
        // CLASS INV
        this.ensureInvariants();
        // PRE
        this.assertEscapedString(IllegalArgumentException, c);
        // Cloning old state for post condition
        let clone: Name = this.clone();
        let oldNoComponents: number = this.getNoComponents();

        this.setName(this.getName() + this.getDelimiterCharacter() + c);
        this.setNoComponents(this.getNoComponents() + 1);

        // POST
        try {
            this.assertValidComponentAddition(MethodFailureException, this.getNoComponents() - 1, oldNoComponents);
        } catch (e: any) {
            Object.assign(this, clone);
            throw e;
        }
    }

    public remove(i: number) {
        // CLASS INV
        this.ensureInvariants();
        // PRE
        this.assertValidIndex(IllegalArgumentException, i);
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
            this.assertValidRemoval(MethodFailureException, oldNoComponents);
        } catch (e: any) {
            Object.assign(this, clone);
            throw e;
        }
    }

    protected ensureInvariants(): void {
        super.ensureInvariants();
        //this.assertValidName();
    }
    private getName(): string {
        return this.name;
    }
    private setName(name: string) {
        this.name = name;
    }
}