export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    /**
     * @methodtype initialization-method
     */
    constructor(other: string[], delimiter?: string) {
        if (delimiter) {
            this.delimiter = delimiter;
        }
        this.components = other;
    }

    /**
     *
     * @methodtype conversion-method
     *
     * Returns a human-readable representation of the Name instance using user-set control characters
     * Control characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    public asString(delimiter: string = this.delimiter): string {
        throw new Error("needs implementation");
    }

    /** 
     * Returns a machine-readable representation of Name instance using default control characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The control characters in the data string are the default characters
     */
    public asDataString(): string {
        return this.components.join(this.delimiter);
    }
    
    /**
     * @methodtype get-method 
     */
    public getComponent(i: number): string {
        return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    /**
     * @methodtype set-method
     */
    public setComponent(i: number, c: string): void {
        this.components[i] = c;
    }

    /**
     * @methodtype get-method 
     */
    public getNoComponents(): number {
        return this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    /**
     * @methodtype command-method
     */
    public insert(i: number, c: string): void {
        this.components.splice(i, 0, c);
    }

    /** Expects that new Name component c is properly masked */
    /**
     * @methodtype command-method
     */
    public append(c: string): void {
        this.components.push(c);
    }

    /**
     * @methodtype command-method
     */
    public remove(i: number): void {
        this.components.splice(i, 1);
    }

}