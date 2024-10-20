"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.append = append;
exports.format = format;
const expr_pb_js_1 = require("./gen/pb/exprml/v1/expr_pb.js");
const protobuf_1 = require("@bufbuild/protobuf");
function append(path, ...pos) {
    const posList = [...pos].map((p) => typeof p === "string"
        ? (0, protobuf_1.create)(expr_pb_js_1.Expr_Path_PosSchema, { key: p })
        : (0, protobuf_1.create)(expr_pb_js_1.Expr_Path_PosSchema, { index: BigInt(p) }));
    return (0, protobuf_1.create)(expr_pb_js_1.Expr_PathSchema, { pos: [...path.pos, ...posList] });
}
function format(path) {
    if (path.pos.length === 0) {
        return "/";
    }
    return [...path.pos]
        .map((p) => p.key !== "" ? `/${p.key}` : `/${p.index}`)
        .join("");
}
