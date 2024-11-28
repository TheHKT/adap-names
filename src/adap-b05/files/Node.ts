import { ExceptionType, AssertionDispatcher } from "../common/AssertionDispatcher";

import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);

        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);

        this.assertClassInvariants();
    }

    protected initialize(pn: Directory): void {
        this.assertIsNotNullOrUndefined(pn, ExceptionType.PRECONDITION);
        let clone: Node = { ...this };

        this.parentNode = pn;
        this.parentNode.add(this);

        this.assertClassInvariants();
        try {
            this.assertSuccessfulMove(pn, ExceptionType.POSTCONDITION);
        } catch (e: any) {
            this.parentNode.remove(this);
            this.parentNode = clone.parentNode;
            throw e;
        }
    }

    public move(to: Directory): void {
        this.assertIsNotNullOrUndefined(to, ExceptionType.PRECONDITION);
        let clone: Node = { ...this };

        this.parentNode.remove(this);
        to.add(this);
        this.parentNode = to;

        this.assertClassInvariants();
        try {
        this.assertSuccessfulMove(to, ExceptionType.POSTCONDITION);
        } catch (e: any) {
            to.remove(this);
            this.parentNode = clone.parentNode;
            this.parentNode.add(this);
            throw e;
        }
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.doGetBaseName());

        this.assertClassInvariants();
        this.assertIsNotNullOrUndefined(result, ExceptionType.POSTCONDITION);
        return result;
    }

    public getBaseName(): string {
        const res: string = this.doGetBaseName();

        this.assertClassInvariants();
        this.assertIsNotNullOrUndefined(res, ExceptionType.POSTCONDITION);
        return res;
    }
    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);
        let oldBn : string = this.getBaseName();

        this.doSetBaseName(bn);

        this.assertClassInvariants();
        try {
            this.assertIsValidBaseName(this.doGetBaseName(), ExceptionType.POSTCONDITION);
        } catch (e: any) {
            this.doSetBaseName(oldBn);
            throw e;
        }
    }
    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        const res : Directory = this.doGetParentNode();

        this.assertClassInvariants();
        this.assertIsNotNullOrUndefined(res, ExceptionType.POSTCONDITION);
        return res;
    }
    protected doGetParentNode(): Directory {
        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);

        const result: Set<Node> = new Set<Node>();
        if (this.getBaseName() == bn) {
            result.add(this);
        }

        this.assertClassInvariants();
        this.assertIsNotNullOrUndefined(result, ExceptionType.POSTCONDITION);
        return result;
    }

    protected assertClassInvariants(): void {
        const bn: string = this.doGetBaseName();
        const pd: Directory = this.doGetParentNode();
        this.assertIsValidBaseName(bn, ExceptionType.CLASS_INVARIANT);
        this.assertIsNotNullOrUndefined(pd, ExceptionType.CLASS_INVARIANT);
    }
    protected assertIsNotNullOrUndefined(obj: any, et: ExceptionType): void {
        const condition: boolean = (obj != null);
        AssertionDispatcher.dispatch(et, condition, "null or undefined");
    }

    protected assertSuccessfulMove(to: Directory, et: ExceptionType): void {
        this.assertIsNotNullOrUndefined(to, et);
        this.assertIsNotNullOrUndefined(this.doGetParentNode(), et);
        const condition: boolean = (this.doGetParentNode() == to);
        let condition2: boolean = false;
        to.getChildNodes().forEach((node) => {
            if (node == this) {
                condition2 = true;
            }
        });
        AssertionDispatcher.dispatch(et, condition, "move failed");
        AssertionDispatcher.dispatch(et, condition2, "move failed");
    }

    protected assertIsValidBaseName(bn: string, et: ExceptionType): void {
        const conditionEmpty: boolean = (bn != "");
        AssertionDispatcher.dispatch(et, conditionEmpty, "invalid base name");
        this.assertIsNotNullOrUndefined(bn, et);
    }
}
