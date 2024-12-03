import { ESCAPE_CHARACTER } from "../common/Printable";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";
import { MethodFailedException } from "../common/MethodFailedException";
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

            this.setName(other);
            this.setNoComponents(this.toArray().length);

            // CLASS INV
            this.ensureInvariants();
            // POST
            this.assertIsNotNullOrUndefined(ExceptionType.POSTCONDITION, this.getName(), "Failed executing constructor!");
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
    private setNoComponents(noComponents: number) {
        this.noComponents = noComponents;
    }
    private toArray(): string[] {
        const regexEscapedDelimiter = this.getDelimiterCharacter().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const rx = new RegExp(`(?<!\\${ESCAPE_CHARACTER})${regexEscapedDelimiter}`, "g");
        return this.getName().split(rx);
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

    public setComponent(i: number, c: string) {
        // Collecting old values for post condition
        let clone: Name = this.clone();
        try {
            // PRE
            this.assertValidIndex(ExceptionType.PRECONDITION, i);
            this.assertEscapedString(ExceptionType.PRECONDITION, c);

            let arr: string[] = this.toArray();
            arr[i] = c;
            let str: string = arr.join(this.getDelimiterCharacter());
            this.setNoComponents(arr.length);
            this.setName(str);

            // CLASS INV
            this.ensureInvariants();
            // POST
            this.assertIsNotNullOrUndefined(ExceptionType.POSTCONDITION, this.doGetNoComponents(), "Failed setting component!");
            this.assertIsNotNullOrUndefined(ExceptionType.POSTCONDITION, this.getName(), "Failed setting component!");
        } catch (e: any) {
            if (e instanceof MethodFailedException) {
                Object.assign(this, clone);
            }
            throw new ServiceFailureException("Failed setting component!", e);
        }
    }

    public insert(i: number, c: string) {
        // Cloning old state for post condition
        let clone: Name = this.clone();
        try {
            // PRE
            this.assertValidIndex(ExceptionType.PRECONDITION, i);
            this.assertEscapedString(ExceptionType.PRECONDITION, c);
            let oldNoComponents: number = this.doGetNoComponents();

            let arr: string[] = this.toArray();
            arr.splice(i, 0, c);
            let str: string = arr.join(this.getDelimiterCharacter());
            this.setNoComponents(arr.length);
            this.setName(str);

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

            let oldNoComponents: number = this.doGetNoComponents();

            this.setName(this.getName() + this.getDelimiterCharacter() + c);
            this.setNoComponents(this.doGetNoComponents() + 1);

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
            let oldNoComponents: number = this.doGetNoComponents();

            let arr: string[] = this.toArray();
            arr.splice(i, 1);
            let str: string = arr.join(this.getDelimiterCharacter());
            this.setNoComponents(arr.length);
            this.setName(str);

            // CLASS INV
            this.ensureInvariants();
            // POST
            this.assertValidRemoval(ExceptionType.POSTCONDITION, oldNoComponents);
        } catch (e: any) {
            if (e instanceof MethodFailedException) {

                Object.assign(this, clone);
            }
            throw new ServiceFailureException("Failed removing component!", e);
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