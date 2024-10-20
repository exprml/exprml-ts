import { Value_Type, ValueSchema } from "./gen/pb/exprml/v1/value_pb.js";
import { create } from "@bufbuild/protobuf";
export function objValue(obj) {
    return create(ValueSchema, { type: Value_Type.OBJ, obj: obj });
}
export function arrValue(arr) {
    return create(ValueSchema, { type: Value_Type.ARR, arr: arr });
}
export function strValue(str) {
    return create(ValueSchema, { type: Value_Type.STR, str: str });
}
export function numValue(num) {
    return create(ValueSchema, { type: Value_Type.NUM, num: num });
}
export function boolValue(b) {
    return create(ValueSchema, { type: Value_Type.BOOL, bool: b });
}
