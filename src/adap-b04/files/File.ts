import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        // PRE
        IllegalArgumentException.assertIsNotNullOrUndefined(baseName, "bn is null");
        IllegalArgumentException.assertIsNotNullOrUndefined(parent, "P is null");

        super(baseName, parent);

        // POST
        MethodFailureException.assertIsNotNullOrUndefined(baseName, "bn is null");
        MethodFailureException.assertIsNotNullOrUndefined(parent, "P is null");

        // CLASS INV
        this.ensureInvariants();
    }

    public open(): void {
        // CLASS INV
        this.ensureInvariants();

        // PRE
        this.assertIsInValidState(IllegalArgumentException, FileState.CLOSED)
        let clone = this.clone();

        // do something

        // POST
        try {
            this.assertIsInValidState(MethodFailureException, FileState.OPEN);
        } catch (exception: any) {
            Object.assign(this, clone);
            throw exception;
        }
    }

    public close(): void {
        // CLASS INV
        this.ensureInvariants();

         // PRE
         this.assertIsInValidState(IllegalArgumentException, FileState.OPEN)
         let clone = this.clone();
 
         // do something
 
         // POST
         try {
             this.assertIsInValidState(MethodFailureException, FileState.CLOSED);
         } catch (exception: any) {
             Object.assign(this, clone);
             throw exception;
         }
    }

    protected doGetFileState(): FileState {
        // CLASS INV
        this.ensureInvariants();

        let res = this.state;

        // POST
        MethodFailureException.assertIsNotNullOrUndefined(res, "Res is null");
        return res;
    }

    private assertIsInValidState(exceptionClass: any, expectedFs: FileState) {
        exceptionClass.assertCondition(expectedFs == this.doGetFileState());
    }
}