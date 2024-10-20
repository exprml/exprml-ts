// @generated by protoc-gen-es v2.2.0 with parameter "target=ts,import_extension=js"
// @generated from file exprml/v1/value.proto (package exprml.v1, syntax proto3)
/* eslint-disable */
import { enumDesc, fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
/**
 * Describes the file exprml/v1/value.proto.
 */
export const file_exprml_v1_value = /*@__PURE__*/ fileDesc("ChVleHBybWwvdjEvdmFsdWUucHJvdG8SCWV4cHJtbC52MSKqAgoFVmFsdWUSIwoEdHlwZRgBIAEoDjIVLmV4cHJtbC52MS5WYWx1ZS5UeXBlEgwKBGJvb2wYAiABKAgSCwoDbnVtGAMgASgBEgsKA3N0chgEIAEoCRIdCgNhcnIYBSADKAsyEC5leHBybWwudjEuVmFsdWUSJgoDb2JqGAYgAygLMhkuZXhwcm1sLnYxLlZhbHVlLk9iakVudHJ5GjwKCE9iakVudHJ5EgsKA2tleRgBIAEoCRIfCgV2YWx1ZRgCIAEoCzIQLmV4cHJtbC52MS5WYWx1ZToCOAEiTwoEVHlwZRIPCgtVTlNQRUNJRklFRBAAEggKBE5VTEwQARIICgRCT09MEAISBwoDTlVNEAMSBwoDU1RSEAQSBwoDQVJSEAUSBwoDT0JKEAZCYAoNY29tLmV4cHJtbC52MUIKVmFsdWVQcm90b1ABogIDRVhYqgIJRXhwcm1sLlYxygIJRXhwcm1sXFYx4gIVRXhwcm1sXFYxXEdQQk1ldGFkYXRh6gIKRXhwcm1sOjpWMWIGcHJvdG8z");
/**
 * Describes the message exprml.v1.Value.
 * Use `create(ValueSchema)` to create a new message.
 */
export const ValueSchema = /*@__PURE__*/ messageDesc(file_exprml_v1_value, 0);
/**
 * Type of a JSON value.
 *
 * @generated from enum exprml.v1.Value.Type
 */
export var Value_Type;
(function (Value_Type) {
    /**
     * Unspecified.
     *
     * @generated from enum value: UNSPECIFIED = 0;
     */
    Value_Type[Value_Type["UNSPECIFIED"] = 0] = "UNSPECIFIED";
    /**
     * Null type.
     *
     * @generated from enum value: NULL = 1;
     */
    Value_Type[Value_Type["NULL"] = 1] = "NULL";
    /**
     * Boolean type.
     *
     * @generated from enum value: BOOL = 2;
     */
    Value_Type[Value_Type["BOOL"] = 2] = "BOOL";
    /**
     * Number type.
     *
     * @generated from enum value: NUM = 3;
     */
    Value_Type[Value_Type["NUM"] = 3] = "NUM";
    /**
     * String type.
     *
     * @generated from enum value: STR = 4;
     */
    Value_Type[Value_Type["STR"] = 4] = "STR";
    /**
     * Array type.
     *
     * @generated from enum value: ARR = 5;
     */
    Value_Type[Value_Type["ARR"] = 5] = "ARR";
    /**
     * Object type.
     *
     * @generated from enum value: OBJ = 6;
     */
    Value_Type[Value_Type["OBJ"] = 6] = "OBJ";
})(Value_Type || (Value_Type = {}));
/**
 * Describes the enum exprml.v1.Value.Type.
 */
export const Value_TypeSchema = /*@__PURE__*/ enumDesc(file_exprml_v1_value, 0, 0);
