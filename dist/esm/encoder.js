import { EncodeInput_Format, EncodeOutputSchema } from "./gen/pb/exprml/v1/encoder_pb.js";
import { create } from "@bufbuild/protobuf";
import { Value_Type } from "./gen/pb/exprml/v1/value_pb.js";
import YAML from "yaml";
export class Encoder {
    encode(input) {
        try {
            switch (input.format) {
                case EncodeInput_Format.YAML:
                    return create(EncodeOutputSchema, { text: YAML.stringify(convertFromJS(input.value)) });
                case EncodeInput_Format.JSON:
                    return create(EncodeOutputSchema, { text: JSON.stringify(convertFromJS(input.value)) });
                default:
                    return create(EncodeOutputSchema, {
                        isError: true,
                        errorMessage: `unsupported format: ${EncodeInput_Format[input.format]}`,
                    });
            }
        }
        catch (e) {
            return create(EncodeOutputSchema, {
                isError: true,
                errorMessage: e instanceof Error ? e.message : JSON.stringify(e),
            });
        }
    }
}
function convertFromJS(v) {
    switch (v.type) {
        case Value_Type.NULL:
            return null;
        case Value_Type.BOOL:
            return v.bool;
        case Value_Type.NUM:
            return v.num;
        case Value_Type.STR:
            return v.str;
        case Value_Type.OBJ:
            return Object.fromEntries(Object.entries(v.obj).map(([k, v]) => [k, convertFromJS(v)]));
        case Value_Type.ARR:
            return v.arr.map(convertFromJS);
        default:
            throw new Error("unexpected value type");
    }
}
