import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailureException } from "../common/MethodFailureException";
import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        // PRE
        IllegalArgumentException.assertIsNotNullOrUndefined(bn, "Base name is null or undefined.");
        IllegalArgumentException.assertIsNotNullOrUndefined(pn, "Parent node is null or undefined.");

        this.doSetBaseName(bn);
        this.parentNode = pn;

        // POST
        MethodFailureException.assertIsNotNullOrUndefined(this.baseName, "Base name is null or undefined.");
        MethodFailureException.assertIsNotNullOrUndefined(this.parentNode, "Parent node is null or undefined.");

        // CLASS INV
        this.ensureInvariants();
    }

    public move(to: Directory): void {
        // CLASS INV
        this.ensureInvariants();

        // PRE
        IllegalArgumentException.assertIsNotNullOrUndefined(to, "Destination is null or undefined.");
        let clone = this.clone();

        this.parentNode.remove(this);
        to.add(this);

        // POST
        try {
            MethodFailureException.assertCondition(this.getParentNode() === to, "Node was not moved to destination.");
        } catch (exception: any) {
            Object.assign(this, clone);
            throw exception;
        }
    }

    public getFullName(): Name {
        // CLASS INV
        this.ensureInvariants();

        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());

        // POST
        MethodFailureException.assertIsNotNullOrUndefined(result, "Result was null");

        return result;
    }

    public getBaseName(): string {
        // CLASS INV
        this.ensureInvariants();

        let res: string = this.doGetBaseName();

        // POST
        MethodFailureException.assertIsNotNullOrUndefined(res, "Result was null");

        return res
    }

    protected doGetBaseName(): string {
        // CLASS INV
        this.ensureInvariants();

        let res: string = this.baseName;

        // POST
        MethodFailureException.assertIsNotNullOrUndefined(res, "Result was null");

        return res;
    }

    public rename(bn: string): void {
        // CLASS INV
        this.ensureInvariants();
        // PRE
        IllegalArgumentException.assertIsNotNullOrUndefined(bn, "Wrong bn");
        let clone = this.clone();

        this.doSetBaseName(bn);
        // POST
        try {
            MethodFailureException.assertIsNotNullOrUndefined(this.baseName);
        } catch (exception: any) {
            Object.assign(this, clone);
            throw exception;
        }
    }

    protected doSetBaseName(bn: string): void {
        // CLASS INV
        this.ensureInvariants();
        // PRE
        IllegalArgumentException.assertIsNotNullOrUndefined(bn, "Wrong bn");
        let clone = this.clone();

        this.baseName = bn;

        //POST
        try {
        MethodFailureException.assertIsNotNullOrUndefined(this.baseName, "Bn null");
        } catch (exception : any) {
            Object.assign(this, clone);
            throw exception;
        }
    }

    public getParentNode(): Node {
        // CLASS INV
        this.ensureInvariants();

        let res : Node = this.parentNode;

        // POST
        MethodFailureException.assertIsNotNullOrUndefined(res, "ParentNode is null");

        return res;
    }

    protected ensureInvariants(): void {
        InvalidStateException.assertIsNotNullOrUndefined(this.baseName, "Base name is null or undefined.");
        InvalidStateException.assertIsNotNullOrUndefined(this.parentNode, "Parent node is null or undefined.");
    }

    protected clone(): Node {
        return {...this};
    }

}
