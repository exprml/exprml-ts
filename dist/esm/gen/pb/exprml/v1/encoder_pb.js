// @generated by protoc-gen-es v2.2.0 with parameter "target=ts,import_extension=js"
// @generated from file exprml/v1/encoder.proto (package exprml.v1, syntax proto3)
/* eslint-disable */
import { enumDesc, fileDesc, messageDesc, serviceDesc } from "@bufbuild/protobuf/codegenv1";
import { file_exprml_v1_value } from "./value_pb.js";
/**
 * Describes the file exprml/v1/encoder.proto.
 */
export const file_exprml_v1_encoder = /*@__PURE__*/ fileDesc("ChdleHBybWwvdjEvZW5jb2Rlci5wcm90bxIJZXhwcm1sLnYxInsKC0VuY29kZUlucHV0Ei0KBmZvcm1hdBgBIAEoDjIdLmV4cHJtbC52MS5FbmNvZGVJbnB1dC5Gb3JtYXQSHwoFdmFsdWUYAyABKAsyEC5leHBybWwudjEuVmFsdWUiHAoGRm9ybWF0EggKBFlBTUwQABIICgRKU09OEAEiRwoMRW5jb2RlT3V0cHV0EhAKCGlzX2Vycm9yGAEgASgIEhUKDWVycm9yX21lc3NhZ2UYAiABKAkSDgoGcmVzdWx0GAMgASgJMkYKB0VuY29kZXISOwoGRW5jb2RlEhYuZXhwcm1sLnYxLkVuY29kZUlucHV0GhcuZXhwcm1sLnYxLkVuY29kZU91dHB1dCIAQmIKDWNvbS5leHBybWwudjFCDEVuY29kZXJQcm90b1ABogIDRVhYqgIJRXhwcm1sLlYxygIJRXhwcm1sXFYx4gIVRXhwcm1sXFYxXEdQQk1ldGFkYXRh6gIKRXhwcm1sOjpWMWIGcHJvdG8z", [file_exprml_v1_value]);
/**
 * Describes the message exprml.v1.EncodeInput.
 * Use `create(EncodeInputSchema)` to create a new message.
 */
export const EncodeInputSchema = /*@__PURE__*/ messageDesc(file_exprml_v1_encoder, 0);
/**
 * Format of the output string.
 *
 * @generated from enum exprml.v1.EncodeInput.Format
 */
export var EncodeInput_Format;
(function (EncodeInput_Format) {
    /**
     * YAML format.
     *
     * @generated from enum value: YAML = 0;
     */
    EncodeInput_Format[EncodeInput_Format["YAML"] = 0] = "YAML";
    /**
     * JSON format.
     *
     * @generated from enum value: JSON = 1;
     */
    EncodeInput_Format[EncodeInput_Format["JSON"] = 1] = "JSON";
})(EncodeInput_Format || (EncodeInput_Format = {}));
/**
 * Describes the enum exprml.v1.EncodeInput.Format.
 */
export const EncodeInput_FormatSchema = /*@__PURE__*/ enumDesc(file_exprml_v1_encoder, 0, 0);
/**
 * Describes the message exprml.v1.EncodeOutput.
 * Use `create(EncodeOutputSchema)` to create a new message.
 */
export const EncodeOutputSchema = /*@__PURE__*/ messageDesc(file_exprml_v1_encoder, 1);
/**
 * Encoder interface encodes a JSON value into a YAML or JSON string.
 *
 * @generated from service exprml.v1.Encoder
 */
export const Encoder = /*@__PURE__*/ serviceDesc(file_exprml_v1_encoder, 0);
