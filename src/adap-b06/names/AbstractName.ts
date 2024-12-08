import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

import { AssertionDispatcher, ExceptionType } from "../common/AssertionDispatcher";
import { Cloneable } from "../common/Cloneable";
import { ServiceFailureException } from "../common/ServiceFailureException";

export abstract class AbstractName implements Name, Cloneable {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        try {
            // PRE
            this.assertValidDelimiter(ExceptionType.PRECONDITION, delimiter);

            if (delimiter)
                this.delimiter = delimiter;
            else
                this.delimiter = DEFAULT_DELIMITER;

            // CLASS INV
            this.ensureInvariants();

            // POST
            this.assertValidDelimiter(ExceptionType.POSTCONDITION, delimiter);
        } catch (e: any) {
            throw new ServiceFailureException("Could not construct", e);
        }
    }

    public clone(): Name {
        try {
            const temp = Object.create(Object.getPrototypeOf(this));
            const clone = Object.assign(temp, this);

            // CLASS INV
            this.ensureInvariants();

            // POST
            this.assertIsNotNullOrUndefined(ExceptionType.POSTCONDITION, clone, "Could not execute clone()!");
            AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION, this !== clone, "Clone is not a deep copy.");
            return clone;
        } catch (e: any) {
            throw new ServiceFailureException("Could not clone", e);
        }
    }

    public asString(delimiter: string = this.doGetDelimiterCharacter()): string {
        try {
            // PRE
            this.assertValidDelimiter(ExceptionType.PRECONDITION, delimiter);

            let str: string[] = this.doGetComponentsFr().slice();
            let length: number = this.getNoComponents();
            for (let i: number = 0; i < length; i++) {
                str[i] = this.removeEscapeCharacters(str[i], delimiter);
            }
            let result = str.join(delimiter);

            // CLASS INV
            this.ensureInvariants();

            // POST
            this.assertIsNotNullOrUndefined(ExceptionType.POSTCONDITION, result, "Could not execute asString()!");
            return result;
        } catch (e: any) {
            throw new ServiceFailureException("Could not convert to string", e);
        }
    }

    private removeEscapeCharacters(inputString: string, delimiter: string): string {
            let previousCharIsEscape: boolean = false;
            let unmaskedString: string = '';
            for (let index = 0; index < inputString.length; index++) {
                let currentChar = inputString.charAt(index);
                if (previousCharIsEscape) {
                    if (currentChar === ESCAPE_CHARACTER) {
                        unmaskedString += ESCAPE_CHARACTER;
                    } else if (currentChar === delimiter) {
                        unmaskedString += delimiter;
                    } else {
                        unmaskedString += currentChar;
                    }
                    previousCharIsEscape = false;
                } else {
                    if (currentChar === ESCAPE_CHARACTER) {
                        previousCharIsEscape = true;
                    } else {
                        unmaskedString += currentChar;
                    }
                }
            }
            return unmaskedString;
    }

    public toString(): string {
        try {
            let str: string = this.asDataString();

            // CLASS INV
            this.ensureInvariants();
            // POST
            this.assertIsNotNullOrUndefined(ExceptionType.POSTCONDITION, str, "Could not execute toString()!");

            return str;
        } catch (e: any) {
            throw new ServiceFailureException("Could not convert to string", e);
        }
    }

    // We assume that delimiter inside a component is escaped with ESCAPE_CHARACTER
    public asDataString(): string {
        try {
            let nameField: string = '';
            const delimiter: string = this.doGetDelimiterCharacter();
            const noComponents: number = this.getNoComponents();

            for (let i = 0; i < noComponents; i++) {
                let component: string = this.getComponent(i);
                nameField += component;
                if (i < noComponents - 1) {
                    nameField += delimiter;
                }
            }

            const json = JSON.stringify({ delimiter: delimiter, name: nameField });

            // CLASS INV
            this.ensureInvariants();
            // POST
            this.assertIsNotNullOrUndefined(ExceptionType.POSTCONDITION, json, "Could not execute asDataString()!");

            return json;
        } catch (e: any) {
            throw new ServiceFailureException("Could not convert to data string", e);
        }
    }

    private doGetComponentsFr(): string[] {
        let str: string[] = [];
        let length: number = this.getNoComponents();

        for (let i: number = 0; i < length; i++) {
            str.push(this.getComponent(i));
        }
        return str;
    }

    public isEqual(other: Name): boolean {
        try {
            // PRE
            this.assertIsNotNullOrUndefined(ExceptionType.PRECONDITION, other, "Name is null!");

            let flag: boolean = this.toString() == other.toString();

            // CLASS INV
            this.ensureInvariants();
            // POST
            this.assertIsNotNullOrUndefined(ExceptionType.PRECONDITION, flag, "Could not execute isEqual()!");

            return flag;
        } catch (e: any) {
            throw new ServiceFailureException("Could not compare", e);
        }
    }

    public getHashCode(): number {
        try {
            let hashCode: number = 0;
            const s: string = this.toString();
            for (let i = 0; i < s.length; i++) {
                let c = s.charCodeAt(i);
                hashCode = (hashCode << 5) - hashCode + c;
                hashCode |= 0;
            }
            // CLASS INV
            this.ensureInvariants();
            // POST
            this.assertIsNotNullOrUndefined(ExceptionType.POSTCONDITION, hashCode, "Could not execute getHashCode()!");

            return hashCode;
        } catch (e: any) {
            throw new ServiceFailureException("Could not get hash code", e);
        }
    }

    public isEmpty(): boolean {
        try {
            let flag: boolean = this.doGetComponentsFr().length === 0;

            // CLASS INV
            this.ensureInvariants();
            // POST
            this.assertIsNotNullOrUndefined(ExceptionType.POSTCONDITION, flag, "Could not execute isEmpty()!");

            return flag;
        } catch (e: any) {
            throw new ServiceFailureException("Could not check if empty", e);
        }
    }

    protected doGetDelimiterCharacter(): string {
        return this.delimiter;
    }
    public getDelimiterCharacter(): string {
        try {
            let str: string = this.doGetDelimiterCharacter();

            // CLASS INV
            this.ensureInvariants();
            // PRE
            this.assertIsNotNullOrUndefined(ExceptionType.POSTCONDITION, str, "Could not execute getDelimiterCharacter()!");

            return str;
        } catch (e: any) {
            throw new ServiceFailureException("Could not get delimiter character", e);
        }
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): Name;

    abstract insert(i: number, c: string): Name;
    abstract append(c: string): Name;
    abstract remove(i: number): Name;

    public concat(other: Name): Name {
        // Cloning old state for post condition
        let clone: Name = this.clone();
        try {
            // PRE
            this.assertIsNotNullOrUndefined(ExceptionType.PRECONDITION, other, "Name is null!");

            for (let i = 0; i < other.getNoComponents(); i++) {
                clone = clone.append(other.getComponent(i));
            }

            // CLASS INV
            this.ensureInvariants();
            // POST
            this.assertIsNotNullOrUndefined(ExceptionType.POSTCONDITION, clone, "Could not execute concat()!");
            return clone;
        } catch (e: any) {
            throw new ServiceFailureException("Could not concat", e);
        }
    }

    protected ensureInvariants(): void {
        this.assertIsNotNullOrUndefined(ExceptionType.CLASS_INVARIANT, this.delimiter, "Delimiter must not be null!");
        AssertionDispatcher.dispatch(ExceptionType.CLASS_INVARIANT, this.delimiter.length === 1, "Delimiter must be a single character!");
    }
    protected assertEscapedString(exceptionClass: ExceptionType, component: string): void {
        this.assertIsNotNullOrUndefined(exceptionClass, component, "String must not be null!");
        let readEscapeChar: boolean = false;
        for (let i = 0; i < component.length; i++) {
            if (component.charAt(i) === ESCAPE_CHARACTER) {
                readEscapeChar = !readEscapeChar;
            } else if (component.charAt(i) === this.getDelimiterCharacter()) {
                if (!readEscapeChar) {
                    AssertionDispatcher.dispatch(exceptionClass, false, "String is not valid escaped!");
                    break;
                }
                readEscapeChar = false;
            } else {
                readEscapeChar = false;
            }
        }
    }
    protected assertValidDelimiter(exceptionClass: ExceptionType, delimiter: string = this.delimiter): void {
        this.assertIsNotNullOrUndefined(exceptionClass, delimiter, "Delimiter must not be null!");
        AssertionDispatcher.dispatch(exceptionClass, delimiter.length === 1, "Delimiter must be a single character!");
        AssertionDispatcher.dispatch(exceptionClass, delimiter !== ESCAPE_CHARACTER, "Delimiter must not be escape character!");
    }
    protected assertValidIndex(exceptionClass: ExceptionType, i: number) {
        this.assertIsNotNullOrUndefined(exceptionClass, i, "Index must not be null!");
        AssertionDispatcher.dispatch(exceptionClass, i < this.getNoComponents() && i>=0, "Index must be within the array!");
    }
    protected assertValidRemoval(exceptionClass: ExceptionType, oldNoComponents: number) {
        this.assertIsNotNullOrUndefined(exceptionClass, this.getNoComponents(), "Failed removing component!");
        AssertionDispatcher.dispatch(exceptionClass, oldNoComponents - 1 === this.getNoComponents(), "Failed removing component!");
    }
    protected assertValidComponentAddition(exceptionType: ExceptionType, index: number, oldNoComponents: number) {
        AssertionDispatcher.dispatch(exceptionType, this.getNoComponents() === oldNoComponents + 1, "Failed adding component!");
        this.assertEscapedString(exceptionType, this.getComponent(index));
    }
    protected assertIsNotNullOrUndefined(exceptionType: ExceptionType, obj: any, message: string) {
        AssertionDispatcher.dispatch(exceptionType, obj !== null && obj !== undefined, message);
    }
}