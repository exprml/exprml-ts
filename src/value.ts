import {Value, Value_Type, ValueSchema} from "./gen/pb/exprml/v1/value_pb.js";
import {create} from "@bufbuild/protobuf";

export function objValue(obj: Record<string, Value>): Value {
    return create(ValueSchema, {type: Value_Type.OBJ, obj: obj});
}

export function arrValue(arr: Value[]): Value {
    return create(ValueSchema, {type: Value_Type.ARR, arr: arr});
}

export function strValue(str: string): Value {
    return create(ValueSchema, {type: Value_Type.STR, str: str});
}

export function numValue(num: number): Value {
    return create(ValueSchema, {type: Value_Type.NUM, num: num});
}

export function boolValue(b: boolean): Value {
    return create(ValueSchema, {type: Value_Type.BOOL, bool: b});
}