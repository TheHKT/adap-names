import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";
import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";

export class RootNode extends Directory {

    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode() {
        let res = this.ROOT_NODE;

        //POST
        MethodFailureException.assertIsNotNullOrUndefined(res, "res is null");

        return res;
    }

    constructor() {
        super("", new Object as Directory);
        this.parentNode = this;
    }

    public getFullName(): Name {
        let res = new StringName("", '/');

        // POST
        MethodFailureException.assertIsNotNullOrUndefined(res);
        return res;
    }

    public move(to: Directory): void {
        // PRE
        IllegalArgumentException.assertIsNotNullOrUndefined(to, "to is null");

        // null operation
    }

    protected doSetBaseName(bn: string): void {
        // PRE
        IllegalArgumentException.assertIsNotNullOrUndefined(bn, "bn is null");
        // null operation
    }

}