import { Node } from "./Node";
import { Directory } from "./Directory";
import { ExceptionType } from "../common/AssertionDispatcher";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { MethodFailedException } from "../common/MethodFailedException";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);

        try {
            if (tn != undefined) {
                this.targetNode = tn;
            }
            this.assertClassInvariants();
        } catch (e: any) {
            throw new ServiceFailureException("could not construct object", e);
        }
    }

    public getTargetNode(): Node | null {
        try {
            let res: Node | null = this.doGetTargetNode();

            this.assertClassInvariants();
            return res;
        } catch (e: any) {
            throw new ServiceFailureException("could not get target node", e);
        }
    }
    public setTargetNode(target: Node): void {
        const oldTarget: Node | null = this.doGetTargetNode();
        try {
            this.assertIsNotNullOrUndefined(target, ExceptionType.PRECONDITION);

            this.doSetTargetNode(target);

            this.assertClassInvariants();

            this.assertIsNotNullOrUndefined(this.doGetTargetNode(), ExceptionType.POSTCONDITION);
        } catch (e: any) {
            if (e instanceof MethodFailedException) {
                this.doSetTargetNode(oldTarget);
                this.targetNode = oldTarget;
            }
            throw new ServiceFailureException("could not set target node", e);
        }
    }

    protected doGetTargetNode(): Node | null {
        return this.targetNode;
    }
    protected doSetTargetNode(target: Node | null): void {
        this.targetNode = target;
    }

    public getBaseName(): string {
        try {
            const target = this.ensureTargetNode(this.targetNode);
            const res = target.getBaseName();

            this.assertClassInvariants();
            this.assertIsNotNullOrUndefined(res, ExceptionType.POSTCONDITION);
            return res;
        } catch (e: any) {
            throw new ServiceFailureException("could not get base name", e);
        }
    }

    public rename(bn: string): void {
        let oldName: string = this.getBaseName();
        const target = this.ensureTargetNode(this.targetNode);
        try {
            this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);

            target.rename(bn);

            this.assertClassInvariants();
            this.assertIsValidBaseName(bn, ExceptionType.POSTCONDITION);
        } catch (e: any) {
            if (e instanceof MethodFailedException)
                target.rename(oldName);
            throw e;
        }
    }

    protected ensureTargetNode(target: Node | null): Node {
        const result: Node = this.targetNode as Node;
        return result;
    }
}