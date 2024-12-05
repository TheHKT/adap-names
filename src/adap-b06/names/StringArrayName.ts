import { AbstractName } from "./AbstractName";
import { ExceptionType } from "../common/AssertionDispatcher";
import { ServiceFailureException } from "../common/ServiceFailureException";

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

    protected doGetComponents(): string[] {
        return this.components;
    }

    protected doGetComponent(i: number): string {
        return this.components[i];
    }
    public getComponent(i: number): string {
        try {
            // PRE
            this.assertValidIndex(ExceptionType.PRECONDITION, i);

            let str = this.doGetComponent(i);

            // CLASS INV
            this.ensureInvariants();
            // POST
            this.assertEscapedString(ExceptionType.POSTCONDITION, str);

            return str;
        } catch (e: any) {
            throw new ServiceFailureException("Failed getting component!", e);
        }
    }

    public setComponent(i: number, c: string): StringArrayName {
        let clone: StringArrayName = this.createDeepCopy();
        try {
            // PRE
            clone.assertValidIndex(ExceptionType.PRECONDITION, i);
            clone.assertEscapedString(ExceptionType.PRECONDITION, c);

            clone.components[i] = c;

            // CLASS INV
            this.ensureInvariants();
            // POST
            clone.assertEscapedString(ExceptionType.POSTCONDITION, clone.doGetComponent(i));
            return clone;
        } catch (e: any) {
            throw new ServiceFailureException("Failed getting component!", e);
        }
    }

    public insert(i: number, c: string): StringArrayName {
        // Cloning old state for post condition
        let clone: StringArrayName = this.createDeepCopy();
        try {
            // PRE
            clone.assertValidIndex(ExceptionType.PRECONDITION, i);
            clone.assertEscapedString(ExceptionType.PRECONDITION, c);
            let oldNoComponents = clone.doGetNoComponents();

            clone.doGetComponents().splice(i, 0, c);

            // CLASS INV
            this.ensureInvariants();
            // POST
            clone.assertValidComponentAddition(ExceptionType.POSTCONDITION, i, oldNoComponents);
            return clone;
        } catch (e: any) {
            throw new ServiceFailureException("Failed inserting component!", e);
        }
    }

    public append(c: string): StringArrayName {
        // Cloning old state for post condition
        let clone: StringArrayName = this.createDeepCopy();
        try {
            // PRE
            clone.assertEscapedString(ExceptionType.PRECONDITION, c);
            let oldNoComponents = clone.doGetNoComponents();

            clone.doGetComponents().push(c);

            // CLASS INV
            this.ensureInvariants();
            // POST
            clone.assertValidComponentAddition(ExceptionType.POSTCONDITION, clone.doGetNoComponents() - 1, oldNoComponents);

            return clone;
        } catch (e: any) {
            throw new ServiceFailureException("Failed appending component!", e);
        }
    }

    public remove(i: number): StringArrayName {
        // Cloning old state for post condition
        let clone: StringArrayName = this.createDeepCopy();
        try {
            // PRE
        clone.assertValidIndex(ExceptionType.PRECONDITION, i);
        let oldNoComponents = clone.doGetNoComponents();

        clone.doGetComponents().splice(i, 1);

        // CLASS INV
        this.ensureInvariants();
        // POST
        clone.assertValidRemoval(ExceptionType.POSTCONDITION, oldNoComponents);

        return clone;
        } catch (e: any) {
            throw e;
        }
    }

    protected createDeepCopy(): StringArrayName {
        return new StringArrayName(this.doGetComponents().slice(), this.getDelimiterCharacter());
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