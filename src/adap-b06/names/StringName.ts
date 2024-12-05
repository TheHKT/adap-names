import { ESCAPE_CHARACTER } from "../common/Printable";
import { AbstractName } from "./AbstractName";
import { ExceptionType } from "../common/AssertionDispatcher";
import { ServiceFailureException } from "../common/ServiceFailureException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        try {
            super(delimiter);
            // PRE
            this.assertIsNotNullOrUndefined(ExceptionType.PRECONDITION, other, "No valid string given!");

            this.name = other;
            this.noComponents = this.toArray().length;

            // CLASS INV
            this.ensureInvariants();
            // POST
            this.assertIsNotNullOrUndefined(ExceptionType.POSTCONDITION, this.doGetName(), "Failed executing constructor!");
            this.assertIsNotNullOrUndefined(ExceptionType.POSTCONDITION, this.getNoComponents(), "Failed executing constructor!");
        } catch (e: any) {
            throw new ServiceFailureException("Failed executing constructor!", e);
        }
    }

    public getNoComponents(): number {
        try {
            let numberOfComp: number = this.doGetNoComponents();

            // CLASS INV
            this.ensureInvariants();
            // POST
            this.assertIsNotNullOrUndefined(ExceptionType.POSTCONDITION, numberOfComp, "Failed executing getNoComponents()!");

            return numberOfComp;
        } catch (e: any) {
            throw new ServiceFailureException("Failed getting number of components!", e);
        }
    }
    protected doGetNoComponents(): number {
        return this.noComponents
    }	

    private toArray(): string[] {
        const name: string = this.doGetName();
        const delimiter: string = this.doGetDelimiterCharacter();
        if (name === '') {
            return [''];
        }

        const array: string[] = [''];
        let isPreviousCharEscape = false;

        for (let i = 0; i < name.length; i++) {
            const currentChar = name.charAt(i);

            if (isPreviousCharEscape) {
                array[array.length - 1] += currentChar;
                isPreviousCharEscape = false;
            } else {
                if (currentChar === ESCAPE_CHARACTER) {
                    array[array.length - 1] += currentChar;
                    isPreviousCharEscape = true;
                } else if (currentChar === delimiter) {
                    array.push('');
                } else {
                    array[array.length - 1] += currentChar;
                }
            }
        }
        return array;
    }

    public getComponent(i: number): string {
        try {
            // PRE
            this.assertValidIndex(ExceptionType.PRECONDITION, i);

            let str = this.toArray()[i];
            // CLASS INV
            this.ensureInvariants();
            // POST
            this.assertEscapedString(ExceptionType.POSTCONDITION, str);

            return str;
        } catch (e: any) {
            throw new ServiceFailureException("Failed getting component!", e);
        }
    }

    public setComponent(i: number, c: string): StringName {
        // Collecting old values for post condition
        let clone: StringName = this.createDeepCopy();
        try {
            // PRE
            clone.assertValidIndex(ExceptionType.PRECONDITION, i);
            clone.assertEscapedString(ExceptionType.PRECONDITION, c);

            let arr: string[] = clone.toArray();
            arr[i] = c;
            let str: string = arr.join(clone.getDelimiterCharacter());

            clone.noComponents = arr.length;
            clone.name = str;

            // CLASS INV
            this.ensureInvariants();
            // POST
            clone.assertIsNotNullOrUndefined(ExceptionType.POSTCONDITION, clone.doGetNoComponents(), "Failed setting component!");
            clone.assertIsNotNullOrUndefined(ExceptionType.POSTCONDITION, clone.doGetName(), "Failed setting component!");

            return clone;
        } catch (e: any) {
            throw new ServiceFailureException("Failed setting component!", e);
        }
    }

    public insert(i: number, c: string): StringName {
        // Cloning old state for post condition
        let clone: StringName = this.createDeepCopy();
        try {
            // PRE
            clone.assertValidIndex(ExceptionType.PRECONDITION, i);
            clone.assertEscapedString(ExceptionType.PRECONDITION, c);
            let oldNoComponents: number = clone.doGetNoComponents();

            let arr: string[] = clone.toArray();
            arr.splice(i, 0, c);
            let str: string = arr.join(clone.getDelimiterCharacter());

            clone.noComponents = arr.length;
            clone.name = str;

            // CLASS INV
            this.ensureInvariants();
            // POST
            clone.assertValidComponentAddition(ExceptionType.POSTCONDITION, i, oldNoComponents);
            return clone;
        } catch (e: any) {
            throw new ServiceFailureException("Failed inserting component!", e);
        }
    }

    public append(c: string): StringName {
        // Cloning old state for post condition
        let clone: StringName = this.createDeepCopy();
        try {
            // PRE
            clone.assertEscapedString(ExceptionType.PRECONDITION, c);

            let oldNoComponents: number = clone.doGetNoComponents();

            clone.name = clone.doGetName() + clone.getDelimiterCharacter() + c;
            clone.noComponents = clone.doGetNoComponents() + 1;

            // CLASS INV
            this.ensureInvariants();
            // POST
            clone.assertValidComponentAddition(ExceptionType.POSTCONDITION, clone.doGetNoComponents() - 1, oldNoComponents);

            return clone;
        } catch (e: any) {
            throw new ServiceFailureException("Failed appending component!", e);
        }
    }

    public remove(i: number): StringName {
        // Cloning old state for post condition
        let clone: StringName = this.createDeepCopy();
        try {
            // PRE
            clone.assertValidIndex(ExceptionType.PRECONDITION, i);
            let oldNoComponents: number = clone.doGetNoComponents();

            let arr: string[] = clone.toArray();
            arr.splice(i, 1);
            let str: string = arr.join(clone.getDelimiterCharacter());

            clone.noComponents = arr.length;
            clone.name = str;

            // CLASS INV
            this.ensureInvariants();
            // POST
            clone.assertValidRemoval(ExceptionType.POSTCONDITION, oldNoComponents);

            return clone;
        } catch (e: any) {
            throw new ServiceFailureException("Failed removing component!", e);
        }
    }

    protected createDeepCopy(): StringName {
        return new StringName(this.doGetName(), this.getDelimiterCharacter());
    }

    protected ensureInvariants(): void {
        super.ensureInvariants();
        //this.assertValidName();
    }
    private doGetName(): string {
        return this.name;
    }
}