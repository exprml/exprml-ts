import {
    EvaluateInput,
    EvaluateInputSchema,
    EvaluateOutput,
    EvaluateOutput_Status,
    EvaluateOutputSchema
} from "./gen/pb/exprml/v1/evaluator_pb.js";
import {create} from "@bufbuild/protobuf";
import {Expr_Kind, Expr_Path, OpBinary_Op, OpUnary_Op, OpVariadic_Op} from "./gen/pb/exprml/v1/expr_pb.js";
import {find, newDefinition, register} from "./def_stack.js";
import {Value, Value_Type} from "./gen/pb/exprml/v1/value_pb.js";
import {arrValue, boolValue, numValue, objValue, strValue} from "./value.js";
import {append} from "./path.js";

export class Config {
    constructor(props?: {
        extension?: Map<string, (path: Expr_Path, args: Record<string, Value>) => EvaluateOutput>;
        beforeEvaluate?: (input: EvaluateInput) => void;
        afterEvaluate?: (input: EvaluateInput, output: EvaluateOutput) => void;
    }) {
        this.extension = props?.extension ?? new Map();
        this.beforeEvaluate = props?.beforeEvaluate ?? (() => undefined);
        this.afterEvaluate = props?.afterEvaluate ?? (() => undefined);
    }

    extension: Map<string, (path: Expr_Path, args: Record<string, Value>) => EvaluateOutput>;
    beforeEvaluate: (input: EvaluateInput) => void;
    afterEvaluate: (input: EvaluateInput, output: EvaluateOutput) => void;
}

export class Evaluator {
    constructor(config: Config = new Config()) {
        this.config = config;
    }

    private readonly config: Config;

    evaluateExpr(input: EvaluateInput): EvaluateOutput {
        try {
            this.config.beforeEvaluate(input);
        } catch (err) {
            return create(EvaluateOutputSchema, {
                status: EvaluateOutput_Status.UNKNOWN_ERROR,
                errorPath: input.expr!.path,
                errorMessage: `beforeEvaluate failed: ${err instanceof Error ? err.message : JSON.stringify(err)}`,
            });
        }

        let output: EvaluateOutput;
        switch (input.expr!.kind) {
            default:
                throw new Error("given expression must be validated");
            case Expr_Kind.EVAL:
                output = this.evaluateEval(input);
                break;
            case Expr_Kind.SCALAR:
                output = this.evaluateScalar(input);
                break;
            case Expr_Kind.REF:
                output = this.evaluateRef(input);
                break;
            case Expr_Kind.OBJ:
                output = this.evaluateObj(input);
                break;
            case Expr_Kind.ARR:
                output = this.evaluateArr(input);
                break;
            case Expr_Kind.JSON:
                output = this.evaluateJson(input);
                break;
            case Expr_Kind.ITER:
                output = this.evaluateIter(input);
                break;
            case Expr_Kind.ELEM:
                output = this.evaluateElem(input);
                break;
            case Expr_Kind.CALL:
                output = this.evaluateCall(input);
                break;
            case Expr_Kind.CASES:
                output = this.evaluateCases(input);
                break;
            case Expr_Kind.OP_UNARY:
                output = this.evaluateOpUnary(input);
                break;
            case Expr_Kind.OP_BINARY:
                output = this.evaluateOpBinary(input);
                break;
            case Expr_Kind.OP_VARIADIC:
                output = this.evaluateOpVariadic(input);
                break;
        }

        try {
            this.config.afterEvaluate(input, output);
        } catch (err) {
            return create(EvaluateOutputSchema, {
                status: EvaluateOutput_Status.UNKNOWN_ERROR,
                errorPath: input.expr!.path,
                errorMessage: `afterEvaluate failed: ${err instanceof Error ? err.message : JSON.stringify(err)}`,
            });
        }

        return output;
    }

    evaluateEval(input: EvaluateInput): EvaluateOutput {
        let st = input.defStack!;
        const where = input.expr!.eval?.where ?? [];
        for (const def of where) {
            st = register(st, def);
        }
        return this.evaluateExpr(create(EvaluateInputSchema, {defStack: st, expr: input.expr!.eval!.eval}));
    }

    evaluateScalar(input: EvaluateInput): EvaluateOutput {
        return create(EvaluateOutputSchema, {value: input.expr!.scalar!.scalar});
    }

    evaluateRef(input: EvaluateInput): EvaluateOutput {
        const ref = input.expr!.ref!;
        let st = find(input.defStack!, ref.ident);
        if (!st) {
            const ext = this.config.extension.get(ref.ident);
            if (!ext) {
                return errorReferenceNotFound(input.expr!.path!, ref.ident);
            }
            return ext(input.expr!.path!, {});
        }
        return this.evaluateExpr(create(EvaluateInputSchema, {defStack: st, expr: st.def!.body!}));
    }

    evaluateObj(input: EvaluateInput): EvaluateOutput {
        const result: Record<string, Value> = {};
        for (const [pos, expr] of Object.entries(input.expr!.obj!.obj)) {
            const val = this.evaluateExpr(create(EvaluateInputSchema, {defStack: input.defStack, expr: expr}));
            if (val.status !== EvaluateOutput_Status.OK) {
                return val;
            }
            result[pos] = val.value!;
        }
        return create(EvaluateOutputSchema, {value: objValue(result)});
    }

    evaluateArr(input: EvaluateInput): EvaluateOutput {
        const result: Value[] = [];
        for (const expr of input.expr!.arr!.arr) {
            const val = this.evaluateExpr(create(EvaluateInputSchema, {defStack: input.defStack, expr: expr}));
            if (val.status !== EvaluateOutput_Status.OK) {
                return val;
            }
            result.push(val.value!);
        }
        return create(EvaluateOutputSchema, {value: arrValue(result)});
    }

    evaluateJson(input: EvaluateInput): EvaluateOutput {
        return create(EvaluateOutputSchema, {value: input.expr!.json!.json});
    }

    evaluateIter(input: EvaluateInput): EvaluateOutput {
        const iter = input.expr!.iter!;
        const forPos = iter.posIdent!;
        const forElem = iter.elemIdent!;
        const inVal = this.evaluateExpr(create(EvaluateInputSchema, {defStack: input.defStack, expr: iter.col!}));

        switch (inVal.value!.type) {
            case Value_Type.STR:
                const strResult: Value[] = [];
                for (let i = 0; i < inVal.value!.str.length; i++) {
                    let st = input.defStack!;
                    st = register(st, newDefinition(input.expr!.path!, forPos, numValue(i)));
                    st = register(st, newDefinition(input.expr!.path!, forElem, strValue(inVal.value!.str[i])));
                    if (iter.if) {
                        const ifVal = this.evaluateExpr(create(EvaluateInputSchema, {defStack: st, expr: iter.if}));
                        if (ifVal.status !== EvaluateOutput_Status.OK) {
                            return ifVal;
                        }
                        if (ifVal.value!.type !== Value_Type.BOOL) {
                            return errorUnexpectedType(iter.if.path!, ifVal.value!.type, [Value_Type.BOOL]);
                        }
                        if (!ifVal.value!.bool) {
                            continue;
                        }
                    }
                    const v = this.evaluateExpr(create(EvaluateInputSchema, {defStack: st, expr: iter.do}));
                    if (v.status !== EvaluateOutput_Status.OK) {
                        return v;
                    }
                    strResult.push(v.value!);
                }
                return create(EvaluateOutputSchema, {value: arrValue(strResult)});
            case Value_Type.ARR:
                const arrResult: Value[] = [];
                for (let i = 0; i < inVal.value!.arr.length; i++) {
                    let st = input.defStack!;
                    st = register(st, newDefinition(input.expr!.path!, forPos, numValue(i)));
                    st = register(st, newDefinition(input.expr!.path!, forElem, inVal.value!.arr[i]));
                    if (iter.if) {
                        const ifVal = this.evaluateExpr(create(EvaluateInputSchema, {defStack: st, expr: iter.if}));
                        if (ifVal.status !== EvaluateOutput_Status.OK) {
                            return ifVal;
                        }
                        if (ifVal.value!.type !== Value_Type.BOOL) {
                            return errorUnexpectedType(iter.if.path!, ifVal.value!.type, [Value_Type.BOOL]);
                        }
                        if (!ifVal.value!.bool) {
                            continue;
                        }
                    }
                    const v = this.evaluateExpr(create(EvaluateInputSchema, {defStack: st, expr: iter.do}));
                    if (v.status !== EvaluateOutput_Status.OK) {
                        return v;
                    }
                    arrResult.push(v.value!);
                }
                return create(EvaluateOutputSchema, {value: arrValue(arrResult)});
            case Value_Type.OBJ:
                const objResult: Record<string, Value> = {};
                for (const key of sortedKeys(inVal.value!.obj)) {
                    let st = input.defStack!;
                    st = register(st, newDefinition(input.expr!.path!, forPos, strValue(key)));
                    st = register(st, newDefinition(input.expr!.path!, forElem, inVal.value!.obj[key]));
                    if (iter.if) {
                        const ifVal = this.evaluateExpr(create(EvaluateInputSchema, {defStack: st, expr: iter.if}));
                        if (ifVal.status !== EvaluateOutput_Status.OK) {
                            return ifVal;
                        }
                        if (ifVal.value!.type !== Value_Type.BOOL) {
                            return errorUnexpectedType(iter.if.path!, ifVal.value!.type, [Value_Type.BOOL]);
                        }
                        if (!ifVal.value!.bool) {
                            continue;
                        }
                    }
                    const v = this.evaluateExpr(create(EvaluateInputSchema, {defStack: st, expr: iter.do}));
                    if (v.status !== EvaluateOutput_Status.OK) {
                        return v;
                    }
                    objResult[key] = v.value!;
                }
                return create(EvaluateOutputSchema, {value: objValue(objResult)});
            default:
                return errorUnexpectedType(iter.col!.path!, inVal.value!.type, [Value_Type.STR, Value_Type.ARR, Value_Type.OBJ]);
        }
    }

    evaluateElem(input: EvaluateInput): EvaluateOutput {
        const elem = input.expr!.elem!;
        const getVal = this.evaluateExpr(create(EvaluateInputSchema, {defStack: input.defStack, expr: elem.get!}));
        if (getVal.status !== EvaluateOutput_Status.OK) {
            return getVal;
        }
        const pos = getVal.value!;
        const fromVal = this.evaluateExpr(create(EvaluateInputSchema, {defStack: input.defStack, expr: elem.from!}));
        if (fromVal.status !== EvaluateOutput_Status.OK) {
            return fromVal;
        }
        const col = fromVal.value!;
        switch (col.type) {
            case Value_Type.STR:
                if (pos.type !== Value_Type.NUM) {
                    return errorUnexpectedType(elem.get!.path!, pos.type, [Value_Type.NUM]);
                }
                if (!canInt(pos)) {
                    return errorIndexNotInteger(elem.get!.path!, pos.num);
                }
                const idxStr = Math.floor(pos.num);
                if (idxStr < 0 || idxStr >= col.str.length) {
                    return errorIndexOutOfBounds(elem.get!.path!, pos, 0, col.str.length);
                }
                return create(EvaluateOutputSchema, {value: strValue(col.str[idxStr])});
            case Value_Type.ARR:
                if (pos.type !== Value_Type.NUM) {
                    return errorUnexpectedType(elem.get!.path!, pos.type, [Value_Type.NUM]);
                }
                if (!canInt(pos)) {
                    return errorIndexNotInteger(elem.get!.path!, pos.num);
                }
                const idxArr = Math.floor(pos.num);
                if (idxArr < 0 || idxArr >= col.arr.length) {
                    return errorIndexOutOfBounds(elem.get!.path!, pos, 0, col.arr.length);
                }
                return create(EvaluateOutputSchema, {value: col.arr[idxArr]});
            case Value_Type.OBJ:
                if (pos.type !== Value_Type.STR) {
                    return errorUnexpectedType(elem.get!.path!, pos.type, [Value_Type.STR]);
                }
                const key = pos.str;
                if (!(key in col.obj)) {
                    return errorInvalidKey(elem.get!.path!, key, Object.keys(col.obj));
                }
                return create(EvaluateOutputSchema, {value: col.obj[key]});
            default:
                return errorUnexpectedType(elem.from!.path!, col.type, [Value_Type.STR, Value_Type.ARR, Value_Type.OBJ]);
        }
    }

    evaluateCall(input: EvaluateInput): EvaluateOutput {
        const call = input.expr!.call!;
        let st = find(input.defStack!, call.ident);
        if (!st) {
            const ext = this.config.extension.get(call.ident);
            if (!ext) {
                return errorReferenceNotFound(input.expr!.path!, call.ident);
            }
            const args: Record<string, Value> = {};
            for (const [argName, argExpr] of Object.entries(call.args)) {
                const argVal = this.evaluateExpr(create(EvaluateInputSchema, {
                    defStack: input.defStack,
                    expr: argExpr
                }));
                if (argVal.status !== EvaluateOutput_Status.OK) {
                    return argVal;
                }
                args[argName] = argVal.value!;
            }
            return ext(input.expr!.path!, args);
        }
        const def = st.def!;
        for (const argName of def.args) {
            const arg = call.args[argName];
            if (!arg) {
                return errorArgumentMismatch(input.expr!.path!, argName);
            }
            const argVal = this.evaluateExpr(create(EvaluateInputSchema, {defStack: input.defStack, expr: arg}));
            if (argVal.status !== EvaluateOutput_Status.OK) {
                return argVal;
            }
            st = register(st, newDefinition(append(input.expr!.path!, call.ident, argName), argName, argVal.value!));
        }
        return this.evaluateExpr(create(EvaluateInputSchema, {defStack: st, expr: def.body!}));
    }

    evaluateCases(input: EvaluateInput): EvaluateOutput {
        const cases = input.expr!.cases!.cases;
        for (const case_ of cases) {
            if (case_.isOtherwise) {
                return this.evaluateExpr(create(EvaluateInputSchema, {
                    defStack: input.defStack,
                    expr: case_.otherwise!
                }));
            } else {
                const boolVal = this.evaluateExpr(create(EvaluateInputSchema, {
                    defStack: input.defStack,
                    expr: case_.when!
                }));
                if (boolVal.status !== EvaluateOutput_Status.OK) {
                    return boolVal;
                }
                if (boolVal.value!.type !== Value_Type.BOOL) {
                    return errorUnexpectedType(case_.when!.path!, boolVal.value!.type, [Value_Type.BOOL]);
                }
                if (boolVal.value!.bool) {
                    return this.evaluateExpr(create(EvaluateInputSchema, {
                        defStack: input.defStack,
                        expr: case_.then!
                    }));
                }
            }
        }
        return errorCasesNotExhaustive(append(input.expr!.path!, "cases"));
    }

    evaluateOpUnary(input: EvaluateInput): EvaluateOutput {
        const op = input.expr!.opUnary!;
        const o = this.evaluateExpr(create(EvaluateInputSchema, {defStack: input.defStack, expr: op.operand!}));
        if (o.status !== EvaluateOutput_Status.OK) {
            return o;
        }
        const operand = o.value!;
        switch (op.op) {
            case OpUnary_Op.LEN:
                switch (operand.type) {
                    case Value_Type.STR:
                        return create(EvaluateOutputSchema, {value: numValue(operand.str.length)});
                    case Value_Type.ARR:
                        return create(EvaluateOutputSchema, {value: numValue(operand.arr.length)});
                    case Value_Type.OBJ:
                        return create(EvaluateOutputSchema, {value: numValue(Object.keys(operand.obj).length)});
                    default:
                        return errorUnexpectedType(append(input.expr!.path!, "len"), operand.type, [Value_Type.STR, Value_Type.ARR, Value_Type.OBJ]);
                }
            case OpUnary_Op.NOT:
                if (operand.type !== Value_Type.BOOL) {
                    return errorUnexpectedType(append(input.expr!.path!, "not"), operand.type, [Value_Type.BOOL]);
                }
                return create(EvaluateOutputSchema, {value: boolValue(!operand.bool)});
            case OpUnary_Op.FLAT:
                if (operand.type !== Value_Type.ARR) {
                    return errorUnexpectedType(append(input.expr!.path!, "flat"), operand.type, [Value_Type.ARR]);
                }
                const flatArr: Value[] = [];
                for (const elem of operand.arr) {
                    if (elem.type !== Value_Type.ARR) {
                        return errorUnexpectedType(append(input.expr!.path!, "flat"), elem.type, [Value_Type.ARR]);
                    }
                    flatArr.push(...elem.arr);
                }
                return create(EvaluateOutputSchema, {value: arrValue(flatArr)});
            case OpUnary_Op.FLOOR:
                if (operand.type !== Value_Type.NUM) {
                    return errorUnexpectedType(append(input.expr!.path!, "floor"), operand.type, [Value_Type.NUM]);
                }
                return create(EvaluateOutputSchema, {value: numValue(Math.floor(operand.num))});
            case OpUnary_Op.CEIL:
                if (operand.type !== Value_Type.NUM) {
                    return errorUnexpectedType(append(input.expr!.path!, "ceil"), operand.type, [Value_Type.NUM]);
                }
                return create(EvaluateOutputSchema, {value: numValue(Math.ceil(operand.num))});
            case OpUnary_Op.ABORT:
                if (operand.type !== Value_Type.STR) {
                    return errorUnexpectedType(append(input.expr!.path!, "abort"), operand.type, [Value_Type.STR]);
                }
                return create(EvaluateOutputSchema, {status: EvaluateOutput_Status.ABORTED, errorMessage: operand.str});
            default:
                throw new Error(`unexpected unary operator ${OpUnary_Op[op.op]}`);
        }
    }

    evaluateOpBinary(input: EvaluateInput): EvaluateOutput {
        const op = input.expr!.opBinary!;
        const ol = this.evaluateExpr(create(EvaluateInputSchema, {defStack: input.defStack, expr: op.left!}));
        if (ol.status !== EvaluateOutput_Status.OK) {
            return ol;
        }
        const or = this.evaluateExpr(create(EvaluateInputSchema, {defStack: input.defStack, expr: op.right!}));
        if (or.status !== EvaluateOutput_Status.OK) {
            return or;
        }
        const operandL = ol.value!;
        const operandR = or.value!;
        switch (op.op) {
            case OpBinary_Op.SUB:
                if (operandL.type !== Value_Type.NUM) {
                    return errorUnexpectedType(append(input.expr!.path!, "sub", 0), operandL.type, [Value_Type.NUM]);
                }
                if (operandR.type !== Value_Type.NUM) {
                    return errorUnexpectedType(append(input.expr!.path!, "sub", 1), operandR.type, [Value_Type.NUM]);
                }
                const subResult = operandL.num - operandR.num;
                if (!isFinite(subResult)) {
                    return errorNotFiniteNumber(input.expr!.path!);
                }
                return create(EvaluateOutputSchema, {value: numValue(subResult)});
            case OpBinary_Op.DIV:
                if (operandL.type !== Value_Type.NUM) {
                    return errorUnexpectedType(append(input.expr!.path!, "div", 0), operandL.type, [Value_Type.NUM]);
                }
                if (operandR.type !== Value_Type.NUM) {
                    return errorUnexpectedType(append(input.expr!.path!, "div", 1), operandR.type, [Value_Type.NUM]);
                }
                const divResult = operandL.num / operandR.num;
                if (!isFinite(divResult)) {
                    return errorNotFiniteNumber(input.expr!.path!);
                }
                return create(EvaluateOutputSchema, {value: numValue(divResult)});
            case OpBinary_Op.EQ:
                return create(EvaluateOutputSchema, {value: equal(operandL, operandR)});
            case OpBinary_Op.NEQ:
                return create(EvaluateOutputSchema, {value: boolValue(!equal(operandL, operandR).bool)});
            case OpBinary_Op.LT:
                const ltCmpVal = compare(append(input.expr!.path!, "lt"), operandL, operandR);
                if (ltCmpVal.status !== EvaluateOutput_Status.OK) {
                    return ltCmpVal;
                }
                return create(EvaluateOutputSchema, {value: boolValue(ltCmpVal.value!.num < 0)});
            case OpBinary_Op.LTE:
                const lteCmpVal = compare(append(input.expr!.path!, "lte"), operandL, operandR);
                if (lteCmpVal.status !== EvaluateOutput_Status.OK) {
                    return lteCmpVal;
                }
                return create(EvaluateOutputSchema, {value: boolValue(lteCmpVal.value!.num <= 0)});
            case OpBinary_Op.GT:
                const gtCmpVal = compare(append(input.expr!.path!, "gt"), operandL, operandR);
                if (gtCmpVal.status !== EvaluateOutput_Status.OK) {
                    return gtCmpVal;
                }
                return create(EvaluateOutputSchema, {value: boolValue(gtCmpVal.value!.num > 0)});
            case OpBinary_Op.GTE:
                const gteCmpVal = compare(append(input.expr!.path!, "gte"), operandL, operandR);
                if (gteCmpVal.status !== EvaluateOutput_Status.OK) {
                    return gteCmpVal;
                }
                return create(EvaluateOutputSchema, {value: boolValue(gteCmpVal.value!.num >= 0)});
            default:
                throw new Error(`unexpected binary operator ${OpBinary_Op[op.op]}`);
        }
    }

    evaluateOpVariadic(input: EvaluateInput): EvaluateOutput {
        const op = input.expr!.opVariadic!;
        const operands: Value[] = [];
        for (const elem of op.operands) {
            const val = this.evaluateExpr(create(EvaluateInputSchema, {defStack: input.defStack, expr: elem}));
            if (val.status !== EvaluateOutput_Status.OK) {
                return val;
            }
            operands.push(val.value!);
        }
        switch (op.op) {
            case OpVariadic_Op.ADD:
                let addVal = 0.0;
                for (let i = 0; i < operands.length; i++) {
                    const operand = operands[i];
                    if (operand.type !== Value_Type.NUM) {
                        return errorUnexpectedType(append(input.expr!.path!, "add", i), operand.type, [Value_Type.NUM]);
                    }
                    addVal += operand.num;
                }
                if (!isFinite(addVal)) {
                    return errorNotFiniteNumber(append(input.expr!.path!, "add"));
                }
                return create(EvaluateOutputSchema, {value: numValue(addVal)});
            case OpVariadic_Op.MUL:
                let mulVal = 1.0;
                for (let i = 0; i < operands.length; i++) {
                    const operand = operands[i];
                    if (operand.type !== Value_Type.NUM) {
                        return errorUnexpectedType(append(input.expr!.path!, "mul", i), operand.type, [Value_Type.NUM]);
                    }
                    mulVal *= operand.num;
                }
                if (!isFinite(mulVal)) {
                    return errorNotFiniteNumber(append(input.expr!.path!, "mul"));
                }
                return create(EvaluateOutputSchema, {value: numValue(mulVal)});
            case OpVariadic_Op.AND:
                for (let i = 0; i < operands.length; i++) {
                    const operand = operands[i];
                    if (operand.type !== Value_Type.BOOL) {
                        return errorUnexpectedType(append(input.expr!.path!, "and", i), operand.type, [Value_Type.BOOL]);
                    }
                    if (!operand.bool) {
                        return create(EvaluateOutputSchema, {value: boolValue(false)});
                    }
                }
                return create(EvaluateOutputSchema, {value: boolValue(true)});
            case OpVariadic_Op.OR:
                for (let i = 0; i < operands.length; i++) {
                    const operand = operands[i];
                    if (operand.type !== Value_Type.BOOL) {
                        return errorUnexpectedType(append(input.expr!.path!, "or", i), operand.type, [Value_Type.BOOL]);
                    }
                    if (operand.bool) {
                        return create(EvaluateOutputSchema, {value: boolValue(true)});
                    }
                }
                return create(EvaluateOutputSchema, {value: boolValue(false)});
            case OpVariadic_Op.CAT:
                let catVal = "";
                for (let i = 0; i < operands.length; i++) {
                    const operand = operands[i];
                    if (operand.type !== Value_Type.STR) {
                        return errorUnexpectedType(append(input.expr!.path!, "cat", i), operand.type, [Value_Type.STR]);
                    }
                    catVal += operand.str;
                }
                return create(EvaluateOutputSchema, {value: strValue(catVal)});
            case OpVariadic_Op.MIN:
                let minVal = Infinity;
                for (let i = 0; i < operands.length; i++) {
                    const operand = operands[i];
                    if (operand.type !== Value_Type.NUM) {
                        return errorUnexpectedType(append(input.expr!.path!, "min", i), operand.type, [Value_Type.NUM]);
                    }
                    minVal = Math.min(minVal, operand.num);
                }
                return create(EvaluateOutputSchema, {value: numValue(minVal)});
            case OpVariadic_Op.MAX:
                let maxVal = -Infinity;
                for (let i = 0; i < operands.length; i++) {
                    const operand = operands[i];
                    if (operand.type !== Value_Type.NUM) {
                        return errorUnexpectedType(append(input.expr!.path!, "max", i), operand.type, [Value_Type.NUM]);
                    }
                    maxVal = Math.max(maxVal, operand.num);
                }
                return create(EvaluateOutputSchema, {value: numValue(maxVal)});
            case OpVariadic_Op.MERGE:
                const mergeVal: Record<string, Value> = {};
                for (let i = 0; i < operands.length; i++) {
                    const operand = operands[i];
                    if (operand.type !== Value_Type.OBJ) {
                        return errorUnexpectedType(append(input.expr!.path!, "merge", i), operand.type, [Value_Type.OBJ]);
                    }
                    Object.assign(mergeVal, operand.obj);
                }
                return create(EvaluateOutputSchema, {value: objValue(mergeVal)});
            default:
                throw new Error(`unexpected variadic operator ${OpVariadic_Op[op.op]}`);
        }
    }
}

function errorIndexOutOfBounds(path: Expr_Path, index: Value, begin: number, end: number): EvaluateOutput {
    return create(EvaluateOutputSchema, {
        status: EvaluateOutput_Status.INVALID_INDEX,
        errorPath: path,
        errorMessage: `invalid index: index out of bounds: ${index.num} not in [${begin}, ${end})`,
    });
}

function errorIndexNotInteger(path: Expr_Path, index: number): EvaluateOutput {
    return create(EvaluateOutputSchema, {
        status: EvaluateOutput_Status.INVALID_INDEX,
        errorPath: path,
        errorMessage: `invalid index: non integer index: ${index}`,
    });
}

function errorInvalidKey(path: Expr_Path, key: string, keys: string[]): EvaluateOutput {
    return create(EvaluateOutputSchema, {
        status: EvaluateOutput_Status.INVALID_INDEX,
        errorPath: path,
        errorMessage: `invalid key: "${key}" not in {${keys.join(",")}}`,
    });
}

function errorUnexpectedType(path: Expr_Path, got: Value_Type, want: Value_Type[]): EvaluateOutput {
    const wantStr = want.map(t => t.toString());
    return create(EvaluateOutputSchema, {
        status: EvaluateOutput_Status.UNEXPECTED_TYPE,
        errorPath: path,
        errorMessage: `unexpected type: got ${got.toString()}, want {${wantStr.join(",")}}`,
    });
}

function errorArgumentMismatch(path: Expr_Path, arg: string): EvaluateOutput {
    return create(EvaluateOutputSchema, {
        status: EvaluateOutput_Status.ARGUMENT_MISMATCH,
        errorPath: path,
        errorMessage: `argument mismatch: argument "${arg}" required`,
    });
}

function errorReferenceNotFound(path: Expr_Path, ref: string): EvaluateOutput {
    return create(EvaluateOutputSchema, {
        status: EvaluateOutput_Status.REFERENCE_NOT_FOUND,
        errorPath: path,
        errorMessage: `reference not found: "${ref}"`,
    });
}

function errorCasesNotExhaustive(path: Expr_Path): EvaluateOutput {
    return create(EvaluateOutputSchema, {
        status: EvaluateOutput_Status.CASES_NOT_EXHAUSTIVE,
        errorPath: path,
        errorMessage: "cases not exhaustive",
    });
}

function errorNotComparable(path: Expr_Path): EvaluateOutput {
    return create(EvaluateOutputSchema, {
        status: EvaluateOutput_Status.NOT_COMPARABLE,
        errorPath: path,
        errorMessage: "not comparable",
    });
}

function errorNotFiniteNumber(path: Expr_Path): EvaluateOutput {
    return create(EvaluateOutputSchema, {
        status: EvaluateOutput_Status.NOT_FINITE_NUMBER,
        errorPath: path,
        errorMessage: "not finite number",
    });
}

function canInt(v: Value): boolean {
    return v.type === Value_Type.NUM && v.num === Math.floor(v.num);
}

function sortedKeys(m: Record<string, Value>): string[] {
    return Object.keys(m).sort();
}

function equal(l: Value, r: Value): Value {
    const falseValue = boolValue(false);
    const trueValue = boolValue(true);
    if (l.type !== r.type) {
        return falseValue;
    }
    switch (l.type) {
        case Value_Type.NUM:
            return boolValue(l.num === r.num);
        case Value_Type.BOOL:
            return boolValue(l.bool === r.bool);
        case Value_Type.STR:
            return boolValue(l.str === r.str);
        case Value_Type.ARR:
            if (l.arr.length !== r.arr.length) {
                return falseValue;
            }
            for (let i = 0; i < l.arr.length; i++) {
                if (!equal(l.arr[i], r.arr[i]).bool) {
                    return falseValue;
                }
            }
            return trueValue;
        case Value_Type.OBJ:
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

function compare(path: Expr_Path, l: Value, r: Value): EvaluateOutput {
    const ltValue = create(EvaluateOutputSchema, {value: numValue(-1)});
    const gtValue = create(EvaluateOutputSchema, {value: numValue(1)});
    const eqValue = create(EvaluateOutputSchema, {value: numValue(0)});
    switch (l.type) {
        case Value_Type.NUM:
            if (r.type !== Value_Type.NUM) {
                return errorNotComparable(path);
            }
            return l.num < r.num ? ltValue : l.num > r.num ? gtValue : eqValue;
        case Value_Type.BOOL:
            if (r.type !== Value_Type.BOOL) {
                return errorNotComparable(path);
            }
            return !l.bool && r.bool ? ltValue : l.bool && !r.bool ? gtValue : eqValue;
        case Value_Type.STR:
            if (r.type !== Value_Type.STR) {
                return errorNotComparable(path);
            }
            return l.str < r.str ? ltValue : l.str > r.str ? gtValue : eqValue;
        case Value_Type.ARR:
            if (r.type !== Value_Type.ARR) {
                return errorNotComparable(path);
            }
            const minLength = Math.min(l.arr.length, r.arr.length);
            for (let i = 0; i < minLength; i++) {
                const cmp = compare(path, l.arr[i], r.arr[i]);
                if (cmp.status !== EvaluateOutput_Status.OK) {
                    return cmp;
                }
                if (cmp.value!.num !== 0) {
                    return cmp;
                }
            }
            return l.arr.length < r.arr.length ? ltValue : l.arr.length > r.arr.length ? gtValue : eqValue;
        default:
            return errorNotComparable(path);
    }
}
