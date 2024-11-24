import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";
import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set();

    constructor(bn: string, pn: Directory) {
        // PRE
        IllegalArgumentException.assertIsNotNullOrUndefined(bn, "bn is null");
        IllegalArgumentException.assertIsNotNullOrUndefined(pn, "Pn is null");

        super(bn, pn);

        // POST 
        MethodFailureException.assertIsNotNullOrUndefined(bn, "bn is null");
        MethodFailureException.assertIsNotNullOrUndefined(pn, "pn is null");

        // CLASS INV
        this.ensureInvariants();
    }

    public add(cn: Node): void {
        // CLASS INV
        this.ensureInvariants();

        // PRE
        IllegalArgumentException.assertIsNotNullOrUndefined(cn);
        let clone = this.clone();

        this.childNodes.add(cn);

        // POST
        try {
            MethodFailureException.assertIsNotNullOrUndefined(this.childNodes);
        } catch (exception: any) {
            Object.assign(this, clone);
            throw exception;
        }
    }

    public remove(cn: Node): void {
        // CLASS INV
        this.ensureInvariants();

        // PRE
        IllegalArgumentException.assertIsNotNullOrUndefined(cn);
        let clone = this.clone();

        this.childNodes.delete(cn); // Yikes! Should have been called remove

        // POST
        try {
            MethodFailureException.assertIsNotNullOrUndefined(this.childNodes);
        } catch (exception: any) {
            Object.assign(this, clone);
            throw exception;
        }
    }

}