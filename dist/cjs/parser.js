"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const parser_pb_js_1 = require("./gen/pb/exprml/v1/parser_pb.js");
const protobuf_1 = require("@bufbuild/protobuf");
const value_pb_js_1 = require("./gen/pb/exprml/v1/value_pb.js");
const expr_pb_js_1 = require("./gen/pb/exprml/v1/expr_pb.js");
const path_js_1 = require("./path.js");
class Parser {
    parse(input) {
        try {
            return (0, protobuf_1.create)(parser_pb_js_1.ParseOutputSchema, { expr: parseImpl((0, protobuf_1.create)(expr_pb_js_1.Expr_PathSchema), input.value) });
        }
        catch (e) {
            return (0, protobuf_1.create)(parser_pb_js_1.ParseOutputSchema, {
                isError: true,
                errorMessage: e instanceof Error ? e.message : JSON.stringify(e),
            });
        }
    }
}
exports.Parser = Parser;
function parseImpl(path, value) {
    switch (value.type) {
        case value_pb_js_1.Value_Type.STR:
            if (/^\$[_a-zA-Z][_a-zA-Z0-9]*$/.test(value.str)) {
                return (0, protobuf_1.create)(expr_pb_js_1.ExprSchema, {
                    kind: expr_pb_js_1.Expr_Kind.REF,
                    path: path,
                    ref: (0, protobuf_1.create)(expr_pb_js_1.RefSchema, { ident: value.str }),
                });
            }
            if (/^`.*`$/.test(value.str)) {
                return (0, protobuf_1.create)(expr_pb_js_1.ExprSchema, {
                    kind: expr_pb_js_1.Expr_Kind.SCALAR,
                    path: path,
                    scalar: (0, protobuf_1.create)(expr_pb_js_1.ScalarSchema, {
                        scalar: (0, protobuf_1.create)(value_pb_js_1.ValueSchema, { type: value_pb_js_1.Value_Type.STR, str: value.str.slice(1, -1) })
                    }),
                });
            }
            throw new Error(`invalid Scalar: ${path}: string literal must be enclosed by \`'\``);
        case value_pb_js_1.Value_Type.BOOL:
        case value_pb_js_1.Value_Type.NUM:
            return (0, protobuf_1.create)(expr_pb_js_1.ExprSchema, {
                kind: expr_pb_js_1.Expr_Kind.SCALAR,
                path: path,
                scalar: (0, protobuf_1.create)(expr_pb_js_1.ScalarSchema, { scalar: value }),
            });
        case value_pb_js_1.Value_Type.OBJ:
            if ("eval" in value.obj) {
                const eval_ = (0, protobuf_1.create)(expr_pb_js_1.EvalSchema, {
                    eval: parseImpl((0, path_js_1.append)(path, "eval"), value.obj["eval"]),
                });
                if ("where" in value.obj) {
                    const where = value.obj["where"];
                    if (where.type !== value_pb_js_1.Value_Type.ARR) {
                        throw new Error(`invalid Expr: ${(0, path_js_1.format)((0, path_js_1.append)(path, "where"))}: where clause must be an array`);
                    }
                    const defs = [];
                    for (let i = 0; i < where.arr.length; i++) {
                        const def = where.arr[i];
                        if (def.type !== value_pb_js_1.Value_Type.OBJ) {
                            throw new Error(`invalid definition: ${(0, path_js_1.format)((0, path_js_1.append)(path, "where", i))}: where clause must contain only objects but got ${def.type}`);
                        }
                        const keys = Object.keys(def.obj);
                        if (keys.length !== 1) {
                            throw new Error(`invalid definition: ${(0, path_js_1.format)((0, path_js_1.append)(path, "where", i))}: definition must contain one property`);
                        }
                        const prop = keys[0];
                        const r = /^\$[_a-zA-Z][_a-zA-Z0-9]*(\(\s*\)|\(\s*\$[_a-zA-Z][_a-zA-Z0-9]*(\s*,\s*\$[_a-zA-Z][_a-zA-Z0-9]*)*(\s*,)?\s*\))?$/;
                        if (!r.test(prop)) {
                            throw new Error(`invalid definition: ${(0, path_js_1.format)((0, path_js_1.append)(path, "where", i, prop))}: definition must match ${r}`);
                        }
                        const idents = /[^$_a-zA-Z0-9]/[Symbol.replace](prop, "")
                            .split("$")
                            .map((s) => "$" + s);
                        defs.push((0, protobuf_1.create)(expr_pb_js_1.Eval_DefinitionSchema, {
                            ident: idents[0],
                            args: idents.slice(1),
                            body: parseImpl((0, path_js_1.append)(path, "where", i, prop), def.obj[prop]),
                        }));
                    }
                    eval_.where = defs;
                }
                return (0, protobuf_1.create)(expr_pb_js_1.ExprSchema, { kind: expr_pb_js_1.Expr_Kind.EVAL, path: path, eval: eval_ });
            }
            if ("obj" in value.obj) {
                const objVal = value.obj["obj"];
                if (objVal.type !== value_pb_js_1.Value_Type.OBJ) {
                    throw new Error(`invalid Obj: ${(0, path_js_1.format)((0, path_js_1.append)(path, "obj"))}: 'obj' property must be an object`);
                }
                const obj = Object.fromEntries(Object.entries(objVal.obj)
                    .map(([key, val]) => [key, parseImpl((0, path_js_1.append)(path, "obj", key), val)]));
                return (0, protobuf_1.create)(expr_pb_js_1.ExprSchema, {
                    kind: expr_pb_js_1.Expr_Kind.OBJ,
                    path: path,
                    obj: (0, protobuf_1.create)(expr_pb_js_1.ObjSchema, { obj: obj }),
                });
            }
            if ("arr" in value.obj) {
                const arrVal = value.obj["arr"];
                if (arrVal.type !== value_pb_js_1.Value_Type.ARR) {
                    throw new Error(`invalid Arr: ${(0, path_js_1.format)((0, path_js_1.append)(path, "arr"))}: 'arr' property must be an array`);
                }
                const arr = arrVal.arr
                    .map((val, i) => parseImpl((0, path_js_1.append)(path, "arr", i), val));
                return (0, protobuf_1.create)(expr_pb_js_1.ExprSchema, {
                    kind: expr_pb_js_1.Expr_Kind.ARR,
                    path: path,
                    arr: (0, protobuf_1.create)(expr_pb_js_1.ArrSchema, { arr: arr }),
                });
            }
            if ("json" in value.obj) {
                if (includesNull(value.obj["json"])) {
                    throw new Error(`invalid Json: ${(0, path_js_1.format)((0, path_js_1.append)(path, "json"))}: 'json' property cannot contain null`);
                }
                return (0, protobuf_1.create)(expr_pb_js_1.ExprSchema, {
                    kind: expr_pb_js_1.Expr_Kind.JSON,
                    path: path,
                    json: (0, protobuf_1.create)(expr_pb_js_1.JsonSchema, { json: value.obj["json"] }),
                });
            }
            if ("do" in value.obj) {
                const r = /^for\(\s*\$[_a-zA-Z][_a-zA-Z0-9]*\s*,\s*\$[_a-zA-Z][_a-zA-Z0-9]*\s*\)$/;
                const iter = (0, protobuf_1.create)(expr_pb_js_1.IterSchema, {});
                for (const prop of Object.keys(value.obj)) {
                    if (prop === "do") {
                        iter.do = parseImpl((0, path_js_1.append)(path, "do"), value.obj["do"]);
                        continue;
                    }
                    if (prop === "if") {
                        iter.if = parseImpl((0, path_js_1.append)(path, "if"), value.obj["if"]);
                        continue;
                    }
                    if (r.test(prop)) {
                        const idents = [];
                        for (const char of prop.slice(4, -1)) {
                            if (char === '$') {
                                idents.push(char);
                            }
                            else if (/[a-zA-Z0-9_]/.test(char)) {
                                idents[idents.length - 1] += char;
                            }
                        }
                        iter.posIdent = idents[0];
                        iter.elemIdent = idents[1];
                        iter.col = parseImpl((0, path_js_1.append)(path, prop), value.obj[prop]);
                        continue;
                    }
                    throw new Error(`invalid Iter: ${(0, path_js_1.format)((0, path_js_1.append)(path, "do", prop))}: invalid property ${prop}`);
                }
                if (!iter.col) {
                    throw new Error(`invalid Iter: ${(0, path_js_1.format)(path)}: 'for(...vars...)' property is required`);
                }
                return (0, protobuf_1.create)(expr_pb_js_1.ExprSchema, { kind: expr_pb_js_1.Expr_Kind.ITER, path: path, iter: iter });
            }
            if ("get" in value.obj) {
                if (!("from" in value.obj)) {
                    throw new Error(`invalid Elem: ${(0, path_js_1.format)(path)}: 'from' property is required`);
                }
                const elem = (0, protobuf_1.create)(expr_pb_js_1.ElemSchema, {
                    get: parseImpl((0, path_js_1.append)(path, "get"), value.obj["get"]),
                    from: parseImpl((0, path_js_1.append)(path, "from"), value.obj["from"]),
                });
                return (0, protobuf_1.create)(expr_pb_js_1.ExprSchema, { kind: expr_pb_js_1.Expr_Kind.ELEM, path: path, elem: elem });
            }
            if ("cases" in value.obj) {
                const casesVal = value.obj["cases"];
                if (casesVal.type !== value_pb_js_1.Value_Type.ARR) {
                    throw new Error(`invalid Cases: ${(0, path_js_1.format)((0, path_js_1.append)(path, "cases"))}: 'cases' property must be an array`);
                }
                const cases = [];
                for (let i = 0; i < casesVal.arr.length; i++) {
                    const c = casesVal.arr[i];
                    if (c.type !== value_pb_js_1.Value_Type.OBJ) {
                        throw new Error(`invalid Case: ${(0, path_js_1.format)((0, path_js_1.append)(path, "cases", i))}: 'cases' property must contain only objects but got ${c.type}`);
                    }
                    if ("otherwise" in c.obj) {
                        const otherwise = parseImpl((0, path_js_1.append)(path, "cases", i, "otherwise"), c.obj["otherwise"]);
                        cases.push((0, protobuf_1.create)(expr_pb_js_1.Cases_CaseSchema, { isOtherwise: true, otherwise: otherwise, }));
                    }
                    else {
                        if (!("when" in c.obj)) {
                            throw new Error(`invalid Case: ${(0, path_js_1.format)((0, path_js_1.append)(path, "cases", i))}: 'when' property is required`);
                        }
                        const when = parseImpl((0, path_js_1.append)(path, "cases", i, "when"), c.obj["when"]);
                        if (!("then" in c.obj)) {
                            throw new Error(`invalid Case: ${(0, path_js_1.format)((0, path_js_1.append)(path, "cases", i))}: 'then' property is required`);
                        }
                        const then = parseImpl((0, path_js_1.append)(path, "cases", i, "then"), c.obj["then"]);
                        cases.push((0, protobuf_1.create)(expr_pb_js_1.Cases_CaseSchema, { when: when, then: then }));
                    }
                }
                return (0, protobuf_1.create)(expr_pb_js_1.ExprSchema, {
                    kind: expr_pb_js_1.Expr_Kind.CASES,
                    path: path,
                    cases: (0, protobuf_1.create)(expr_pb_js_1.CasesSchema, { cases: cases }),
                });
            }
            if (Object.keys(value.obj).length !== 1) {
                throw new Error(`invalid Expr: ${(0, path_js_1.format)(path)}: operation or function call must contain only one property`);
            }
            const prop = Object.keys(value.obj)[0];
            {
                const opUnary = {
                    "len": expr_pb_js_1.OpUnary_Op.LEN,
                    "not": expr_pb_js_1.OpUnary_Op.NOT,
                    "flat": expr_pb_js_1.OpUnary_Op.FLAT,
                    "floor": expr_pb_js_1.OpUnary_Op.FLOOR,
                    "ceil": expr_pb_js_1.OpUnary_Op.CEIL,
                    "abort": expr_pb_js_1.OpUnary_Op.ABORT,
                }[prop];
                if (opUnary) {
                    return (0, protobuf_1.create)(expr_pb_js_1.ExprSchema, {
                        kind: expr_pb_js_1.Expr_Kind.OP_UNARY,
                        path: path,
                        opUnary: (0, protobuf_1.create)(expr_pb_js_1.OpUnarySchema, {
                            op: opUnary,
                            operand: parseImpl((0, path_js_1.append)(path, prop), value.obj[prop])
                        }),
                    });
                }
            }
            {
                const opBinary = {
                    "sub": expr_pb_js_1.OpBinary_Op.SUB,
                    "div": expr_pb_js_1.OpBinary_Op.DIV,
                    "eq": expr_pb_js_1.OpBinary_Op.EQ,
                    "neq": expr_pb_js_1.OpBinary_Op.NEQ,
                    "lt": expr_pb_js_1.OpBinary_Op.LT,
                    "lte": expr_pb_js_1.OpBinary_Op.LTE,
                    "gt": expr_pb_js_1.OpBinary_Op.GT,
                    "gte": expr_pb_js_1.OpBinary_Op.GTE,
                }[prop];
                if (opBinary) {
                    if (value.obj[prop].type !== value_pb_js_1.Value_Type.ARR) {
                        throw new Error(`invalid OpBinary: ${(0, path_js_1.format)((0, path_js_1.append)(path, prop))}: '${prop}' property must be an array`);
                    }
                    if (value.obj[prop].arr.length !== 2) {
                        throw new Error(`invalid OpBinary: ${(0, path_js_1.format)((0, path_js_1.append)(path, prop))}: '${prop}' property must contain two elements`);
                    }
                    return (0, protobuf_1.create)(expr_pb_js_1.ExprSchema, {
                        kind: expr_pb_js_1.Expr_Kind.OP_BINARY,
                        path: path,
                        opBinary: (0, protobuf_1.create)(expr_pb_js_1.OpBinarySchema, {
                            op: opBinary,
                            left: parseImpl((0, path_js_1.append)(path, prop, 0), value.obj[prop].arr[0]),
                            right: parseImpl((0, path_js_1.append)(path, prop, 1), value.obj[prop].arr[1]),
                        }),
                    });
                }
            }
            {
                const opVariadic = {
                    "add": expr_pb_js_1.OpVariadic_Op.ADD,
                    "mul": expr_pb_js_1.OpVariadic_Op.MUL,
                    "and": expr_pb_js_1.OpVariadic_Op.AND,
                    "or": expr_pb_js_1.OpVariadic_Op.OR,
                    "cat": expr_pb_js_1.OpVariadic_Op.CAT,
                    "min": expr_pb_js_1.OpVariadic_Op.MIN,
                    "max": expr_pb_js_1.OpVariadic_Op.MAX,
                    "merge": expr_pb_js_1.OpVariadic_Op.MERGE,
                }[prop];
                if (opVariadic) {
                    if (value.obj[prop].type !== value_pb_js_1.Value_Type.ARR) {
                        throw new Error(`invalid OpVariadic: ${(0, path_js_1.format)((0, path_js_1.append)(path, prop))}: '${prop}' property must be an array`);
                    }
                    if ((prop === "min" || prop === "max") && value.obj[prop].arr.length === 0) {
                        throw new Error(`invalid OpVariadic: ${(0, path_js_1.format)((0, path_js_1.append)(path, prop))}: '${prop}' property must contain at least one element`);
                    }
                    const arr = value.obj[prop].arr
                        .map((val, i) => parseImpl((0, path_js_1.append)(path, prop, i), val));
                    return (0, protobuf_1.create)(expr_pb_js_1.ExprSchema, {
                        kind: expr_pb_js_1.Expr_Kind.OP_VARIADIC,
                        path: path,
                        opVariadic: (0, protobuf_1.create)(expr_pb_js_1.OpVariadicSchema, { op: opVariadic, operands: arr }),
                    });
                }
            }
            {
                const identRegexp = /^\$[_a-zA-Z][_a-zA-Z0-9]*$/;
                if (!identRegexp.test(prop)) {
                    throw new Error(`invalid Call: ${(0, path_js_1.format)(path)}: function call property '${prop}' must match '${identRegexp}'`);
                }
                const argsVal = value.obj[prop];
                if (argsVal.type !== value_pb_js_1.Value_Type.OBJ) {
                    throw new Error(`invalid Call: ${(0, path_js_1.format)((0, path_js_1.append)(path, prop))}: arguments must be given as an object`);
                }
                const args = {};
                for (const [key, val] of Object.entries(argsVal.obj)) {
                    if (!identRegexp.test(key)) {
                        throw new Error(`invalid Call: ${(0, path_js_1.format)((0, path_js_1.append)(path, prop, key))}: argument property '${key}' must match '${identRegexp}'`);
                    }
                    args[key] = parseImpl((0, path_js_1.append)(path, prop, key), val);
                }
                return (0, protobuf_1.create)(expr_pb_js_1.ExprSchema, {
                    kind: expr_pb_js_1.Expr_Kind.CALL,
                    path: path,
                    call: (0, protobuf_1.create)(expr_pb_js_1.CallSchema, { ident: prop, args: {} }),
                });
            }
        default:
            throw new Error("unexpected value type");
    }
}
function includesNull(value) {
    if (value.type === value_pb_js_1.Value_Type.NULL) {
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
