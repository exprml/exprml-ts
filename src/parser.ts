import {ParseInput, ParseOutput, ParseOutputSchema} from "./gen/pb/exprml/v1/parser_pb.js";
import {create} from "@bufbuild/protobuf";
import {Value, Value_Type, ValueSchema} from "./gen/pb/exprml/v1/value_pb.js";
import {
    ArrSchema, CallSchema,
    Cases_CaseSchema,
    CasesSchema,
    ElemSchema,
    Eval_Definition,
    Eval_DefinitionSchema,
    EvalSchema,
    Expr,
    Expr_Kind,
    Expr_Path,
    Expr_PathSchema,
    ExprSchema,
    IterSchema,
    JsonSchema,
    ObjSchema,
    OpBinary_Op,
    OpBinarySchema,
    OpUnary_Op,
    OpUnarySchema,
    OpVariadic_Op, OpVariadicSchema,
    RefSchema,
    ScalarSchema
} from "./gen/pb/exprml/v1/expr_pb.js";
import {append, format} from "./path.js";

export class Parser {
    parse(input: ParseInput): ParseOutput {
        try {
            return create(ParseOutputSchema, {expr: parseImpl(create(Expr_PathSchema), input.value!)});
        } catch (e) {
            return create(ParseOutputSchema, {
                isError: true,
                errorMessage: e instanceof Error ? e.message : JSON.stringify(e),
            });
        }
    }
}

function parseImpl(path: Expr_Path, value: Value): Expr {
    switch (value.type) {
        case Value_Type.STR:
            if (/^\$[_a-zA-Z][_a-zA-Z0-9]*$/.test(value.str)) {
                return create(ExprSchema, {
                    kind: Expr_Kind.REF,
                    path: path,
                    ref: create(RefSchema, {ident: value.str}),
                });
            }
            if (/^`.*`$/.test(value.str)) {
                return create(ExprSchema, {
                    kind: Expr_Kind.SCALAR,
                    path: path,
                    scalar: create(ScalarSchema, {
                        scalar: create(ValueSchema, {type: Value_Type.STR, str: value.str.slice(1, -1)})
                    }),
                });
            }
            throw new Error(`invalid Scalar: ${path}: string literal must be enclosed by \`'\``);
        case Value_Type.BOOL:
        case Value_Type.NUM:
            return create(ExprSchema, {
                kind: Expr_Kind.SCALAR,
                path: path,
                scalar: create(ScalarSchema, {scalar: value}),
            });
        case Value_Type.OBJ:
            if ("eval" in value.obj) {
                const eval_ = create(EvalSchema, {
                    eval: parseImpl(append(path, "eval"), value.obj["eval"]),
                });
                if ("where" in value.obj) {
                    const where = value.obj["where"];
                    if (where.type !== Value_Type.ARR) {
                        throw new Error(`invalid Expr: ${format(append(path, "where"))}: where clause must be an array`);
                    }
                    const defs: Eval_Definition[] = [];
                    for (let i = 0; i < where.arr.length; i++) {
                        const def = where.arr[i];
                        if (def.type !== Value_Type.OBJ) {
                            throw new Error(`invalid definition: ${format(append(path, "where", i))}: where clause must contain only objects but got ${def.type}`);
                        }
                        const keys = Object.keys(def.obj);
                        if (keys.length !== 1) {
                            throw new Error(`invalid definition: ${format(append(path, "where", i))}: definition must contain one property`);
                        }
                        const prop = keys[0];
                        const r = /^\$[_a-zA-Z][_a-zA-Z0-9]*(\(\s*\)|\(\s*\$[_a-zA-Z][_a-zA-Z0-9]*(\s*,\s*\$[_a-zA-Z][_a-zA-Z0-9]*)*(\s*,)?\s*\))?$/;
                        if (!r.test(prop)) {
                            throw new Error(`invalid definition: ${format(append(path, "where", i, prop))}: definition must match ${r}`);
                        }
                        const idents: string[] = /[^$_a-zA-Z0-9]/[Symbol.replace](prop, "")
                            .split("$")
                            .map((s) => "$" + s)
                        defs.push(create(Eval_DefinitionSchema, {
                            ident: idents[0],
                            args: idents.slice(1),
                            body: parseImpl(append(path, "where", i, prop), def.obj[prop]),
                        }));
                    }
                    eval_.where = defs;
                }
                return create(ExprSchema, {kind: Expr_Kind.EVAL, path: path, eval: eval_});
            }
            if ("obj" in value.obj) {
                const objVal = value.obj["obj"];
                if (objVal.type !== Value_Type.OBJ) {
                    throw new Error(`invalid Obj: ${format(append(path, "obj"))}: 'obj' property must be an object`);
                }
                const obj = Object.fromEntries(Object.entries(objVal.obj)
                    .map(([key, val]) =>
                        [key, parseImpl(append(path, "obj", key), val)]));
                return create(ExprSchema, {
                    kind: Expr_Kind.OBJ,
                    path: path,
                    obj: create(ObjSchema, {obj: obj}),
                });
            }
            if ("arr" in value.obj) {
                const arrVal = value.obj["arr"];
                if (arrVal.type !== Value_Type.ARR) {
                    throw new Error(`invalid Arr: ${format(append(path, "arr"))}: 'arr' property must be an array`);
                }
                const arr = arrVal.arr
                    .map((val, i) =>
                        parseImpl(append(path, "arr", i), val));
                return create(ExprSchema, {
                    kind: Expr_Kind.ARR,
                    path: path,
                    arr: create(ArrSchema, {arr: arr}),
                });
            }
            if ("json" in value.obj) {
                if (includesNull(value.obj["json"])) {
                    throw new Error(`invalid Json: ${format(append(path, "json"))}: 'json' property cannot contain null`);
                }
                return create(ExprSchema, {
                    kind: Expr_Kind.JSON,
                    path: path,
                    json: create(JsonSchema, {json: value.obj["json"]}),
                });
            }
            if ("do" in value.obj) {
                const r = /^for\(\s*\$[_a-zA-Z][_a-zA-Z0-9]*\s*,\s*\$[_a-zA-Z][_a-zA-Z0-9]*\s*\)$/;
                const iter = create(IterSchema, {});
                for (const prop of Object.keys(value.obj)) {
                    if (prop === "do") {
                        iter.do = parseImpl(append(path, "do"), value.obj["do"]);
                        continue;
                    }
                    if (prop === "if") {
                        iter.if = parseImpl(append(path, "if"), value.obj["if"]);
                        continue;
                    }
                    if (r.test(prop)) {
                        const idents: string[] = [];
                        for (const char of prop.slice(4, -1)) {
                            if (char === '$') {
                                idents.push(char);
                            } else if (/[a-zA-Z0-9_]/.test(char)) {
                                idents[idents.length - 1] += char;
                            }
                        }
                        iter.posIdent = idents[0];
                        iter.elemIdent = idents[1];
                        iter.col = parseImpl(append(path, prop), value.obj[prop]);
                        continue;
                    }
                    throw new Error(`invalid Iter: ${format(append(path, "do", prop))}: invalid property ${prop}`);
                }
                if (!iter.col) {
                    throw new Error(`invalid Iter: ${format(path)}: 'for(...vars...)' property is required`);
                }
                return create(ExprSchema, {kind: Expr_Kind.ITER, path: path, iter: iter});
            }
            if ("get" in value.obj) {
                if (!("from" in value.obj)) {
                    throw new Error(`invalid Elem: ${format(path)}: 'from' property is required`);
                }
                const elem = create(ElemSchema, {
                    get: parseImpl(append(path, "get"), value.obj["get"]),
                    from: parseImpl(append(path, "from"), value.obj["from"]),
                });
                return create(ExprSchema, {kind: Expr_Kind.ELEM, path: path, elem: elem});
            }
            if ("cases" in value.obj) {
                const casesVal = value.obj["cases"];
                if (casesVal.type !== Value_Type.ARR) {
                    throw new Error(`invalid Cases: ${format(append(path, "cases"))}: 'cases' property must be an array`);
                }
                const cases = [];
                for (let i = 0; i < casesVal.arr.length; i++) {
                    const c = casesVal.arr[i];
                    if (c.type !== Value_Type.OBJ) {
                        throw new Error(`invalid Case: ${format(append(path, "cases", i))}: 'cases' property must contain only objects but got ${c.type}`);
                    }
                    if ("otherwise" in c.obj) {
                        const otherwise = parseImpl(append(path, "cases", i, "otherwise"), c.obj["otherwise"]);
                        cases.push(create(Cases_CaseSchema, {isOtherwise: true, otherwise: otherwise,}));
                    } else {
                        if (!("when" in c.obj)) {
                            throw new Error(`invalid Case: ${format(append(path, "cases", i))}: 'when' property is required`);
                        }
                        const when = parseImpl(append(path, "cases", i, "when"), c.obj["when"]);
                        if (!("then" in c.obj)) {
                            throw new Error(`invalid Case: ${format(append(path, "cases", i))}: 'then' property is required`);
                        }
                        const then = parseImpl(append(path, "cases", i, "then"), c.obj["then"]);
                        cases.push(create(Cases_CaseSchema, {when: when, then: then}));
                    }
                }
                return create(ExprSchema, {
                    kind: Expr_Kind.CASES,
                    path: path,
                    cases: create(CasesSchema, {cases: cases}),
                });
            }
            if (Object.keys(value.obj).length !== 1) {
                throw new Error(`invalid Expr: ${format(path)}: operation or function call must contain only one property`);
            }
            const prop = Object.keys(value.obj)[0];
        {
            const opUnary = {
                "len": OpUnary_Op.LEN,
                "not": OpUnary_Op.NOT,
                "flat": OpUnary_Op.FLAT,
                "floor": OpUnary_Op.FLOOR,
                "ceil": OpUnary_Op.CEIL,
                "abort": OpUnary_Op.ABORT,
            }[prop];
            if (opUnary) {
                return create(ExprSchema, {
                    kind: Expr_Kind.OP_UNARY,
                    path: path,
                    opUnary: create(OpUnarySchema, {
                        op: opUnary,
                        operand: parseImpl(append(path, prop), value.obj[prop])
                    }),
                });
            }
        }
        {
            const opBinary = {
                "sub": OpBinary_Op.SUB,
                "div": OpBinary_Op.DIV,
                "eq": OpBinary_Op.EQ,
                "neq": OpBinary_Op.NEQ,
                "lt": OpBinary_Op.LT,
                "lte": OpBinary_Op.LTE,
                "gt": OpBinary_Op.GT,
                "gte": OpBinary_Op.GTE,
            }[prop];
            if (opBinary) {
                if (value.obj[prop].type !== Value_Type.ARR) {
                    throw new Error(`invalid OpBinary: ${format(append(path, prop))}: '${prop}' property must be an array`);
                }
                if (value.obj[prop].arr.length !== 2) {
                    throw new Error(`invalid OpBinary: ${format(append(path, prop))}: '${prop}' property must contain two elements`);
                }
                return create(ExprSchema, {
                    kind: Expr_Kind.OP_BINARY,
                    path: path,
                    opBinary: create(OpBinarySchema, {
                        op: opBinary,
                        left: parseImpl(append(path, prop, 0), value.obj[prop].arr[0]),
                        right: parseImpl(append(path, prop, 1), value.obj[prop].arr[1]),
                    }),
                });
            }
        }
        {
            const opVariadic = {
                "add": OpVariadic_Op.ADD,
                "mul": OpVariadic_Op.MUL,
                "and": OpVariadic_Op.AND,
                "or": OpVariadic_Op.OR,
                "cat": OpVariadic_Op.CAT,
                "min": OpVariadic_Op.MIN,
                "max": OpVariadic_Op.MAX,
                "merge": OpVariadic_Op.MERGE,
            }[prop];
            if (opVariadic) {
                if (value.obj[prop].type !== Value_Type.ARR) {
                    throw new Error(`invalid OpVariadic: ${format(append(path, prop))}: '${prop}' property must be an array`);
                }
                if ((prop === "min" || prop === "max") && value.obj[prop].arr.length === 0) {
                    throw new Error(`invalid OpVariadic: ${format(append(path, prop))}: '${prop}' property must contain at least one element`);
                }
                const arr = value.obj[prop].arr
                    .map((val, i) => parseImpl(append(path, prop, i), val));
                return create(ExprSchema, {
                    kind: Expr_Kind.OP_VARIADIC,
                    path: path,
                    opVariadic: create(OpVariadicSchema, {op: opVariadic, operands: arr}),
                });
            }
        }
        {
            const identRegexp = /^\$[_a-zA-Z][_a-zA-Z0-9]*$/;
            if (!identRegexp.test(prop)) {
                throw new Error(`invalid Call: ${format(path)}: function call property '${prop}' must match '${identRegexp}'`);
            }
            const argsVal = value.obj[prop];
            if (argsVal.type !== Value_Type.OBJ) {
                throw new Error(`invalid Call: ${format(append(path, prop))}: arguments must be given as an object`);
            }
            const args: Record<string, Expr> = {};
            for (const [key, val] of Object.entries(argsVal.obj)) {
                if (!identRegexp.test(key)) {
                    throw new Error(`invalid Call: ${format(append(path, prop, key))}: argument property '${key}' must match '${identRegexp}'`);
                }
                args[key] = parseImpl(append(path, prop, key), val);
            }
            return create(ExprSchema, {
                kind: Expr_Kind.CALL,
                path: path,
                call: create(CallSchema, {ident: prop, args: {}}),
            });
        }
        default:
            throw new Error("unexpected value type");
    }

}

function includesNull(value: Value): boolean {
    if (value.type === Value_Type.NULL) {
        return true;
    }
    for (const v of Object.values(value.obj)) {
        if (includesNull(v)) {
            return true;
        }
    }
    for (const v of value.arr) {
        if (includesNull(v)) {
            return true;
        }
    }
    return false;
}