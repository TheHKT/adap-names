import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        // PRE
        IllegalArgumentException.assertIsNotNullOrUndefined(bn, "bn is null");
        IllegalArgumentException.assertIsNotNullOrUndefined(pn, "Pn is null");

        super(bn, pn);

        // POST 
        MethodFailedException.assertIsNotNullOrUndefined(bn, "bn is null");
        MethodFailedException.assertIsNotNullOrUndefined(pn, "pn is null");

        // CLASS INV
        this.ensureInvariants();
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        // CLASS INV
        this.ensureInvariants();

        // PRE
        IllegalArgumentException.assertIsNotNullOrUndefined(cn);
        let clone = this.clone();

        this.childNodes.add(cn);

        // POST
        try {
            MethodFailedException.assertIsNotNullOrUndefined(this.childNodes);
        } catch (exception: any) {
            Object.assign(this, clone);
            throw exception;
        }
    }

    public removeChildNode(cn: Node): void {
        // CLASS INV
        this.ensureInvariants();

        // PRE
        IllegalArgumentException.assertIsNotNullOrUndefined(cn);
        let clone = this.clone();

        this.childNodes.delete(cn); // Yikes! Should have been called remove

        // POST
        try {
            MethodFailedException.assertIsNotNullOrUndefined(this.childNodes);
        } catch (exception: any) {
            Object.assign(this, clone);
            throw exception;
        }
    }

}