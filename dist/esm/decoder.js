import { create } from "@bufbuild/protobuf";
import { DecodeOutputSchema } from "./gen/pb/exprml/v1/decoder_pb.js";
import YAML from 'yaml';
import { Value_Type, ValueSchema } from "./gen/pb/exprml/v1/value_pb.js";
export class Decoder {
    decode(input) {
        try {
            return create(DecodeOutputSchema, {
                isError: false,
                value: convertFromJS(YAML.parse(input.yaml)),
            });
        }
        catch (e) {
            return create(DecodeOutputSchema, {
                isError: true,
                errorMessage: e instanceof Error ? e.message : JSON.stringify(e),
            });
        }
    }
}
function convertFromJS(v) {
    if (v == null) {
        return create(ValueSchema, { type: Value_Type.NULL });
    }
    if (Array.isArray(v)) {
        return create(ValueSchema, { type: Value_Type.ARR, arr: v.map(convertFromJS) });
    }
    switch (typeof v) {
        case "boolean":
            return create(ValueSchema, { type: Value_Type.BOOL, bool: v });
        case "number":
            return create(ValueSchema, { type: Value_Type.NUM, num: v });
        case "string":
            return create(ValueSchema, { type: Value_Type.STR, str: v });
        case "object":
            return create(ValueSchema, {
                type: Value_Type.OBJ,
                obj: Object.fromEntries(Object.entries(v).map(([k, v]) => [k, convertFromJS(v)]))
            });
    }
    throw new Error("unexpected value type");
}
