import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { MethodFailureException } from "../common/MethodFailureException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { Exception } from "../common/Exception";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        super(delimiter);
        // PRE
        this.assertValidComponents(new IllegalArgumentException("No valid array given!"), other);

        this.components = other;

        // POST
        this.assertValidComponents(new MethodFailureException("Failed executing constructor!"), this.components);
        // CLASS INV
        this.assertValidState();
    }

    public getNoComponents(): number {
        // CLASS INV
        this.assertValidState();

        let length: number = this.components.length;

        // POST
        this.assertValidNumber(new MethodFailureException("Failed executing getNoComponents()!"), length);

        return length;
    }

    public getComponent(i: number): string {
        // CLASS INV
        this.assertValidState();
        // PRE
        this.assertValidIndex(new IllegalArgumentException("No valid index given!"), i);

        let str = this.components[i];

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
        // Cloning old state for post condition
        let clone: Name = this.clone();

        this.components[i] = c;

        // POST
        try {
            this.assertValidString(new MethodFailureException("Failed setting component!"), this.components[i]);
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

        this.components.splice(i, 0, c);

        // POST
        try {
            this.assertValidString(new MethodFailureException("Failed inserting component!"), this.getComponent(i));
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

        this.components.push(c);

        // POST
        try {
            this.assertValidString(new MethodFailureException("Failed appending component!"), this.getComponent(this.getNoComponents() - 1));
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

        let oldNoComponents = this.getNoComponents();
        this.components.splice(i, 1);

        // POST
        try {
            this.assertSuccessfulRemoval(new MethodFailureException("Failed removing component!"), oldNoComponents);
        } catch (e: any) {
            Object.assign(this, clone);
            throw e;
        }
    }
    protected assertValidState(): void {
        super.assertValidState();
        //this.assertValidComponents(new InvalidStateException("Components are not valid!"), this.components);
    }
    private assertValidComponents(exception: Exception, arr: string[]) {
        if (arr == null) {
            throw exception;
        }
        for (let i = 0; i < arr.length; i++) {
            this.assertEscapedString(exception, arr[i]);
        }
    }
}