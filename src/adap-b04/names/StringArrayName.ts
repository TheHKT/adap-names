import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        // PRE
        this.assertValidComponents(IllegalArgumentException, source);

        this.components = source;

        // POST
        this.assertValidComponents(MethodFailedException, this.components);
        // CLASS INV
        this.ensureInvariants();
    }

    public getNoComponents(): number {
        // CLASS INV
        this.ensureInvariants();

        let length: number = this.components.length;

        // POST
        //MethodFailedException.assertIsNotNullOrUndefined(length, "Failed executing getNoComponents()!");

        return length;
    }

    public getComponent(i: number): string {
        // CLASS INV
        this.ensureInvariants();
        // PRE
        this.assertValidIndex(IllegalArgumentException, i);

        let str = this.components[i];

        // POST
        this.assertEscapedString(MethodFailedException, str);

        return str;
    }

    public setComponent(i: number, c: string) {
        // CLASS INV
        this.ensureInvariants();
        // PRE
        this.assertValidIndex(IllegalArgumentException, i);
        this.assertEscapedString(IllegalArgumentException, c);
        // Cloning old state for post condition
        let clone: Name = this.clone();

        this.components[i] = c;

        // POST
        try {
            this.assertEscapedString(MethodFailedException, this.components[i]);
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
        let oldNoComponents = this.getNoComponents();

        this.components.splice(i, 0, c);

        // POST
        try {
            this.assertValidComponentAddition(MethodFailedException, i, oldNoComponents);
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
        let oldNoComponents = this.getNoComponents();

        this.components.push(c);

        // POST
        try {
            this.assertValidComponentAddition(MethodFailedException, this.getNoComponents() - 1, oldNoComponents);
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
        let oldNoComponents = this.getNoComponents();

        this.components.splice(i, 1);

        // POST
        try {
            this.assertValidRemoval(MethodFailedException, oldNoComponents);
        } catch (e: any) {
            Object.assign(this, clone);
            throw e;
        }
    }

    protected ensureInvariants(): void {
        super.ensureInvariants();
        //this.assertValidComponents(InvalidStateException, this.components);
    }
    private assertValidComponents(exceptionClass: any, arr: string[]) {
        exceptionClass.assertIsNotNullOrUndefined(arr, "Array must not be null!");
        arr.forEach((element: string) => {
            this.assertEscapedString(exceptionClass, element);
        });
    }
}