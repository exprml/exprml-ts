import {
    Eval_Definition,
    Eval_DefinitionSchema,
    Expr_Kind,
    Expr_Path,
    ExprSchema,
    JsonSchema,
} from "./gen/pb/exprml/v1/expr_pb.js";
import {create} from "@bufbuild/protobuf";
import {DefStack, DefStackSchema} from "./gen/pb/exprml/v1/evaluator_pb.js";
import {Value} from "./gen/pb/exprml/v1/value_pb.js";

export function register(defStack: DefStack, def: Eval_Definition): DefStack {
    return create(DefStackSchema, {
        parent: defStack,
        def: def,
    });
}

export function find(defStack: DefStack, ident: string): DefStack | null {
    if (defStack == null || defStack.def == null) {
        return null;
    }
    if (defStack.def?.ident === ident) {
        return defStack;
    }
    if (defStack.parent == null) {
        return null;
    }
    return find(defStack.parent, ident);
}

export function newDefinition(path: Expr_Path, ident: string, value: Value): Eval_Definition {
    return create(Eval_DefinitionSchema, {
        ident: ident,
        body: create(ExprSchema, {
            path: path,
            kind: Expr_Kind.JSON,
            value: value,
            json: create(JsonSchema, {json: value}),
        }),
    });
}