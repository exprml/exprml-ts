import type { GenEnum, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import type { Value } from "./value_pb.js";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file exprml/v1/expr.proto.
 */
export declare const file_exprml_v1_expr: GenFile;
/**
 * @generated from message exprml.v1.Expr
 */
export type Expr = Message<"exprml.v1.Expr"> & {
    /**
     * Path is the path to the Node.
     *
     * @generated from field: exprml.v1.Expr.Path path = 1;
     */
    path?: Expr_Path;
    /**
     * Value is the JSON value of the Node.
     *
     * @generated from field: exprml.v1.Value value = 2;
     */
    value?: Value;
    /**
     * Kind is the kind of the Expr.
     *
     * @generated from field: exprml.v1.Expr.Kind kind = 3;
     */
    kind: Expr_Kind;
    /**
     * Eval is an Eval Expr.
     *
     * @generated from field: exprml.v1.Eval eval = 10;
     */
    eval?: Eval;
    /**
     * Scalar is a Scalar Expr.
     *
     * @generated from field: exprml.v1.Scalar scalar = 11;
     */
    scalar?: Scalar;
    /**
     * Ref is a Ref Expr.
     *
     * @generated from field: exprml.v1.Ref ref = 12;
     */
    ref?: Ref;
    /**
     * Obj is an Obj Expr.
     *
     * @generated from field: exprml.v1.Obj obj = 13;
     */
    obj?: Obj;
    /**
     * Arr is an Arr Expr.
     *
     * @generated from field: exprml.v1.Arr arr = 14;
     */
    arr?: Arr;
    /**
     * Json is a Json Expr.
     *
     * @generated from field: exprml.v1.Json json = 15;
     */
    json?: Json;
    /**
     * Iter is an Iter Expr.
     *
     * @generated from field: exprml.v1.Iter iter = 16;
     */
    iter?: Iter;
    /**
     * Elem is an Elem Expr.
     *
     * @generated from field: exprml.v1.Elem elem = 17;
     */
    elem?: Elem;
    /**
     * Call is a Call Expr.
     *
     * @generated from field: exprml.v1.Call call = 18;
     */
    call?: Call;
    /**
     * Cases is a Cases Expr.
     *
     * @generated from field: exprml.v1.Cases cases = 19;
     */
    cases?: Cases;
    /**
     * OpUnary is an OpUnary Expr.
     *
     * @generated from field: exprml.v1.OpUnary op_unary = 20;
     */
    opUnary?: OpUnary;
    /**
     * OpBinary is an OpBinary Expr.
     *
     * @generated from field: exprml.v1.OpBinary op_binary = 21;
     */
    opBinary?: OpBinary;
    /**
     * OpVariadic is an OpVariadic Expr.
     *
     * @generated from field: exprml.v1.OpVariadic op_variadic = 22;
     */
    opVariadic?: OpVariadic;
};
/**
 * Describes the message exprml.v1.Expr.
 * Use `create(ExprSchema)` to create a new message.
 */
export declare const ExprSchema: GenMessage<Expr>;
/**
 * Path represents a path to the Node.
 *
 * @generated from message exprml.v1.Expr.Path
 */
export type Expr_Path = Message<"exprml.v1.Expr.Path"> & {
    /**
     * Pos is a position in the path.
     *
     * @generated from field: repeated exprml.v1.Expr.Path.Pos pos = 1;
     */
    pos: Expr_Path_Pos[];
};
/**
 * Describes the message exprml.v1.Expr.Path.
 * Use `create(Expr_PathSchema)` to create a new message.
 */
export declare const Expr_PathSchema: GenMessage<Expr_Path>;
/**
 * Pos represents a position in the path.
 *
 * @generated from message exprml.v1.Expr.Path.Pos
 */
export type Expr_Path_Pos = Message<"exprml.v1.Expr.Path.Pos"> & {
    /**
     * Index is the index of the position.
     *
     * @generated from field: int64 index = 1;
     */
    index: bigint;
    /**
     * Key is the key of the position.
     *
     * @generated from field: string key = 2;
     */
    key: string;
};
/**
 * Describes the message exprml.v1.Expr.Path.Pos.
 * Use `create(Expr_Path_PosSchema)` to create a new message.
 */
export declare const Expr_Path_PosSchema: GenMessage<Expr_Path_Pos>;
/**
 * Kind is the kind of the Node.
 *
 * @generated from enum exprml.v1.Expr.Kind
 */
export declare enum Expr_Kind {
    /**
     * Unspecified.
     *
     * @generated from enum value: UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Eval kind.
     *
     * @generated from enum value: EVAL = 10;
     */
    EVAL = 10,
    /**
     * Scalar kind.
     *
     * @generated from enum value: SCALAR = 11;
     */
    SCALAR = 11,
    /**
     * Ref kind.
     *
     * @generated from enum value: REF = 12;
     */
    REF = 12,
    /**
     * Obj kind.
     *
     * @generated from enum value: OBJ = 13;
     */
    OBJ = 13,
    /**
     * Arr kind.
     *
     * @generated from enum value: ARR = 14;
     */
    ARR = 14,
    /**
     * Json kind.
     *
     * @generated from enum value: JSON = 15;
     */
    JSON = 15,
    /**
     * Iter kind.
     *
     * @generated from enum value: ITER = 16;
     */
    ITER = 16,
    /**
     * Elem kind.
     *
     * @generated from enum value: ELEM = 17;
     */
    ELEM = 17,
    /**
     * Call kind.
     *
     * @generated from enum value: CALL = 18;
     */
    CALL = 18,
    /**
     * Cases kind.
     *
     * @generated from enum value: CASES = 19;
     */
    CASES = 19,
    /**
     * OpUnary kind.
     *
     * @generated from enum value: OP_UNARY = 20;
     */
    OP_UNARY = 20,
    /**
     * OpBinary kind.
     *
     * @generated from enum value: OP_BINARY = 21;
     */
    OP_BINARY = 21,
    /**
     * OpVariadic kind.
     *
     * @generated from enum value: OP_VARIADIC = 22;
     */
    OP_VARIADIC = 22
}
/**
 * Describes the enum exprml.v1.Expr.Kind.
 */
export declare const Expr_KindSchema: GenEnum<Expr_Kind>;
/**
 * Eval is an Eval expression.
 *
 * @generated from message exprml.v1.Eval
 */
export type Eval = Message<"exprml.v1.Eval"> & {
    /**
     * Eval is an expression to evaluate.
     *
     * @generated from field: exprml.v1.Expr eval = 1;
     */
    eval?: Expr;
    /**
     * Where is a list of definitions.
     *
     * @generated from field: repeated exprml.v1.Eval.Definition where = 2;
     */
    where: Eval_Definition[];
};
/**
 * Describes the message exprml.v1.Eval.
 * Use `create(EvalSchema)` to create a new message.
 */
export declare const EvalSchema: GenMessage<Eval>;
/**
 * Definition is a function or variable definition.
 *
 * @generated from message exprml.v1.Eval.Definition
 */
export type Eval_Definition = Message<"exprml.v1.Eval.Definition"> & {
    /**
     * Ident is the identifier of the definition.
     *
     * @generated from field: string ident = 1;
     */
    ident: string;
    /**
     * Args is the list of arguments.
     *
     * @generated from field: repeated string args = 2;
     */
    args: string[];
    /**
     * Body is the body of the definition.
     *
     * @generated from field: exprml.v1.Expr body = 3;
     */
    body?: Expr;
};
/**
 * Describes the message exprml.v1.Eval.Definition.
 * Use `create(Eval_DefinitionSchema)` to create a new message.
 */
export declare const Eval_DefinitionSchema: GenMessage<Eval_Definition>;
/**
 * Scalar is a Scalar expression.
 *
 * @generated from message exprml.v1.Scalar
 */
export type Scalar = Message<"exprml.v1.Scalar"> & {
    /**
     * Scalar is a scalar value.
     *
     * @generated from field: exprml.v1.Value scalar = 1;
     */
    scalar?: Value;
};
/**
 * Describes the message exprml.v1.Scalar.
 * Use `create(ScalarSchema)` to create a new message.
 */
export declare const ScalarSchema: GenMessage<Scalar>;
/**
 * Ref is a Ref expression.
 *
 * @generated from message exprml.v1.Ref
 */
export type Ref = Message<"exprml.v1.Ref"> & {
    /**
     * Ident is the identifier of the reference.
     *
     * @generated from field: string ident = 1;
     */
    ident: string;
};
/**
 * Describes the message exprml.v1.Ref.
 * Use `create(RefSchema)` to create a new message.
 */
export declare const RefSchema: GenMessage<Ref>;
/**
 * Obj is an Obj expression.
 *
 * @generated from message exprml.v1.Obj
 */
export type Obj = Message<"exprml.v1.Obj"> & {
    /**
     * Obj is an object.
     *
     * @generated from field: map<string, exprml.v1.Expr> obj = 1;
     */
    obj: {
        [key: string]: Expr;
    };
};
/**
 * Describes the message exprml.v1.Obj.
 * Use `create(ObjSchema)` to create a new message.
 */
export declare const ObjSchema: GenMessage<Obj>;
/**
 * Arr is an Arr expression.
 *
 * @generated from message exprml.v1.Arr
 */
export type Arr = Message<"exprml.v1.Arr"> & {
    /**
     * Arr is an array.
     *
     * @generated from field: repeated exprml.v1.Expr arr = 1;
     */
    arr: Expr[];
};
/**
 * Describes the message exprml.v1.Arr.
 * Use `create(ArrSchema)` to create a new message.
 */
export declare const ArrSchema: GenMessage<Arr>;
/**
 * Json is a Json expression.
 *
 * @generated from message exprml.v1.Json
 */
export type Json = Message<"exprml.v1.Json"> & {
    /**
     * Json is a JSON value.
     *
     * @generated from field: exprml.v1.Value json = 1;
     */
    json?: Value;
};
/**
 * Describes the message exprml.v1.Json.
 * Use `create(JsonSchema)` to create a new message.
 */
export declare const JsonSchema: GenMessage<Json>;
/**
 * Iter is an Iter expression.
 *
 * @generated from message exprml.v1.Iter
 */
export type Iter = Message<"exprml.v1.Iter"> & {
    /**
     * PosIdent is the identifier of the position.
     *
     * @generated from field: string pos_ident = 1;
     */
    posIdent: string;
    /**
     * ElemIdent is the identifier of the element.
     *
     * @generated from field: string elem_ident = 2;
     */
    elemIdent: string;
    /**
     * Col is the collection to iterate.
     *
     * @generated from field: exprml.v1.Expr col = 3;
     */
    col?: Expr;
    /**
     * Do is the body of the iteration.
     *
     * @generated from field: exprml.v1.Expr do = 4;
     */
    do?: Expr;
    /**
     * If is the condition of the iteration.
     *
     * @generated from field: exprml.v1.Expr if = 5;
     */
    if?: Expr;
};
/**
 * Describes the message exprml.v1.Iter.
 * Use `create(IterSchema)` to create a new message.
 */
export declare const IterSchema: GenMessage<Iter>;
/**
 * Elem is an Elem expression.
 *
 * @generated from message exprml.v1.Elem
 */
export type Elem = Message<"exprml.v1.Elem"> & {
    /**
     * Get is the expression to get the element.
     *
     * @generated from field: exprml.v1.Expr get = 1;
     */
    get?: Expr;
    /**
     * From is the index to get the element.
     *
     * @generated from field: exprml.v1.Expr from = 2;
     */
    from?: Expr;
};
/**
 * Describes the message exprml.v1.Elem.
 * Use `create(ElemSchema)` to create a new message.
 */
export declare const ElemSchema: GenMessage<Elem>;
/**
 * Call is a Call expression.
 *
 * @generated from message exprml.v1.Call
 */
export type Call = Message<"exprml.v1.Call"> & {
    /**
     * Ident is the identifier of the call.
     *
     * @generated from field: string ident = 1;
     */
    ident: string;
    /**
     * Args is the list of arguments.
     *
     * @generated from field: map<string, exprml.v1.Expr> args = 2;
     */
    args: {
        [key: string]: Expr;
    };
};
/**
 * Describes the message exprml.v1.Call.
 * Use `create(CallSchema)` to create a new message.
 */
export declare const CallSchema: GenMessage<Call>;
/**
 * Cases is a Cases expression.
 *
 * @generated from message exprml.v1.Cases
 */
export type Cases = Message<"exprml.v1.Cases"> & {
    /**
     * Cases is a list of cases.
     *
     * @generated from field: repeated exprml.v1.Cases.Case cases = 1;
     */
    cases: Cases_Case[];
};
/**
 * Describes the message exprml.v1.Cases.
 * Use `create(CasesSchema)` to create a new message.
 */
export declare const CasesSchema: GenMessage<Cases>;
/**
 * Case is a conditional branch.
 *
 * @generated from message exprml.v1.Cases.Case
 */
export type Cases_Case = Message<"exprml.v1.Cases.Case"> & {
    /**
     * Whether the case is otherwise.
     *
     * @generated from field: bool is_otherwise = 1;
     */
    isOtherwise: boolean;
    /**
     * When is the condition of the case.
     *
     * @generated from field: exprml.v1.Expr when = 2;
     */
    when?: Expr;
    /**
     * Then is the body of the case.
     *
     * @generated from field: exprml.v1.Expr then = 3;
     */
    then?: Expr;
    /**
     * Otherwise is the body of the case.
     *
     * @generated from field: exprml.v1.Expr otherwise = 4;
     */
    otherwise?: Expr;
};
/**
 * Describes the message exprml.v1.Cases.Case.
 * Use `create(Cases_CaseSchema)` to create a new message.
 */
export declare const Cases_CaseSchema: GenMessage<Cases_Case>;
/**
 * OpUnary is an OpUnary expression.
 *
 * @generated from message exprml.v1.OpUnary
 */
export type OpUnary = Message<"exprml.v1.OpUnary"> & {
    /**
     * Op is the operator.
     *
     * @generated from field: exprml.v1.OpUnary.Op op = 1;
     */
    op: OpUnary_Op;
    /**
     * Operand is the operand.
     *
     * @generated from field: exprml.v1.Expr operand = 2;
     */
    operand?: Expr;
};
/**
 * Describes the message exprml.v1.OpUnary.
 * Use `create(OpUnarySchema)` to create a new message.
 */
export declare const OpUnarySchema: GenMessage<OpUnary>;
/**
 * Op is a operator.
 *
 * @generated from enum exprml.v1.OpUnary.Op
 */
export declare enum OpUnary_Op {
    /**
     * Unspecified.
     *
     * @generated from enum value: UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Len operator.
     *
     * @generated from enum value: LEN = 1;
     */
    LEN = 1,
    /**
     * Not operator.
     *
     * @generated from enum value: NOT = 2;
     */
    NOT = 2,
    /**
     * Flat operator.
     *
     * @generated from enum value: FLAT = 3;
     */
    FLAT = 3,
    /**
     * Floor operator.
     *
     * @generated from enum value: FLOOR = 4;
     */
    FLOOR = 4,
    /**
     * Ceil operator.
     *
     * @generated from enum value: CEIL = 5;
     */
    CEIL = 5,
    /**
     * Abort operator.
     *
     * @generated from enum value: ABORT = 6;
     */
    ABORT = 6
}
/**
 * Describes the enum exprml.v1.OpUnary.Op.
 */
export declare const OpUnary_OpSchema: GenEnum<OpUnary_Op>;
/**
 * OpBinary is an OpBinary expression.
 *
 * @generated from message exprml.v1.OpBinary
 */
export type OpBinary = Message<"exprml.v1.OpBinary"> & {
    /**
     * Op is the operator.
     *
     * @generated from field: exprml.v1.OpBinary.Op op = 1;
     */
    op: OpBinary_Op;
    /**
     * Left is the left operand.
     *
     * @generated from field: exprml.v1.Expr left = 2;
     */
    left?: Expr;
    /**
     * Right is the right operand.
     *
     * @generated from field: exprml.v1.Expr right = 3;
     */
    right?: Expr;
};
/**
 * Describes the message exprml.v1.OpBinary.
 * Use `create(OpBinarySchema)` to create a new message.
 */
export declare const OpBinarySchema: GenMessage<OpBinary>;
/**
 * Op is a operator.
 *
 * @generated from enum exprml.v1.OpBinary.Op
 */
export declare enum OpBinary_Op {
    /**
     * Unspecified.
     *
     * @generated from enum value: UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Sub operator.
     *
     * @generated from enum value: SUB = 1;
     */
    SUB = 1,
    /**
     * Div operator.
     *
     * @generated from enum value: DIV = 2;
     */
    DIV = 2,
    /**
     * Eq operator.
     *
     * @generated from enum value: EQ = 3;
     */
    EQ = 3,
    /**
     * Neq operator.
     *
     * @generated from enum value: NEQ = 4;
     */
    NEQ = 4,
    /**
     * Lt operator.
     *
     * @generated from enum value: LT = 5;
     */
    LT = 5,
    /**
     * Lte operator.
     *
     * @generated from enum value: LTE = 6;
     */
    LTE = 6,
    /**
     * Gt operator.
     *
     * @generated from enum value: GT = 7;
     */
    GT = 7,
    /**
     * Gte operator.
     *
     * @generated from enum value: GTE = 8;
     */
    GTE = 8
}
/**
 * Describes the enum exprml.v1.OpBinary.Op.
 */
export declare const OpBinary_OpSchema: GenEnum<OpBinary_Op>;
/**
 * OpVariadic is an OpVariadic expression.
 *
 * @generated from message exprml.v1.OpVariadic
 */
export type OpVariadic = Message<"exprml.v1.OpVariadic"> & {
    /**
     * Op is the operator.
     *
     * @generated from field: exprml.v1.OpVariadic.Op op = 1;
     */
    op: OpVariadic_Op;
    /**
     * Operands is the list of operands.
     *
     * @generated from field: repeated exprml.v1.Expr operands = 2;
     */
    operands: Expr[];
};
/**
 * Describes the message exprml.v1.OpVariadic.
 * Use `create(OpVariadicSchema)` to create a new message.
 */
export declare const OpVariadicSchema: GenMessage<OpVariadic>;
/**
 * Op is a operator.
 *
 * @generated from enum exprml.v1.OpVariadic.Op
 */
export declare enum OpVariadic_Op {
    /**
     * Unspecified.
     *
     * @generated from enum value: UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Add operator.
     *
     * @generated from enum value: ADD = 1;
     */
    ADD = 1,
    /**
     * Mul operator.
     *
     * @generated from enum value: MUL = 2;
     */
    MUL = 2,
    /**
     * And operator.
     *
     * @generated from enum value: AND = 3;
     */
    AND = 3,
    /**
     * Or operator.
     *
     * @generated from enum value: OR = 4;
     */
    OR = 4,
    /**
     * Cat operator.
     *
     * @generated from enum value: CAT = 5;
     */
    CAT = 5,
    /**
     * Min operator.
     *
     * @generated from enum value: MIN = 6;
     */
    MIN = 6,
    /**
     * Max operator.
     *
     * @generated from enum value: MAX = 7;
     */
    MAX = 7,
    /**
     * Merge operator.
     *
     * @generated from enum value: MERGE = 8;
     */
    MERGE = 8
}
/**
 * Describes the enum exprml.v1.OpVariadic.Op.
 */
export declare const OpVariadic_OpSchema: GenEnum<OpVariadic_Op>;
