import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        // PRE
        IllegalArgumentException.assertIsNotNullOrUndefined(bn, "bn is null");
        IllegalArgumentException.assertIsNotNullOrUndefined(pn, "pn is null");

        super(bn, pn);

        if (tn != undefined) {
            this.targetNode = tn;
        }
        // POST
        MethodFailedException.assertIsNotNullOrUndefined(bn, "bn is null");
        MethodFailedException.assertIsNotNullOrUndefined(pn, "pn is null");

        // CLASS INV
        this.ensureInvariants();
    }

    public getTargetNode(): Node | null {
        // CLASS INV
        this.ensureInvariants();

        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        // CLASS INV
        this.ensureInvariants();

        // PRE
        IllegalArgumentException.assertIsNotNullOrUndefined(target, "target is null");
        let clone = this.clone();

        this.targetNode = target;
    
        // POST
        try {
            MethodFailedException.assertIsNotNullOrUndefined(this.targetNode, "targetNode is null")
        } catch (exception: any) {
            Object.assign(this, clone);
            throw exception;
        }
    }

    public getBaseName(): string {
        // CLASS INV
        this.ensureInvariants();

        const target = this.ensureTargetNode(this.targetNode);

        let res = this.getBaseName();

        // POST
        MethodFailedException.assertIsNotNullOrUndefined(res, "res is null");

        return res;
    }

    public rename(bn: string): void {
        // CLASS INV
        this.ensureInvariants();

        // PRE
        IllegalArgumentException.assertIsNotNullOrUndefined(bn, "bn is null");
        let clone = this.clone();

        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);

        // POST
        try {
            MethodFailedException.assertIsNotNullOrUndefined(target);
        } catch (exception:any) {
            Object.assign(this, clone);
            throw exception;
        }
    }

    protected ensureTargetNode(target: Node | null): Node {
        // CLASS INV
        this.ensureInvariants();

        const result: Node = this.targetNode as Node;

        // POST
        MethodFailedException.assertIsNotNullOrUndefined(result, "result is null");
        return result;
    }
}