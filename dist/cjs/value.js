"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objValue = objValue;
exports.arrValue = arrValue;
exports.strValue = strValue;
exports.numValue = numValue;
exports.boolValue = boolValue;
const value_pb_js_1 = require("./gen/pb/exprml/v1/value_pb.js");
const protobuf_1 = require("@bufbuild/protobuf");
function objValue(obj) {
    return (0, protobuf_1.create)(value_pb_js_1.ValueSchema, { type: value_pb_js_1.Value_Type.OBJ, obj: obj });
}
function arrValue(arr) {
    return (0, protobuf_1.create)(value_pb_js_1.ValueSchema, { type: value_pb_js_1.Value_Type.ARR, arr: arr });
}
function strValue(str) {
    return (0, protobuf_1.create)(value_pb_js_1.ValueSchema, { type: value_pb_js_1.Value_Type.STR, str: str });
}
function numValue(num) {
    return (0, protobuf_1.create)(value_pb_js_1.ValueSchema, { type: value_pb_js_1.Value_Type.NUM, num: num });
}
function boolValue(b) {
    return (0, protobuf_1.create)(value_pb_js_1.ValueSchema, { type: value_pb_js_1.Value_Type.BOOL, bool: b });
}
