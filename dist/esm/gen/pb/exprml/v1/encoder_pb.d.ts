import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Value } from "./value_pb.js";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file exprml/v1/encoder.proto.
 */
export declare const file_exprml_v1_encoder: GenFile;
/**
 * EncodeInput is the input message for the Encode method.
 *
 * @generated from message exprml.v1.EncodeInput
 */
export type EncodeInput = Message<"exprml.v1.EncodeInput"> & {
    /**
     * Format of the output string.
     *
     * @generated from field: exprml.v1.EncodeInput.Format format = 1;
     */
    format: EncodeInput_Format;
    /**
     * JSON value to encode.
     *
     * @generated from field: exprml.v1.Value value = 3;
     */
    value?: Value;
};
/**
 * Describes the message exprml.v1.EncodeInput.
 * Use `create(EncodeInputSchema)` to create a new message.
 */
export declare const EncodeInputSchema: GenMessage<EncodeInput>;
/**
 * Format of the output string.
 *
 * @generated from enum exprml.v1.EncodeInput.Format
 */
export declare enum EncodeInput_Format {
    /**
     * YAML format.
     *
     * @generated from enum value: YAML = 0;
     */
    YAML = 0,
    /**
     * JSON format.
     *
     * @generated from enum value: JSON = 1;
     */
    JSON = 1
}
/**
 * Describes the enum exprml.v1.EncodeInput.Format.
 */
export declare const EncodeInput_FormatSchema: GenEnum<EncodeInput_Format>;
/**
 * EncodeOutput is the output message for the Encode method.
 *
 * @generated from message exprml.v1.EncodeOutput
 */
export type EncodeOutput = Message<"exprml.v1.EncodeOutput"> & {
    /**
     * Whether an error occurred during encoding.
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
     * Encoded YAML or JSON string.
     *
     * @generated from field: string result = 3;
     */
    result: string;
};
/**
 * Describes the message exprml.v1.EncodeOutput.
 * Use `create(EncodeOutputSchema)` to create a new message.
 */
export declare const EncodeOutputSchema: GenMessage<EncodeOutput>;
/**
 * Encoder interface encodes a JSON value into a YAML or JSON string.
 *
 * @generated from service exprml.v1.Encoder
 */
export declare const Encoder: GenService<{
    /**
     * Encode encodes a JSON value into a YAML or JSON string.
     *
     * @generated from rpc exprml.v1.Encoder.Encode
     */
    encode: {
        methodKind: "unary";
        input: typeof EncodeInputSchema;
        output: typeof EncodeOutputSchema;
    };
}>;
