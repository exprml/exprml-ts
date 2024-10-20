// @generated by protoc-gen-es v2.2.0 with parameter "target=ts,import_extension=js"
// @generated from file exprml/v1/value.proto (package exprml.v1, syntax proto3)
/* eslint-disable */

import type { GenEnum, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { enumDesc, fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file exprml/v1/value.proto.
 */
export const file_exprml_v1_value: GenFile = /*@__PURE__*/
  fileDesc("ChVleHBybWwvdjEvdmFsdWUucHJvdG8SCWV4cHJtbC52MSKqAgoFVmFsdWUSIwoEdHlwZRgBIAEoDjIVLmV4cHJtbC52MS5WYWx1ZS5UeXBlEgwKBGJvb2wYAiABKAgSCwoDbnVtGAMgASgBEgsKA3N0chgEIAEoCRIdCgNhcnIYBSADKAsyEC5leHBybWwudjEuVmFsdWUSJgoDb2JqGAYgAygLMhkuZXhwcm1sLnYxLlZhbHVlLk9iakVudHJ5GjwKCE9iakVudHJ5EgsKA2tleRgBIAEoCRIfCgV2YWx1ZRgCIAEoCzIQLmV4cHJtbC52MS5WYWx1ZToCOAEiTwoEVHlwZRIPCgtVTlNQRUNJRklFRBAAEggKBE5VTEwQARIICgRCT09MEAISBwoDTlVNEAMSBwoDU1RSEAQSBwoDQVJSEAUSBwoDT0JKEAZCYAoNY29tLmV4cHJtbC52MUIKVmFsdWVQcm90b1ABogIDRVhYqgIJRXhwcm1sLlYxygIJRXhwcm1sXFYx4gIVRXhwcm1sXFYxXEdQQk1ldGFkYXRh6gIKRXhwcm1sOjpWMWIGcHJvdG8z");

/**
 * JSON value.
 *
 * @generated from message exprml.v1.Value
 */
export type Value = Message<"exprml.v1.Value"> & {
  /**
   * Type of the value.
   *
   * @generated from field: exprml.v1.Value.Type type = 1;
   */
  type: Value_Type;

  /**
   * bool has a boolean value if the type is TYPE_BOOL.
   *
   * @generated from field: bool bool = 2;
   */
  bool: boolean;

  /**
   * num has a number value if the type is TYPE_NUM.
   *
   * @generated from field: double num = 3;
   */
  num: number;

  /**
   * str has a string value if the type is TYPE_STR.
   *
   * @generated from field: string str = 4;
   */
  str: string;

  /**
   * arr has an array value if the type is TYPE_ARR.
   *
   * @generated from field: repeated exprml.v1.Value arr = 5;
   */
  arr: Value[];

  /**
   * obj has an object value if the type is TYPE_OBJ.
   *
   * @generated from field: map<string, exprml.v1.Value> obj = 6;
   */
  obj: { [key: string]: Value };
};

/**
 * Describes the message exprml.v1.Value.
 * Use `create(ValueSchema)` to create a new message.
 */
export const ValueSchema: GenMessage<Value> = /*@__PURE__*/
  messageDesc(file_exprml_v1_value, 0);

/**
 * Type of a JSON value.
 *
 * @generated from enum exprml.v1.Value.Type
 */
export enum Value_Type {
  /**
   * Unspecified.
   *
   * @generated from enum value: UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * Null type.
   *
   * @generated from enum value: NULL = 1;
   */
  NULL = 1,

  /**
   * Boolean type.
   *
   * @generated from enum value: BOOL = 2;
   */
  BOOL = 2,

  /**
   * Number type.
   *
   * @generated from enum value: NUM = 3;
   */
  NUM = 3,

  /**
   * String type.
   *
   * @generated from enum value: STR = 4;
   */
  STR = 4,

  /**
   * Array type.
   *
   * @generated from enum value: ARR = 5;
   */
  ARR = 5,

  /**
   * Object type.
   *
   * @generated from enum value: OBJ = 6;
   */
  OBJ = 6,
}

/**
 * Describes the enum exprml.v1.Value.Type.
 */
export const Value_TypeSchema: GenEnum<Value_Type> = /*@__PURE__*/
  enumDesc(file_exprml_v1_value, 0, 0);

