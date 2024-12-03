import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { ExceptionType } from "../common/AssertionDispatcher";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        try {
            super(delimiter);
            // PRE
            this.assertValidComponents(ExceptionType.PRECONDITION, other);

            this.components = other;

            // POST
            this.assertValidComponents(ExceptionType.POSTCONDITION, this.components);
            // CLASS INV
            this.ensureInvariants();
        } catch (e: any) {
            throw new ServiceFailureException("Failed executing constructor!", e);
        }
    }

    public getNoComponents(): number {
        try {
            let length: number = this.doGetNoComponents();

            // CLASS INV
            this.ensureInvariants();
            // POST
            this.assertIsNotNullOrUndefined(ExceptionType.POSTCONDITION, length, "Failed executing getNoComponents()!");

            return length;
        } catch (e: any) {
            throw new ServiceFailureException("Failed getting number of components!", e);
        }
    }
    protected doGetNoComponents(): number {
        return this.components.length
    }

    public getComponent(i: number): string {
        try {
            // PRE
            this.assertValidIndex(ExceptionType.PRECONDITION, i);

            let str = this.components[i];

            // CLASS INV
            this.ensureInvariants();
            // POST
            this.assertEscapedString(ExceptionType.POSTCONDITION, str);

            return str;
        } catch (e: any) {
            throw new ServiceFailureException("Failed getting component!", e);
        }
    }

    public setComponent(i: number, c: string) {
        // Cloning old state for post condition
        let clone: Name = this.clone();
        try {
            // PRE
            this.assertValidIndex(ExceptionType.PRECONDITION, i);
            this.assertEscapedString(ExceptionType.PRECONDITION, c);

            this.components[i] = c;

            // CLASS INV
            this.ensureInvariants();
            // POST
            this.assertEscapedString(ExceptionType.POSTCONDITION, this.components[i]);
        } catch (e: any) {
            if (e instanceof MethodFailedException) {
                Object.assign(this, clone);
            }
            throw new ServiceFailureException("Failed getting component!", e);
        }
    }

    public insert(i: number, c: string) {
        // Cloning old state for post condition
        let clone: Name = this.clone();
        try {
            // PRE
            this.assertValidIndex(ExceptionType.PRECONDITION, i);
            this.assertEscapedString(ExceptionType.PRECONDITION, c);
            let oldNoComponents = this.doGetNoComponents();

            this.components.splice(i, 0, c);

            // CLASS INV
            this.ensureInvariants();
            // POST
            this.assertValidComponentAddition(ExceptionType.POSTCONDITION, i, oldNoComponents);
        } catch (e: any) {
            if (e instanceof MethodFailedException) {
                Object.assign(this, clone);
            }
            throw new ServiceFailureException("Failed inserting component!", e);
        }
    }

    public append(c: string) {
        // Cloning old state for post condition
        let clone: Name = this.clone();
        try {
            // PRE
            this.assertEscapedString(ExceptionType.PRECONDITION, c);
            let oldNoComponents = this.doGetNoComponents();

            this.components.push(c);

            // CLASS INV
            this.ensureInvariants();
            // POST
            this.assertValidComponentAddition(ExceptionType.POSTCONDITION, this.doGetNoComponents() - 1, oldNoComponents);
        } catch (e: any) {
            if (e instanceof MethodFailedException) {
                Object.assign(this, clone);
            }
            throw new ServiceFailureException("Failed appending component!", e);
        }
    }

    public remove(i: number) {
        // Cloning old state for post condition
        let clone: Name = this.clone();
        try {
        // PRE
        this.assertValidIndex(ExceptionType.PRECONDITION, i);
        let oldNoComponents = this.doGetNoComponents();

        this.components.splice(i, 1);

        // CLASS INV
        this.ensureInvariants();
        // POST
        this.assertValidRemoval(ExceptionType.POSTCONDITION, oldNoComponents);
        } catch (e: any) {
            if (e instanceof MethodFailedException) {
                Object.assign(this, clone);
            }
            throw e;
        }
    }

    protected ensureInvariants(): void {
        super.ensureInvariants();
        //this.assertValidComponents(InvalidStateException, this.components);
    }
    private assertValidComponents(exceptionClass: ExceptionType, arr: string[]) {
        this.assertIsNotNullOrUndefined(exceptionClass, arr, "Array must not be null!");
        arr.forEach((element: string) => {
            this.assertEscapedString(exceptionClass, element);
        });
    }
}