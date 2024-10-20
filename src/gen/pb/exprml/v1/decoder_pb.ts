// @generated by protoc-gen-es v2.2.0 with parameter "target=ts,import_extension=js"
// @generated from file exprml/v1/decoder.proto (package exprml.v1, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc, serviceDesc } from "@bufbuild/protobuf/codegenv1";
import type { Value } from "./value_pb.js";
import { file_exprml_v1_value } from "./value_pb.js";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file exprml/v1/decoder.proto.
 */
export const file_exprml_v1_decoder: GenFile = /*@__PURE__*/
  fileDesc("ChdleHBybWwvdjEvZGVjb2Rlci5wcm90bxIJZXhwcm1sLnYxIhsKC0RlY29kZUlucHV0EgwKBHlhbWwYASABKAkiWAoMRGVjb2RlT3V0cHV0EhAKCGlzX2Vycm9yGAEgASgIEhUKDWVycm9yX21lc3NhZ2UYAiABKAkSHwoFdmFsdWUYAyABKAsyEC5leHBybWwudjEuVmFsdWUyRgoHRGVjb2RlchI7CgZEZWNvZGUSFi5leHBybWwudjEuRGVjb2RlSW5wdXQaFy5leHBybWwudjEuRGVjb2RlT3V0cHV0IgBCYgoNY29tLmV4cHJtbC52MUIMRGVjb2RlclByb3RvUAGiAgNFWFiqAglFeHBybWwuVjHKAglFeHBybWxcVjHiAhVFeHBybWxcVjFcR1BCTWV0YWRhdGHqAgpFeHBybWw6OlYxYgZwcm90bzM", [file_exprml_v1_value]);

/**
 * DecodeInput is the input message for the Decode method.
 *
 * @generated from message exprml.v1.DecodeInput
 */
export type DecodeInput = Message<"exprml.v1.DecodeInput"> & {
  /**
   * YAML string to decode.
   *
   * @generated from field: string yaml = 1;
   */
  yaml: string;
};

/**
 * Describes the message exprml.v1.DecodeInput.
 * Use `create(DecodeInputSchema)` to create a new message.
 */
export const DecodeInputSchema: GenMessage<DecodeInput> = /*@__PURE__*/
  messageDesc(file_exprml_v1_decoder, 0);

/**
 * DecodeOutput is the output message for the Decode method.
 *
 * @generated from message exprml.v1.DecodeOutput
 */
export type DecodeOutput = Message<"exprml.v1.DecodeOutput"> & {
  /**
   * Whether an error occurred during decoding.
   *
   * @generated from field: bool is_error = 1;
   */
  isError: boolean;

  /**
   * Error message if is_error is true.
   *
   * @generated from field: string error_message = 2;
   */
  errorMessage: string;

  /**
   * Decoded JSON value.
   *
   * @generated from field: exprml.v1.Value value = 3;
   */
  value?: Value;
};

/**
 * Describes the message exprml.v1.DecodeOutput.
 * Use `create(DecodeOutputSchema)` to create a new message.
 */
export const DecodeOutputSchema: GenMessage<DecodeOutput> = /*@__PURE__*/
  messageDesc(file_exprml_v1_decoder, 1);

/**
 * Decoder interface decodes a YAML string into a JSON value.
 *
 * @generated from service exprml.v1.Decoder
 */
export const Decoder: GenService<{
  /**
   * Decode decodes a YAML string into a JSON value.
   *
   * @generated from rpc exprml.v1.Decoder.Decode
   */
  decode: {
    methodKind: "unary";
    input: typeof DecodeInputSchema;
    output: typeof DecodeOutputSchema;
  },
}> = /*@__PURE__*/
  serviceDesc(file_exprml_v1_decoder, 0);

