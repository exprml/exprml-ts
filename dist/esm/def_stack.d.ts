import { Eval_Definition, Expr_Path } from "./gen/pb/exprml/v1/expr_pb.js";
import { DefStack } from "./gen/pb/exprml/v1/evaluator_pb.js";
import { Value } from "./gen/pb/exprml/v1/value_pb.js";
export declare function register(defStack: DefStack, def: Eval_Definition): DefStack;
export declare function find(defStack: DefStack, ident: string): DefStack | null;
export declare function newDefinition(path: Expr_Path, ident: string, value: Value): Eval_Definition;
