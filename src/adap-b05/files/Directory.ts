import { AssertionDispatcher, ExceptionType } from "../common/AssertionDispatcher";
import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public add(cn: Node): void {
        //this.assertValidNode(cn, ExceptionType.PRECONDITION);
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, !this.childNodes.has(cn), "Node already exists");
        let clone: Set<Node> = new Set<Node>(this.childNodes);
        
        this.childNodes.add(cn);

        this.assertClassInvariants();
        try{
            AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION, this.childNodes.has(cn), "Node not added");
        } catch (e: any) {
            this.childNodes = clone;
            throw e;
        }
    }

    public remove(cn: Node): void {
        this.assertValidNode(cn, ExceptionType.PRECONDITION);
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this.childNodes.has(cn), "Node dpenst exist as child");
        let clone: Set<Node> = new Set<Node>(this.childNodes);
        
        this.childNodes.delete(cn); // Yikes! Should have been called remove

        this.assertClassInvariants();
        try{
            AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION, this.childNodes.has(cn), "Node not deleted");
        } catch (e: any) {
            this.childNodes = clone;
            throw e;
        }
    }

    public getChildNodes(): Set<Node> {
        let res : Set<Node> = this.doGetChildNodes();

        this.assertClassInvariants();
        this.assertIsNotNullOrUndefined(res, ExceptionType.POSTCONDITION);
        return res;
    }
    protected doGetChildNodes(): Set<Node> {
        return this.childNodes;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public override findNodes(bn: string): Set<Node> {
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);

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
    }

    protected assertValidNode(cn: Node, et: ExceptionType): void {
        this.assertIsNotNullOrUndefined(cn, et);
        this.assertIsValidBaseName(cn.getBaseName(), et);
    }
}