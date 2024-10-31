"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encoder = void 0;
const encoder_pb_js_1 = require("./gen/pb/exprml/v1/encoder_pb.js");
const protobuf_1 = require("@bufbuild/protobuf");
const value_pb_js_1 = require("./gen/pb/exprml/v1/value_pb.js");
const yaml_1 = __importDefault(require("yaml"));
class Encoder {
    encode(input) {
        try {
            switch (input.format) {
                case encoder_pb_js_1.EncodeInput_Format.YAML:
                    return (0, protobuf_1.create)(encoder_pb_js_1.EncodeOutputSchema, { text: yaml_1.default.stringify(convertFromJS(input.value)) });
                case encoder_pb_js_1.EncodeInput_Format.JSON:
                    return (0, protobuf_1.create)(encoder_pb_js_1.EncodeOutputSchema, { text: JSON.stringify(convertFromJS(input.value)) });
                default:
                    return (0, protobuf_1.create)(encoder_pb_js_1.EncodeOutputSchema, {
                        isError: true,
                        errorMessage: `unsupported format: ${encoder_pb_js_1.EncodeInput_Format[input.format]}`,
                    });
            }
        }
        catch (e) {
            return (0, protobuf_1.create)(encoder_pb_js_1.EncodeOutputSchema, {
                isError: true,
                errorMessage: e instanceof Error ? e.message : JSON.stringify(e),
            });
        }
    }
}
exports.Encoder = Encoder;
function convertFromJS(v) {
    switch (v.type) {
        case value_pb_js_1.Value_Type.NULL:
            return null;
        case value_pb_js_1.Value_Type.BOOL:
            return v.bool;
        case value_pb_js_1.Value_Type.NUM:
            return v.num;
        case value_pb_js_1.Value_Type.STR:
            return v.str;
        case value_pb_js_1.Value_Type.OBJ:
            return Object.fromEntries(Object.entries(v.obj).map(([k, v]) => [k, convertFromJS(v)]));
        case value_pb_js_1.Value_Type.ARR:
            return v.arr.map(convertFromJS);
        default:
            throw new Error("unexpected value type");
    }
}
