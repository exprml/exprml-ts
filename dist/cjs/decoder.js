"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decoder = void 0;
const protobuf_1 = require("@bufbuild/protobuf");
const decoder_pb_js_1 = require("./gen/pb/exprml/v1/decoder_pb.js");
const yaml_1 = __importDefault(require("yaml"));
const value_pb_js_1 = require("./gen/pb/exprml/v1/value_pb.js");
class Decoder {
    decode(input) {
        try {
            return (0, protobuf_1.create)(decoder_pb_js_1.DecodeOutputSchema, {
                isError: false,
                value: convertFromJS(yaml_1.default.parse(input.yaml)),
            });
        }
        catch (e) {
            return (0, protobuf_1.create)(decoder_pb_js_1.DecodeOutputSchema, {
                isError: true,
                errorMessage: e instanceof Error ? e.message : JSON.stringify(e),
            });
        }
    }
}
exports.Decoder = Decoder;
function convertFromJS(v) {
    if (v == null) {
        return (0, protobuf_1.create)(value_pb_js_1.ValueSchema, { type: value_pb_js_1.Value_Type.NULL });
    }
    switch (typeof v) {
        case "boolean":
            return (0, protobuf_1.create)(value_pb_js_1.ValueSchema, { type: value_pb_js_1.Value_Type.BOOL, bool: v });
        case "number":
            return (0, protobuf_1.create)(value_pb_js_1.ValueSchema, { type: value_pb_js_1.Value_Type.NUM, num: v });
        case "string":
            return (0, protobuf_1.create)(value_pb_js_1.ValueSchema, { type: value_pb_js_1.Value_Type.STR, str: v });
        case "object":
            return (0, protobuf_1.create)(value_pb_js_1.ValueSchema, {
                type: value_pb_js_1.Value_Type.OBJ,
                obj: Object.fromEntries(Object.entries(v).map(([k, v]) => [k, convertFromJS(v)]))
            });
    }
    if (Array.isArray(v)) {
        return (0, protobuf_1.create)(value_pb_js_1.ValueSchema, { type: value_pb_js_1.Value_Type.ARR, arr: v.map(convertFromJS) });
    }
    throw new Error("unexpected value type");
}
