
import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { MethodFailedException } from "../common/MethodFailedException";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        try {
            this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);

            this.doSetBaseName(bn);
            this.parentNode = pn; // why oh why do I have to set this
            this.initialize(pn);

            this.assertClassInvariants();
        } catch (e: any) {
            throw new ServiceFailureException("could not construct object", e)
        }
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        let clone: Node = { ...this };
        try {
            this.assertIsNotNullOrUndefined(to, ExceptionType.PRECONDITION);

            this.parentNode.removeChildNode(this);
            to.addChildNode(this);
            this.parentNode = to;

            this.assertClassInvariants();
            this.assertSuccessfulMove(to, ExceptionType.POSTCONDITION);
        } catch (e: any) {
            if (e instanceof MethodFailedException) {
                to.remove(this);
                this.parentNode = clone.parentNode;
                this.parentNode.add(this);
            }
            throw new ServiceFailureException("could not move", e);
        }
    }

    public getFullName(): Name {
        try {
            const result: Name = this.parentNode.getFullName();
            result.append(this.doGetBaseName());

            this.assertClassInvariants();
            this.assertIsNotNullOrUndefined(result, ExceptionType.POSTCONDITION);
            return result;
        } catch (e: any) {
            throw new ServiceFailureException("could not get fullname", e);
        }
    }

    public getBaseName(): string {
        try {
            const res: string = this.doGetBaseName();

            this.assertClassInvariants();
            this.assertIsNotNullOrUndefined(res, ExceptionType.POSTCONDITION);
            return res;
        } catch (e: any) {
            throw new ServiceFailureException("could not get base name", e);
        }
    }
    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        let oldBn: string = this.doGetBaseName();
        try {
            this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);

            this.doSetBaseName(bn);

            this.assertClassInvariants();
            this.assertIsValidBaseName(this.doGetBaseName(), ExceptionType.POSTCONDITION);
        } catch (e: any) {
            if (e instanceof MethodFailedException)
                this.doSetBaseName(oldBn);
            throw new ServiceFailureException("could not rename", e);
        }
    }
    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        try {
            const res: Directory = this.doGetParentNode();

            this.assertClassInvariants();
            this.assertIsNotNullOrUndefined(res, ExceptionType.POSTCONDITION);
            return res;
        } catch (e: any) {
            throw new ServiceFailureException("could not get parent node", e);
        }
    }
    protected doGetParentNode(): Directory {
        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        try {
            this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);

            const result: Set<Node> = new Set<Node>();
            if (this.doGetBaseName() == bn) {
                result.add(this);
            }

            this.assertClassInvariants();
            this.assertIsNotNullOrUndefined(result, ExceptionType.POSTCONDITION);
            return result;
        } catch (e: any) {
            throw new ServiceFailureException("could not find nodes", e);
        }
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
