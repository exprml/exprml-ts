import { Eval_DefinitionSchema, Expr_Kind, ExprSchema, JsonSchema, } from "./gen/pb/exprml/v1/expr_pb.js";
import { create } from "@bufbuild/protobuf";
import { DefStackSchema } from "./gen/pb/exprml/v1/evaluator_pb.js";
export function register(defStack, def) {
    return create(DefStackSchema, {
        parent: defStack,
        def: def,
    });
}
export function find(defStack, ident) {
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
export function newDefinition(path, ident, value) {
    return create(Eval_DefinitionSchema, {
        ident: ident,
        body: create(ExprSchema, {
            path: path,
            kind: Expr_Kind.JSON,
            value: value,
            json: create(JsonSchema, { json: value }),
        }),
    });
}
