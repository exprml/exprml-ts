"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Evaluator = exports.Config = void 0;
const evaluator_pb_js_1 = require("./gen/pb/exprml/v1/evaluator_pb.js");
const protobuf_1 = require("@bufbuild/protobuf");
const expr_pb_js_1 = require("./gen/pb/exprml/v1/expr_pb.js");
const def_stack_js_1 = require("./def_stack.js");
const value_pb_js_1 = require("./gen/pb/exprml/v1/value_pb.js");
const value_js_1 = require("./value.js");
const path_js_1 = require("./path.js");
class Config {
    constructor(props) {
        this.extension = props?.extension ?? new Map();
        this.beforeEvaluate = props?.beforeEvaluate ?? (() => undefined);
        this.afterEvaluate = props?.afterEvaluate ?? (() => undefined);
    }
    extension;
    beforeEvaluate;
    afterEvaluate;
}
exports.Config = Config;
class Evaluator {
    constructor(config = new Config()) {
        this.config = config;
    }
    config;
    evaluateExpr(input) {
        try {
            this.config.beforeEvaluate(input);
        }
        catch (err) {
            return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, {
                status: evaluator_pb_js_1.EvaluateOutput_Status.UNKNOWN_ERROR,
                errorPath: input.expr.path,
                errorMessage: `beforeEvaluate failed: ${err instanceof Error ? err.message : JSON.stringify(err)}`,
            });
        }
        let output;
        switch (input.expr.kind) {
            default:
                throw new Error("given expression must be validated");
            case expr_pb_js_1.Expr_Kind.EVAL:
                output = this.evaluateEval(input);
                break;
            case expr_pb_js_1.Expr_Kind.SCALAR:
                output = this.evaluateScalar(input);
                break;
            case expr_pb_js_1.Expr_Kind.REF:
                output = this.evaluateRef(input);
                break;
            case expr_pb_js_1.Expr_Kind.OBJ:
                output = this.evaluateObj(input);
                break;
            case expr_pb_js_1.Expr_Kind.ARR:
                output = this.evaluateArr(input);
                break;
            case expr_pb_js_1.Expr_Kind.JSON:
                output = this.evaluateJson(input);
                break;
            case expr_pb_js_1.Expr_Kind.ITER:
                output = this.evaluateIter(input);
                break;
            case expr_pb_js_1.Expr_Kind.ELEM:
                output = this.evaluateElem(input);
                break;
            case expr_pb_js_1.Expr_Kind.CALL:
                output = this.evaluateCall(input);
                break;
            case expr_pb_js_1.Expr_Kind.CASES:
                output = this.evaluateCases(input);
                break;
            case expr_pb_js_1.Expr_Kind.OP_UNARY:
                output = this.evaluateOpUnary(input);
                break;
            case expr_pb_js_1.Expr_Kind.OP_BINARY:
                output = this.evaluateOpBinary(input);
                break;
            case expr_pb_js_1.Expr_Kind.OP_VARIADIC:
                output = this.evaluateOpVariadic(input);
                break;
        }
        try {
            this.config.afterEvaluate(input, output);
        }
        catch (err) {
            return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, {
                status: evaluator_pb_js_1.EvaluateOutput_Status.UNKNOWN_ERROR,
                errorPath: input.expr.path,
                errorMessage: `afterEvaluate failed: ${err instanceof Error ? err.message : JSON.stringify(err)}`,
            });
        }
        return output;
    }
    evaluateEval(input) {
        let st = input.defStack;
        const where = input.expr.eval?.where ?? [];
        for (const def of where) {
            st = (0, def_stack_js_1.register)(st, def);
        }
        return this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, { defStack: st, expr: input.expr.eval.eval }));
    }
    evaluateScalar(input) {
        return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: input.expr.scalar.scalar });
    }
    evaluateRef(input) {
        const ref = input.expr.ref;
        let st = (0, def_stack_js_1.find)(input.defStack, ref.ident);
        if (!st) {
            const ext = this.config.extension.get(ref.ident);
            if (!ext) {
                return errorReferenceNotFound(input.expr.path, ref.ident);
            }
            return ext(input.expr.path, {});
        }
        return this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, { defStack: st, expr: st.def.body }));
    }
    evaluateObj(input) {
        const result = {};
        for (const [pos, expr] of Object.entries(input.expr.obj.obj)) {
            const val = this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, { defStack: input.defStack, expr: expr }));
            if (val.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
                return val;
            }
            result[pos] = val.value;
        }
        return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.objValue)(result) });
    }
    evaluateArr(input) {
        const result = [];
        for (const expr of input.expr.arr.arr) {
            const val = this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, { defStack: input.defStack, expr: expr }));
            if (val.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
                return val;
            }
            result.push(val.value);
        }
        return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.arrValue)(result) });
    }
    evaluateJson(input) {
        return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: input.expr.json.json });
    }
    evaluateIter(input) {
        const iter = input.expr.iter;
        const forPos = iter.posIdent;
        const forElem = iter.elemIdent;
        const inVal = this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, { defStack: input.defStack, expr: iter.col }));
        switch (inVal.value.type) {
            case value_pb_js_1.Value_Type.STR:
                const strResult = [];
                for (let i = 0; i < inVal.value.str.length; i++) {
                    let st = input.defStack;
                    st = (0, def_stack_js_1.register)(st, (0, def_stack_js_1.newDefinition)(input.expr.path, forPos, (0, value_js_1.numValue)(i)));
                    st = (0, def_stack_js_1.register)(st, (0, def_stack_js_1.newDefinition)(input.expr.path, forElem, (0, value_js_1.strValue)(inVal.value.str[i])));
                    if (iter.if) {
                        const ifVal = this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, { defStack: st, expr: iter.if }));
                        if (ifVal.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
                            return ifVal;
                        }
                        if (ifVal.value.type !== value_pb_js_1.Value_Type.BOOL) {
                            return errorUnexpectedType(iter.if.path, ifVal.value.type, [value_pb_js_1.Value_Type.BOOL]);
                        }
                        if (!ifVal.value.bool) {
                            continue;
                        }
                    }
                    const v = this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, { defStack: st, expr: iter.do }));
                    if (v.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
                        return v;
                    }
                    strResult.push(v.value);
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.arrValue)(strResult) });
            case value_pb_js_1.Value_Type.ARR:
                const arrResult = [];
                for (let i = 0; i < inVal.value.arr.length; i++) {
                    let st = input.defStack;
                    st = (0, def_stack_js_1.register)(st, (0, def_stack_js_1.newDefinition)(input.expr.path, forPos, (0, value_js_1.numValue)(i)));
                    st = (0, def_stack_js_1.register)(st, (0, def_stack_js_1.newDefinition)(input.expr.path, forElem, inVal.value.arr[i]));
                    if (iter.if) {
                        const ifVal = this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, { defStack: st, expr: iter.if }));
                        if (ifVal.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
                            return ifVal;
                        }
                        if (ifVal.value.type !== value_pb_js_1.Value_Type.BOOL) {
                            return errorUnexpectedType(iter.if.path, ifVal.value.type, [value_pb_js_1.Value_Type.BOOL]);
                        }
                        if (!ifVal.value.bool) {
                            continue;
                        }
                    }
                    const v = this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, { defStack: st, expr: iter.do }));
                    if (v.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
                        return v;
                    }
                    arrResult.push(v.value);
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.arrValue)(arrResult) });
            case value_pb_js_1.Value_Type.OBJ:
                const objResult = {};
                for (const key of sortedKeys(inVal.value.obj)) {
                    let st = input.defStack;
                    st = (0, def_stack_js_1.register)(st, (0, def_stack_js_1.newDefinition)(input.expr.path, forPos, (0, value_js_1.strValue)(key)));
                    st = (0, def_stack_js_1.register)(st, (0, def_stack_js_1.newDefinition)(input.expr.path, forElem, inVal.value.obj[key]));
                    if (iter.if) {
                        const ifVal = this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, { defStack: st, expr: iter.if }));
                        if (ifVal.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
                            return ifVal;
                        }
                        if (ifVal.value.type !== value_pb_js_1.Value_Type.BOOL) {
                            return errorUnexpectedType(iter.if.path, ifVal.value.type, [value_pb_js_1.Value_Type.BOOL]);
                        }
                        if (!ifVal.value.bool) {
                            continue;
                        }
                    }
                    const v = this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, { defStack: st, expr: iter.do }));
                    if (v.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
                        return v;
                    }
                    objResult[key] = v.value;
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.objValue)(objResult) });
            default:
                return errorUnexpectedType(iter.col.path, inVal.value.type, [value_pb_js_1.Value_Type.STR, value_pb_js_1.Value_Type.ARR, value_pb_js_1.Value_Type.OBJ]);
        }
    }
    evaluateElem(input) {
        const elem = input.expr.elem;
        const getVal = this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, { defStack: input.defStack, expr: elem.get }));
        if (getVal.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
            return getVal;
        }
        const pos = getVal.value;
        const fromVal = this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, { defStack: input.defStack, expr: elem.from }));
        if (fromVal.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
            return fromVal;
        }
        const col = fromVal.value;
        switch (col.type) {
            case value_pb_js_1.Value_Type.STR:
                if (pos.type !== value_pb_js_1.Value_Type.NUM) {
                    return errorUnexpectedType(elem.get.path, pos.type, [value_pb_js_1.Value_Type.NUM]);
                }
                if (!canInt(pos)) {
                    return errorIndexNotInteger(elem.get.path, pos.num);
                }
                const idxStr = Math.floor(pos.num);
                if (idxStr < 0 || idxStr >= col.str.length) {
                    return errorIndexOutOfBounds(elem.get.path, pos, 0, col.str.length);
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.strValue)(col.str[idxStr]) });
            case value_pb_js_1.Value_Type.ARR:
                if (pos.type !== value_pb_js_1.Value_Type.NUM) {
                    return errorUnexpectedType(elem.get.path, pos.type, [value_pb_js_1.Value_Type.NUM]);
                }
                if (!canInt(pos)) {
                    return errorIndexNotInteger(elem.get.path, pos.num);
                }
                const idxArr = Math.floor(pos.num);
                if (idxArr < 0 || idxArr >= col.arr.length) {
                    return errorIndexOutOfBounds(elem.get.path, pos, 0, col.arr.length);
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: col.arr[idxArr] });
            case value_pb_js_1.Value_Type.OBJ:
                if (pos.type !== value_pb_js_1.Value_Type.STR) {
                    return errorUnexpectedType(elem.get.path, pos.type, [value_pb_js_1.Value_Type.STR]);
                }
                const key = pos.str;
                if (!(key in col.obj)) {
                    return errorInvalidKey(elem.get.path, key, Object.keys(col.obj));
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: col.obj[key] });
            default:
                return errorUnexpectedType(elem.from.path, col.type, [value_pb_js_1.Value_Type.STR, value_pb_js_1.Value_Type.ARR, value_pb_js_1.Value_Type.OBJ]);
        }
    }
    evaluateCall(input) {
        const call = input.expr.call;
        let st = (0, def_stack_js_1.find)(input.defStack, call.ident);
        if (!st) {
            const ext = this.config.extension.get(call.ident);
            if (!ext) {
                return errorReferenceNotFound(input.expr.path, call.ident);
            }
            const args = {};
            for (const [argName, argExpr] of Object.entries(call.args)) {
                const argVal = this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, {
                    defStack: input.defStack,
                    expr: argExpr
                }));
                if (argVal.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
                    return argVal;
                }
                args[argName] = argVal.value;
            }
            return ext(input.expr.path, args);
        }
        const def = st.def;
        for (const argName of def.args) {
            const arg = call.args[argName];
            if (!arg) {
                return errorArgumentMismatch(input.expr.path, argName);
            }
            const argVal = this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, { defStack: input.defStack, expr: arg }));
            if (argVal.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
                return argVal;
            }
            st = (0, def_stack_js_1.register)(st, (0, def_stack_js_1.newDefinition)((0, path_js_1.append)(input.expr.path, call.ident, argName), argName, argVal.value));
        }
        return this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, { defStack: st, expr: def.body }));
    }
    evaluateCases(input) {
        const cases = input.expr.cases.cases;
        for (const case_ of cases) {
            if (case_.isOtherwise) {
                return this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, {
                    defStack: input.defStack,
                    expr: case_.otherwise
                }));
            }
            else {
                const boolVal = this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, {
                    defStack: input.defStack,
                    expr: case_.when
                }));
                if (boolVal.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
                    return boolVal;
                }
                if (boolVal.value.type !== value_pb_js_1.Value_Type.BOOL) {
                    return errorUnexpectedType(case_.when.path, boolVal.value.type, [value_pb_js_1.Value_Type.BOOL]);
                }
                if (boolVal.value.bool) {
                    return this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, {
                        defStack: input.defStack,
                        expr: case_.then
                    }));
                }
            }
        }
        return errorCasesNotExhaustive((0, path_js_1.append)(input.expr.path, "cases"));
    }
    evaluateOpUnary(input) {
        const op = input.expr.opUnary;
        const o = this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, { defStack: input.defStack, expr: op.operand }));
        if (o.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
            return o;
        }
        const operand = o.value;
        switch (op.op) {
            case expr_pb_js_1.OpUnary_Op.LEN:
                switch (operand.type) {
                    case value_pb_js_1.Value_Type.STR:
                        return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.numValue)(operand.str.length) });
                    case value_pb_js_1.Value_Type.ARR:
                        return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.numValue)(operand.arr.length) });
                    case value_pb_js_1.Value_Type.OBJ:
                        return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.numValue)(Object.keys(operand.obj).length) });
                    default:
                        return errorUnexpectedType((0, path_js_1.append)(input.expr.path, "len"), operand.type, [value_pb_js_1.Value_Type.STR, value_pb_js_1.Value_Type.ARR, value_pb_js_1.Value_Type.OBJ]);
                }
            case expr_pb_js_1.OpUnary_Op.NOT:
                if (operand.type !== value_pb_js_1.Value_Type.BOOL) {
                    return errorUnexpectedType((0, path_js_1.append)(input.expr.path, "not"), operand.type, [value_pb_js_1.Value_Type.BOOL]);
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.boolValue)(!operand.bool) });
            case expr_pb_js_1.OpUnary_Op.FLAT:
                if (operand.type !== value_pb_js_1.Value_Type.ARR) {
                    return errorUnexpectedType((0, path_js_1.append)(input.expr.path, "flat"), operand.type, [value_pb_js_1.Value_Type.ARR]);
                }
                const flatArr = [];
                for (const elem of operand.arr) {
                    if (elem.type !== value_pb_js_1.Value_Type.ARR) {
                        return errorUnexpectedType((0, path_js_1.append)(input.expr.path, "flat"), elem.type, [value_pb_js_1.Value_Type.ARR]);
                    }
                    flatArr.push(...elem.arr);
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.arrValue)(flatArr) });
            case expr_pb_js_1.OpUnary_Op.FLOOR:
                if (operand.type !== value_pb_js_1.Value_Type.NUM) {
                    return errorUnexpectedType((0, path_js_1.append)(input.expr.path, "floor"), operand.type, [value_pb_js_1.Value_Type.NUM]);
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.numValue)(Math.floor(operand.num)) });
            case expr_pb_js_1.OpUnary_Op.CEIL:
                if (operand.type !== value_pb_js_1.Value_Type.NUM) {
                    return errorUnexpectedType((0, path_js_1.append)(input.expr.path, "ceil"), operand.type, [value_pb_js_1.Value_Type.NUM]);
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.numValue)(Math.ceil(operand.num)) });
            case expr_pb_js_1.OpUnary_Op.ABORT:
                if (operand.type !== value_pb_js_1.Value_Type.STR) {
                    return errorUnexpectedType((0, path_js_1.append)(input.expr.path, "abort"), operand.type, [value_pb_js_1.Value_Type.STR]);
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { status: evaluator_pb_js_1.EvaluateOutput_Status.ABORTED, errorMessage: operand.str });
            default:
                throw new Error(`unexpected unary operator ${expr_pb_js_1.OpUnary_Op[op.op]}`);
        }
    }
    evaluateOpBinary(input) {
        const op = input.expr.opBinary;
        const ol = this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, { defStack: input.defStack, expr: op.left }));
        if (ol.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
            return ol;
        }
        const or = this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, { defStack: input.defStack, expr: op.right }));
        if (or.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
            return or;
        }
        const operandL = ol.value;
        const operandR = or.value;
        switch (op.op) {
            case expr_pb_js_1.OpBinary_Op.SUB:
                if (operandL.type !== value_pb_js_1.Value_Type.NUM) {
                    return errorUnexpectedType((0, path_js_1.append)(input.expr.path, "sub", 0), operandL.type, [value_pb_js_1.Value_Type.NUM]);
                }
                if (operandR.type !== value_pb_js_1.Value_Type.NUM) {
                    return errorUnexpectedType((0, path_js_1.append)(input.expr.path, "sub", 1), operandR.type, [value_pb_js_1.Value_Type.NUM]);
                }
                const subResult = operandL.num - operandR.num;
                if (!isFinite(subResult)) {
                    return errorNotFiniteNumber(input.expr.path);
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.numValue)(subResult) });
            case expr_pb_js_1.OpBinary_Op.DIV:
                if (operandL.type !== value_pb_js_1.Value_Type.NUM) {
                    return errorUnexpectedType((0, path_js_1.append)(input.expr.path, "div", 0), operandL.type, [value_pb_js_1.Value_Type.NUM]);
                }
                if (operandR.type !== value_pb_js_1.Value_Type.NUM) {
                    return errorUnexpectedType((0, path_js_1.append)(input.expr.path, "div", 1), operandR.type, [value_pb_js_1.Value_Type.NUM]);
                }
                const divResult = operandL.num / operandR.num;
                if (!isFinite(divResult)) {
                    return errorNotFiniteNumber(input.expr.path);
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.numValue)(divResult) });
            case expr_pb_js_1.OpBinary_Op.EQ:
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: equal(operandL, operandR) });
            case expr_pb_js_1.OpBinary_Op.NEQ:
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.boolValue)(!equal(operandL, operandR).bool) });
            case expr_pb_js_1.OpBinary_Op.LT:
                const ltCmpVal = compare((0, path_js_1.append)(input.expr.path, "lt"), operandL, operandR);
                if (ltCmpVal.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
                    return ltCmpVal;
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.boolValue)(ltCmpVal.value.num < 0) });
            case expr_pb_js_1.OpBinary_Op.LTE:
                const lteCmpVal = compare((0, path_js_1.append)(input.expr.path, "lte"), operandL, operandR);
                if (lteCmpVal.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
                    return lteCmpVal;
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.boolValue)(lteCmpVal.value.num <= 0) });
            case expr_pb_js_1.OpBinary_Op.GT:
                const gtCmpVal = compare((0, path_js_1.append)(input.expr.path, "gt"), operandL, operandR);
                if (gtCmpVal.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
                    return gtCmpVal;
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.boolValue)(gtCmpVal.value.num > 0) });
            case expr_pb_js_1.OpBinary_Op.GTE:
                const gteCmpVal = compare((0, path_js_1.append)(input.expr.path, "gte"), operandL, operandR);
                if (gteCmpVal.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
                    return gteCmpVal;
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.boolValue)(gteCmpVal.value.num >= 0) });
            default:
                throw new Error(`unexpected binary operator ${expr_pb_js_1.OpBinary_Op[op.op]}`);
        }
    }
    evaluateOpVariadic(input) {
        const op = input.expr.opVariadic;
        const operands = [];
        for (const elem of op.operands) {
            const val = this.evaluateExpr((0, protobuf_1.create)(evaluator_pb_js_1.EvaluateInputSchema, { defStack: input.defStack, expr: elem }));
            if (val.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
                return val;
            }
            operands.push(val.value);
        }
        switch (op.op) {
            case expr_pb_js_1.OpVariadic_Op.ADD:
                let addVal = 0.0;
                for (let i = 0; i < operands.length; i++) {
                    const operand = operands[i];
                    if (operand.type !== value_pb_js_1.Value_Type.NUM) {
                        return errorUnexpectedType((0, path_js_1.append)(input.expr.path, "add", i), operand.type, [value_pb_js_1.Value_Type.NUM]);
                    }
                    addVal += operand.num;
                }
                if (!isFinite(addVal)) {
                    return errorNotFiniteNumber((0, path_js_1.append)(input.expr.path, "add"));
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.numValue)(addVal) });
            case expr_pb_js_1.OpVariadic_Op.MUL:
                let mulVal = 1.0;
                for (let i = 0; i < operands.length; i++) {
                    const operand = operands[i];
                    if (operand.type !== value_pb_js_1.Value_Type.NUM) {
                        return errorUnexpectedType((0, path_js_1.append)(input.expr.path, "mul", i), operand.type, [value_pb_js_1.Value_Type.NUM]);
                    }
                    mulVal *= operand.num;
                }
                if (!isFinite(mulVal)) {
                    return errorNotFiniteNumber((0, path_js_1.append)(input.expr.path, "mul"));
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.numValue)(mulVal) });
            case expr_pb_js_1.OpVariadic_Op.AND:
                for (let i = 0; i < operands.length; i++) {
                    const operand = operands[i];
                    if (operand.type !== value_pb_js_1.Value_Type.BOOL) {
                        return errorUnexpectedType((0, path_js_1.append)(input.expr.path, "and", i), operand.type, [value_pb_js_1.Value_Type.BOOL]);
                    }
                    if (!operand.bool) {
                        return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.boolValue)(false) });
                    }
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.boolValue)(true) });
            case expr_pb_js_1.OpVariadic_Op.OR:
                for (let i = 0; i < operands.length; i++) {
                    const operand = operands[i];
                    if (operand.type !== value_pb_js_1.Value_Type.BOOL) {
                        return errorUnexpectedType((0, path_js_1.append)(input.expr.path, "or", i), operand.type, [value_pb_js_1.Value_Type.BOOL]);
                    }
                    if (operand.bool) {
                        return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.boolValue)(true) });
                    }
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.boolValue)(false) });
            case expr_pb_js_1.OpVariadic_Op.CAT:
                let catVal = "";
                for (let i = 0; i < operands.length; i++) {
                    const operand = operands[i];
                    if (operand.type !== value_pb_js_1.Value_Type.STR) {
                        return errorUnexpectedType((0, path_js_1.append)(input.expr.path, "cat", i), operand.type, [value_pb_js_1.Value_Type.STR]);
                    }
                    catVal += operand.str;
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.strValue)(catVal) });
            case expr_pb_js_1.OpVariadic_Op.MIN:
                let minVal = Infinity;
                for (let i = 0; i < operands.length; i++) {
                    const operand = operands[i];
                    if (operand.type !== value_pb_js_1.Value_Type.NUM) {
                        return errorUnexpectedType((0, path_js_1.append)(input.expr.path, "min", i), operand.type, [value_pb_js_1.Value_Type.NUM]);
                    }
                    minVal = Math.min(minVal, operand.num);
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.numValue)(minVal) });
            case expr_pb_js_1.OpVariadic_Op.MAX:
                let maxVal = -Infinity;
                for (let i = 0; i < operands.length; i++) {
                    const operand = operands[i];
                    if (operand.type !== value_pb_js_1.Value_Type.NUM) {
                        return errorUnexpectedType((0, path_js_1.append)(input.expr.path, "max", i), operand.type, [value_pb_js_1.Value_Type.NUM]);
                    }
                    maxVal = Math.max(maxVal, operand.num);
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.numValue)(maxVal) });
            case expr_pb_js_1.OpVariadic_Op.MERGE:
                const mergeVal = {};
                for (let i = 0; i < operands.length; i++) {
                    const operand = operands[i];
                    if (operand.type !== value_pb_js_1.Value_Type.OBJ) {
                        return errorUnexpectedType((0, path_js_1.append)(input.expr.path, "merge", i), operand.type, [value_pb_js_1.Value_Type.OBJ]);
                    }
                    Object.assign(mergeVal, operand.obj);
                }
                return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.objValue)(mergeVal) });
            default:
                throw new Error(`unexpected variadic operator ${expr_pb_js_1.OpVariadic_Op[op.op]}`);
        }
    }
}
exports.Evaluator = Evaluator;
function errorIndexOutOfBounds(path, index, begin, end) {
    return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, {
        status: evaluator_pb_js_1.EvaluateOutput_Status.INVALID_INDEX,
        errorPath: path,
        errorMessage: `invalid index: index out of bounds: ${index.num} not in [${begin}, ${end})`,
    });
}
function errorIndexNotInteger(path, index) {
    return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, {
        status: evaluator_pb_js_1.EvaluateOutput_Status.INVALID_INDEX,
        errorPath: path,
        errorMessage: `invalid index: non integer index: ${index}`,
    });
}
function errorInvalidKey(path, key, keys) {
    return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, {
        status: evaluator_pb_js_1.EvaluateOutput_Status.INVALID_INDEX,
        errorPath: path,
        errorMessage: `invalid key: "${key}" not in {${keys.join(",")}}`,
    });
}
function errorUnexpectedType(path, got, want) {
    const wantStr = want.map(t => t.toString());
    return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, {
        status: evaluator_pb_js_1.EvaluateOutput_Status.UNEXPECTED_TYPE,
        errorPath: path,
        errorMessage: `unexpected type: got ${got.toString()}, want {${wantStr.join(",")}}`,
    });
}
function errorArgumentMismatch(path, arg) {
    return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, {
        status: evaluator_pb_js_1.EvaluateOutput_Status.ARGUMENT_MISMATCH,
        errorPath: path,
        errorMessage: `argument mismatch: argument "${arg}" required`,
    });
}
function errorReferenceNotFound(path, ref) {
    return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, {
        status: evaluator_pb_js_1.EvaluateOutput_Status.REFERENCE_NOT_FOUND,
        errorPath: path,
        errorMessage: `reference not found: "${ref}"`,
    });
}
function errorCasesNotExhaustive(path) {
    return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, {
        status: evaluator_pb_js_1.EvaluateOutput_Status.CASES_NOT_EXHAUSTIVE,
        errorPath: path,
        errorMessage: "cases not exhaustive",
    });
}
function errorNotComparable(path) {
    return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, {
        status: evaluator_pb_js_1.EvaluateOutput_Status.NOT_COMPARABLE,
        errorPath: path,
        errorMessage: "not comparable",
    });
}
function errorNotFiniteNumber(path) {
    return (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, {
        status: evaluator_pb_js_1.EvaluateOutput_Status.NOT_FINITE_NUMBER,
        errorPath: path,
        errorMessage: "not finite number",
    });
}
function canInt(v) {
    return v.type === value_pb_js_1.Value_Type.NUM && v.num === Math.floor(v.num);
}
function sortedKeys(m) {
    return Object.keys(m).sort();
}
function equal(l, r) {
    const falseValue = (0, value_js_1.boolValue)(false);
    const trueValue = (0, value_js_1.boolValue)(true);
    if (l.type !== r.type) {
        return falseValue;
    }
    switch (l.type) {
        case value_pb_js_1.Value_Type.NUM:
            return (0, value_js_1.boolValue)(l.num === r.num);
        case value_pb_js_1.Value_Type.BOOL:
            return (0, value_js_1.boolValue)(l.bool === r.bool);
        case value_pb_js_1.Value_Type.STR:
            return (0, value_js_1.boolValue)(l.str === r.str);
        case value_pb_js_1.Value_Type.ARR:
            if (l.arr.length !== r.arr.length) {
                return falseValue;
            }
            for (let i = 0; i < l.arr.length; i++) {
                if (!equal(l.arr[i], r.arr[i]).bool) {
                    return falseValue;
                }
            }
            return trueValue;
        case value_pb_js_1.Value_Type.OBJ:
            const lKeys = sortedKeys(l.obj);
            const rKeys = sortedKeys(r.obj);
            if (lKeys.length !== rKeys.length || !lKeys.every((key, i) => key === rKeys[i])) {
                return falseValue;
            }
            for (const key of lKeys) {
                if (!equal(l.obj[key], r.obj[key]).bool) {
                    return falseValue;
                }
            }
            return trueValue;
        default:
            throw new Error(`unexpected type ${l.type}`);
    }
}
function compare(path, l, r) {
    const ltValue = (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.numValue)(-1) });
    const gtValue = (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.numValue)(1) });
    const eqValue = (0, protobuf_1.create)(evaluator_pb_js_1.EvaluateOutputSchema, { value: (0, value_js_1.numValue)(0) });
    switch (l.type) {
        case value_pb_js_1.Value_Type.NUM:
            if (r.type !== value_pb_js_1.Value_Type.NUM) {
                return errorNotComparable(path);
            }
            return l.num < r.num ? ltValue : l.num > r.num ? gtValue : eqValue;
        case value_pb_js_1.Value_Type.BOOL:
            if (r.type !== value_pb_js_1.Value_Type.BOOL) {
                return errorNotComparable(path);
            }
            return !l.bool && r.bool ? ltValue : l.bool && !r.bool ? gtValue : eqValue;
        case value_pb_js_1.Value_Type.STR:
            if (r.type !== value_pb_js_1.Value_Type.STR) {
                return errorNotComparable(path);
            }
            return l.str < r.str ? ltValue : l.str > r.str ? gtValue : eqValue;
        case value_pb_js_1.Value_Type.ARR:
            if (r.type !== value_pb_js_1.Value_Type.ARR) {
                return errorNotComparable(path);
            }
            const minLength = Math.min(l.arr.length, r.arr.length);
            for (let i = 0; i < minLength; i++) {
                const cmp = compare(path, l.arr[i], r.arr[i]);
                if (cmp.status !== evaluator_pb_js_1.EvaluateOutput_Status.OK) {
                    return cmp;
                }
                if (cmp.value.num !== 0) {
                    return cmp;
                }
            }
            return l.arr.length < r.arr.length ? ltValue : l.arr.length > r.arr.length ? gtValue : eqValue;
        default:
            return errorNotComparable(path);
    }
}
