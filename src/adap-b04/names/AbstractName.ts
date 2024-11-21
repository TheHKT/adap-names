import { Exception } from "../common/Exception";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailureException } from "../common/MethodFailureException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        // PRE
        this.assertValidDelimiter(new IllegalArgumentException("Delimiter must be a single character and not null!"), delimiter);

        if (delimiter)
            this.delimiter = delimiter;
        else
            this.delimiter = DEFAULT_DELIMITER;

        // POST
        this.assertValidDelimiter(new MethodFailureException("Could not execute constructor!"), delimiter);
        // CLASS INV
        this.assertValidState();
    }

    public clone(): Name {
        // CLASS INV
        this.assertValidState();

        let clone: Name = { ...this };

        // POST
        this.assertSuccessfulClone(clone);

        return clone;
    }

    public asString(delimiter: string = this.getDelimiterCharacter()): string {
        // CLASS INV
        this.assertValidState();
        // PRE
        this.assertValidDelimiter(new IllegalArgumentException("Delimiter must be a single character!"), delimiter);

        let str: string[] = this.getComponents();
        let length: number = this.getNoComponents();
        for (let i: number = 0; i < length; i++) {
            str[i] = this.removeEscapeCharacters(str[i], delimiter);
        }
        let result = str.join(delimiter);

        // POST
        this.assertUnescapedString(new MethodFailureException("String has escaped delimiters!"), result);
        return result;
    }

    private removeEscapeCharacters(s: string, delimiter: string): string {
        let buff: string = "Ǽ"; // \. or \\.
        let masked: string = s.replaceAll(delimiter + delimiter, buff);
        return masked.replaceAll(delimiter, "").replaceAll(buff, delimiter);
    }

    public toString(): string {
        // CLASS INV
        this.assertValidState();

        let str: string = this.getComponents().join(this.getDelimiterCharacter());

        // POST
        this.assertValidString(new MethodFailureException("Could not execute toString()!"), str);

        return str;
    }

    // We assume that delimiter inside a component is escaped with ESCAPE_CHARACTER
    public asDataString(): string {
        // CLASS INV
        this.assertValidState();

        let str: string = this.toString();

        // POST
        this.assertValidString(new MethodFailureException("Could not execute asDataString()!"), str);

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
        this.assertValidState();
        // PRE
        this.assertValidNameInstance(new IllegalArgumentException("Name is null!"), other);

        let flag: boolean = this.toString() == other.toString();

        // POST 
        this.assertValidBoolean(new MethodFailureException("Could not execute isEqual()!"), flag);
        return flag;
    }

    public getHashCode(): number {
        // CLASS INV
        this.assertValidState();

        let hashCode: number = 0;
        const s: string = this.toString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }

        // POST
        this.assertValidHashCode(new MethodFailureException("Could not execute isEqual()!"), hashCode);

        return hashCode;
    }

    public isEmpty(): boolean {
        // CLASS INV
        this.assertValidState();

        let flag: boolean = this.getComponents().length === 0;

        // POST 
        this.assertValidBoolean(new MethodFailureException("Could not execute isEmpty()!"), flag);

        return flag;
    }

    public getDelimiterCharacter(): string {
        // CLASS INV
        this.assertValidState();

        let str: string = this.delimiter;

        // PRE
        this.assertValidDelimiter(new MethodFailureException("Could not execute getDelimiterCharacter()!"));
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
        this.assertValidState();
        // PRE
        this.assertValidNameInstance(new IllegalArgumentException("Name is null!"), other);
        // Cloning old state for post condition
        let clone: Name = this.clone();

        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }

        // POST
        try {
            this.assertValidNameInstance(new MethodFailureException("Name is null!"), this);
        } catch (e: any) {
            Object.assign(this, clone);
            throw e;
        }
    }

    protected assertValidState(): void {
        this.assertValidDelimiter(new InvalidStateException("Delimiter must be a single character!"));
    }
    protected assertEscapedString(exception: Exception, component: string): void {
        this.assertValidString(exception, component);
        const regex =
            new RegExp(`(?<!${ESCAPE_CHARACTER.replace(/[.*+?^${}()|[\]\\]/g, '\\[[[[CODEBLOCK_0]]]]amp;')})${this.delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\[[[[CODEBLOCK_0]]]]amp;')}`, 'g');
        if (regex.test(component)) {
            throw exception;
        }
    }
    protected assertValidDelimiter(exception: Exception, delimiter: string = this.delimiter): void {
        this.assertValidString(exception, delimiter);
        if (delimiter.length !== 1) {
            throw exception;
        }
    }
    protected assertUnescapedString(exception: Exception, component: string): void {
        this.assertValidString(exception, component);
        const regex =
            new RegExp(`(?<=${ESCAPE_CHARACTER.replace(/[.*+?^${}()|[\]\\]/g, '\\[[[[CODEBLOCK_0]]]]amp;')})${this.delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\[[[[CODEBLOCK_0]]]]amp;')}`, 'g');
        if (regex.test(component)) {
            throw exception;
        }
    }
    protected assertSuccessfulClone(clone: Name): void {
        this.assertValidNameInstance(new MethodFailureException("Clone is null."), clone);
        if (this === clone) {
            throw new MethodFailureException("Clone is not a deep copy.");
        }
    }
    protected assertValidString(exception: Exception, s: string): void {
        if (s == null) {
            throw exception;
        }
    }
    protected assertValidNameInstance(exception: Exception, name: Name): void {
        if (name == null) {
            throw exception;
        }
    }
    protected assertValidBoolean(exception: Exception, b: boolean): void {
        if (b == null) {
            throw exception;
        }
    }
    protected assertValidHashCode(exception: Exception, hashCode: number): void {
        if (hashCode == null) {
            throw exception;
        }
    }

    protected assertValidIndex(e: Exception, i: number) {
        this.assertValidNumber(e, i);
        if (i >= this.getNoComponents()) {
            throw e;
        }
    }
    protected assertValidNumber(exception: Exception, num: number): void {
        if (num == null || num < 0) {
            throw exception;
        }
    }
    protected assertSuccessfulRemoval(exception: Exception, oldNoComponents: number): void {
        if (oldNoComponents == this.getNoComponents()) {
            throw exception;
        }
    }
}