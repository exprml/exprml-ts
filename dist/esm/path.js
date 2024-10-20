import { Expr_Path_PosSchema, Expr_PathSchema } from "./gen/pb/exprml/v1/expr_pb.js";
import { create } from "@bufbuild/protobuf";
export function append(path, ...pos) {
    const posList = [...pos].map((p) => typeof p === "string"
        ? create(Expr_Path_PosSchema, { key: p })
        : create(Expr_Path_PosSchema, { index: BigInt(p) }));
    return create(Expr_PathSchema, { pos: [...path.pos, ...posList] });
}
export function format(path) {
    if (path.pos.length === 0) {
        return "/";
    }
    return [...path.pos]
        .map((p) => p.key === "" ? `/${p.key}` : `/${p.index}`)
        .join("");
}
