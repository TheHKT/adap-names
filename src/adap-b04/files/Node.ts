import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
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
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);

        // POST
        MethodFailedException.assertIsNotNullOrUndefined(this.baseName, "Base name is null or undefined.");
        MethodFailedException.assertIsNotNullOrUndefined(this.parentNode, "Parent node is null or undefined.");

        // CLASS INV
        this.ensureInvariants();
    }

    public move(to: Directory): void {
        // CLASS INV
        this.ensureInvariants();

        // PRE
        IllegalArgumentException.assertIsNotNullOrUndefined(to, "Destination is null or undefined.");
        let clone = this.clone();

        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;

        // POST
        try {
            MethodFailedException.assertCondition(this.getParentNode() === to, "Node was not moved to destination.");
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
        MethodFailedException.assertIsNotNullOrUndefined(result, "Result was null");

        return result;
    }

    public getBaseName(): string {
        // CLASS INV
        this.ensureInvariants();

        let res: string = this.doGetBaseName();

        // POST
        MethodFailedException.assertIsNotNullOrUndefined(res, "Result was null");

        return res
    }

    protected doGetBaseName(): string {
        // CLASS INV
        this.ensureInvariants();

        let res: string = this.baseName;

        // POST
        MethodFailedException.assertIsNotNullOrUndefined(res, "Result was null");

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
            MethodFailedException.assertIsNotNullOrUndefined(this.baseName);
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
            MethodFailedException.assertIsNotNullOrUndefined(this.baseName, "Bn null");
        } catch (exception: any) {
            Object.assign(this, clone);
            throw exception;
        }
    }

    public getParentNode(): Directory {
        // CLASS INV
        this.ensureInvariants();

        let res: Directory = this.parentNode;

        // POST
        MethodFailedException.assertIsNotNullOrUndefined(res, "ParentNode is null");

        return res;
    }

    protected ensureInvariants(): void {
        InvalidStateException.assertIsNotNullOrUndefined(this.baseName, "Base name is null or undefined.");
        InvalidStateException.assertIsNotNullOrUndefined(this.parentNode, "Parent node is null or undefined.");
    }

    protected clone(): Node {
        return { ...this };
    }

}
