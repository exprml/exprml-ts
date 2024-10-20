"use strict";
// @generated by protoc-gen-es v2.2.0 with parameter "target=ts,import_extension=js"
// @generated from file exprml/v1/decoder.proto (package exprml.v1, syntax proto3)
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decoder = exports.DecodeOutputSchema = exports.DecodeInputSchema = exports.file_exprml_v1_decoder = void 0;
const codegenv1_1 = require("@bufbuild/protobuf/codegenv1");
const value_pb_js_1 = require("./value_pb.js");
/**
 * Describes the file exprml/v1/decoder.proto.
 */
exports.file_exprml_v1_decoder = (0, codegenv1_1.fileDesc)("ChdleHBybWwvdjEvZGVjb2Rlci5wcm90bxIJZXhwcm1sLnYxIhsKC0RlY29kZUlucHV0EgwKBHlhbWwYASABKAkiWAoMRGVjb2RlT3V0cHV0EhAKCGlzX2Vycm9yGAEgASgIEhUKDWVycm9yX21lc3NhZ2UYAiABKAkSHwoFdmFsdWUYAyABKAsyEC5leHBybWwudjEuVmFsdWUyRgoHRGVjb2RlchI7CgZEZWNvZGUSFi5leHBybWwudjEuRGVjb2RlSW5wdXQaFy5leHBybWwudjEuRGVjb2RlT3V0cHV0IgBCYgoNY29tLmV4cHJtbC52MUIMRGVjb2RlclByb3RvUAGiAgNFWFiqAglFeHBybWwuVjHKAglFeHBybWxcVjHiAhVFeHBybWxcVjFcR1BCTWV0YWRhdGHqAgpFeHBybWw6OlYxYgZwcm90bzM", [value_pb_js_1.file_exprml_v1_value]);
/**
 * Describes the message exprml.v1.DecodeInput.
 * Use `create(DecodeInputSchema)` to create a new message.
 */
exports.DecodeInputSchema = (0, codegenv1_1.messageDesc)(exports.file_exprml_v1_decoder, 0);
/**
 * Describes the message exprml.v1.DecodeOutput.
 * Use `create(DecodeOutputSchema)` to create a new message.
 */
exports.DecodeOutputSchema = (0, codegenv1_1.messageDesc)(exports.file_exprml_v1_decoder, 1);
/**
 * Decoder interface decodes a YAML string into a JSON value.
 *
 * @generated from service exprml.v1.Decoder
 */
exports.Decoder = (0, codegenv1_1.serviceDesc)(exports.file_exprml_v1_decoder, 0);