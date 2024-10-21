export class Name {

    public readonly DEFAULT_DELIMITER: string = '.';
    private readonly ESCAPE_CHARACTER = '\\';

    private components: string[] = [];
    private delimiter: string = this.DEFAULT_DELIMITER;

    /**
     * @InitializationMethod
     */
    constructor(other: string[], delimiter?: string) {
        if (delimiter) {
            this.delimiter = delimiter;
        }
        this.components = other;
    }

    /**
     * @ConversionMethod
     */
    public asNameString(delimiter: string = this.delimiter): string {
        return this.components.join(delimiter);
    }
    
    /**
     * @GetMethod
     */
    public getComponent(i: number): string {
        return this.components[i];
    }

    /**
     * @SetMethod
     */
    public setComponent(i: number, c: string): void {
        this.components[i] = c;
    }

    /**
     * @GetMethod
     */
    public getNoComponents(): number {
        return this.components.length;
    }

    /**
     * @CommandMethod
     */
    public insert(i: number, c: string): void {
        this.components.splice(i, 0, c);
    }

    /**
     * @CommandMethod
     */
    public append(c: string): void {
        this.components.push(c);
    }

    /**
     * @CommandMethod
     */
    public remove(i: number): void {
        this.components.splice(i, 1);
    }

}