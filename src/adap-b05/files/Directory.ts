import { AssertionDispatcher, ExceptionType } from "../common/AssertionDispatcher";
import { Node } from "./Node";
import { ServiceFailureException } from "../common/ServiceFailureException";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public add(cn: Node): void {
        let clone: Set<Node> = new Set<Node>(this.childNodes);
        try {
            this.assertValidNode(cn, ExceptionType.PRECONDITION);
            AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, !this.childNodes.has(cn), "Node already exists");

            this.childNodes.add(cn);

            this.assertClassInvariants();
            AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION, this.childNodes.has(cn), "Node not added");
        } catch (e: any) {
            if (e instanceof ServiceFailureException) {
                this.childNodes = clone;
            }
            throw new ServiceFailureException("Service failed", e);
        }
    }

    public remove(cn: Node): void {
        let clone: Set<Node> = new Set<Node>(this.childNodes);
        try {
            this.assertValidNode(cn, ExceptionType.PRECONDITION);
            AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this.childNodes.has(cn), "Node dpenst exist as child");

            this.childNodes.delete(cn); // Yikes! Should have been called remove

            this.assertClassInvariants();

            AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION, this.childNodes.has(cn), "Node not deleted");
        } catch (e: any) {
            if (e instanceof ServiceFailureException) {
                this.childNodes = clone;
            }
            throw new ServiceFailureException("Could not delete", e);
        }
    }

    public getChildNodes(): Set<Node> {
        try {
            let res: Set<Node> = this.doGetChildNodes();

            this.assertClassInvariants();
            this.assertIsNotNullOrUndefined(res, ExceptionType.POSTCONDITION);
            return res;
        } catch (e: any) {
            throw new ServiceFailureException("Could not get children", e);
        }
    }
    protected doGetChildNodes(): Set<Node> {
        return this.childNodes;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        try {
            super.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);

            const result: Set<Node> = new Set<Node>();
            const children: Set<Node> = this.doGetChildNodes();
            children.forEach((child) => {
                if (child.getBaseName() == bn) {
                    result.add(child);
                }
                const grandChildren: Set<Node> = child.findNodes(bn);
                grandChildren.forEach((grandChild) => {
                    result.add(grandChild);
                });
            });
            if (this.getBaseName() == bn) {
                result.add(this);
            }

            this.assertClassInvariants();
            this.assertIsNotNullOrUndefined(result, ExceptionType.POSTCONDITION);
            return result;
        } catch (e: any) {
            throw new ServiceFailureException("Could not find nodes", e);
        }
    }

    protected assertValidNode(cn: Node, et: ExceptionType): void {
        this.assertIsNotNullOrUndefined(cn, et);
        super.assertIsValidBaseName(cn.getBaseName(), et);
    }
}