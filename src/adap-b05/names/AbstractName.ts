import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        // PRE
        this.assertValidDelimiter(IllegalArgumentException, delimiter);

        if (delimiter)
            this.delimiter = delimiter;
        else
            this.delimiter = DEFAULT_DELIMITER;

        // POST
        this.assertValidDelimiter(MethodFailedException, delimiter);
        // CLASS INV
        this.ensureInvariants();
    }

    public clone(): Name {
        // CLASS INV
        this.ensureInvariants();

        let clone: Name = { ...this };

        // POST
        MethodFailedException.assertIsNotNullOrUndefined(clone, "Could not execute clone()!");
        MethodFailedException.assertCondition(this !== clone, "Clone is not a deep copy.");
        return clone;
    }

    public asString(delimiter: string = this.getDelimiterCharacter()): string {
        // CLASS INV
        this.ensureInvariants();
        // PRE
        this.assertValidDelimiter(IllegalArgumentException, delimiter);

        let str: string[] = this.getComponents();
        let length: number = this.getNoComponents();
        for (let i: number = 0; i < length; i++) {
            str[i] = this.removeEscapeCharacters(str[i], delimiter);
        }
        let result = str.join(delimiter);

        // POST
        this.assertUnescapedString(MethodFailedException, result);
        return result;
    }

    private removeEscapeCharacters(s: string, delimiter: string): string {
        let buff: string = "Ǽ"; // \. or \\.
        let masked: string = s.replaceAll(delimiter + delimiter, buff);
        return masked.replaceAll(delimiter, "").replaceAll(buff, delimiter);
    }

    public toString(): string {
        // CLASS INV
        this.ensureInvariants();

        let str: string = this.getComponents().join(this.getDelimiterCharacter());

        // POST
        MethodFailedException.assertIsNotNullOrUndefined(str, "Could not execute toString()!");

        return str;
    }

    // We assume that delimiter inside a component is escaped with ESCAPE_CHARACTER
    public asDataString(): string {
        // CLASS INV
        this.ensureInvariants();

        let str: string = this.toString();

        // POST
        MethodFailedException.assertIsNotNullOrUndefined(str, "Could not execute asDataString()!");

        return str;
    }

    private getComponents(): string[] {
        let str: string[] = [];
        let length: number = this.getNoComponents();

        for (let i: number = 0; i < length; i++) {
            str.push(this.getComponent(i));
        }
        return str;
    }

    public isEqual(other: Name): boolean {
        // CLASS INV
        this.ensureInvariants();
        // PRE
        IllegalArgumentException.assertIsNotNullOrUndefined(other, "Name is null!");

        let flag: boolean = this.toString() == other.toString();

        // POST 
        MethodFailedException.assertIsNotNullOrUndefined(flag, "Could not execute isEqual()!");

        return flag;
    }

    public getHashCode(): number {
        // CLASS INV
        this.ensureInvariants();

        let hashCode: number = 0;
        const s: string = this.toString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }

        // POST
        MethodFailedException.assertIsNotNullOrUndefined(hashCode, "Could not execute getHashCode()!");

        return hashCode;
    }

    public isEmpty(): boolean {
        // CLASS INV
        this.ensureInvariants();

        let flag: boolean = this.getComponents().length === 0;

        // POST 
        MethodFailedException.assertIsNotNullOrUndefined(flag, "Could not execute isEmpty()!");

        return flag;
    }

    public getDelimiterCharacter(): string {
        // CLASS INV
        this.ensureInvariants();

        let str: string = this.delimiter;

        // PRE
        MethodFailedException.assertIsNotNullOrUndefined(str, "Could not execute getDelimiterCharacter()!");

        return str;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        // CLASS INV
        this.ensureInvariants();
        // PRE
        IllegalArgumentException.assertIsNotNullOrUndefined(other, "Name is null!");

        // Cloning old state for post condition
        let clone: Name = this.clone();

        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }

        // POST
        try {
            MethodFailedException.assertIsNotNullOrUndefined(this, "Could not execute concat()!");
        } catch (e: any) {
            Object.assign(this, clone);
            throw e;
        }
    }

    protected ensureInvariants(): void {
        InvalidStateException.assertIsNotNullOrUndefined(this.delimiter, "Delimiter must not be null!");
        InvalidStateException.assertCondition(this.delimiter.length === 1, "Delimiter must be a single character!");
    }
    protected assertEscapedString(exceptionClass: any, component: string): void {
        exceptionClass.assertIsNotNullOrUndefined(component, "String must not be null!");
        const regex = new RegExp(`(?<!${ESCAPE_CHARACTER.replace(/[.*+?^${}()|[\]\\]/g, '\\[[[[CODEBLOCK_0]]]]amp;')})${this.delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\[[[[CODEBLOCK_0]]]]amp;')}`, 'g');
        exceptionClass.assertCondition(!regex.test(component), "String is not valid unescaped!");
    }
    protected assertUnescapedString(exceptionClass: any, component: string): void {
        exceptionClass.assertIsNotNullOrUndefined(component, "String must not be null!");
        const regex = new RegExp(`(?<=${ESCAPE_CHARACTER.replace(/[.*+?^${}()|[\]\\]/g, '\\[[[[CODEBLOCK_0]]]]amp;')})${this.delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\[[[[CODEBLOCK_0]]]]amp;')}`, 'g');
        exceptionClass.assertCondition(!regex.test(component), "String is escaped!");
    }
    protected assertValidDelimiter(exceptionClass: any, delimiter: string = this.delimiter): void {
        exceptionClass.assertIsNotNullOrUndefined(delimiter, "Delimiter must not be null!");
        exceptionClass.assertCondition(delimiter.length === 1, "Delimiter must be a single character!");
    }
    protected assertValidIndex(exceptionClass: any, i: number) {
        exceptionClass.assertIsNotNullOrUndefined(i, "Index must not be null!");
        exceptionClass.assertCondition(i < this.getNoComponents(), "Index must be positive!");
    }
    protected assertValidRemoval(exceptionClass: any, oldNoComponents: number) {
        exceptionClass.assertIsNotNullOrUndefined(this.getNoComponents(), "Failed removing component!");
        exceptionClass.assertCondition(oldNoComponents - 1 === this.getNoComponents(), "Failed removing component!");
    }
    protected assertValidComponentAddition(exceptionClass: any, index: number, oldNoComponents: number) {
        exceptionClass.assertCondition(this.getNoComponents() === oldNoComponents + 1, "Failed adding component!");
        this.assertEscapedString(exceptionClass, this.getComponent(index));
    }
}