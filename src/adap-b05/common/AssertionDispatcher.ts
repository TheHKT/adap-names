import { IllegalArgumentException } from "./IllegalArgumentException";
import { InvalidStateException } from "./InvalidStateException";
import { MethodFailedException } from "./MethodFailedException";

export enum ExceptionType {
    PRECONDITION = 0,
    CLASS_INVARIANT = 1,
    POSTCONDITION = 2
};

export class AssertionDispatcher {

    protected static DISPATCHER = new AssertionDispatcher();

    public static dispatch(key: ExceptionType, condition: boolean, message?: string) {
        this.DISPATCHER.doDispatch(key, condition, message);
    }

    protected methods: { [key in ExceptionType]: (c: boolean, m?: string) => void };

    constructor() {
        this.methods = {
            [ExceptionType.PRECONDITION]: IllegalArgumentException.assert, 
            [ExceptionType.CLASS_INVARIANT]: InvalidStateException.assert,
            [ExceptionType.POSTCONDITION]: MethodFailedException.assert
        }
    }

    protected doDispatch(key: ExceptionType, condition: boolean, message?: string) {
        this.methods[key](condition, message);
    }
}