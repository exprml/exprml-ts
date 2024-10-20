"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.find = find;
exports.newDefinition = newDefinition;
const expr_pb_js_1 = require("./gen/pb/exprml/v1/expr_pb.js");
const protobuf_1 = require("@bufbuild/protobuf");
const evaluator_pb_js_1 = require("./gen/pb/exprml/v1/evaluator_pb.js");
function register(defStack, def) {
    return (0, protobuf_1.create)(evaluator_pb_js_1.DefStackSchema, {
        parent: defStack,
        def: def,
    });
}
function find(defStack, ident) {
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
function newDefinition(path, ident, value) {
    return (0, protobuf_1.create)(expr_pb_js_1.Eval_DefinitionSchema, {
        ident: ident,
        body: (0, protobuf_1.create)(expr_pb_js_1.ExprSchema, {
            path: path,
            kind: expr_pb_js_1.Expr_Kind.JSON,
            value: value,
            json: (0, protobuf_1.create)(expr_pb_js_1.JsonSchema, { json: value }),
        }),
    });
}
