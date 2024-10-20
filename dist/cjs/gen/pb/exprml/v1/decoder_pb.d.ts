import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Value } from "./value_pb.js";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file exprml/v1/decoder.proto.
 */
export declare const file_exprml_v1_decoder: GenFile;
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
export declare const DecodeInputSchema: GenMessage<DecodeInput>;
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
export declare const DecodeOutputSchema: GenMessage<DecodeOutput>;
/**
 * Decoder interface decodes a YAML string into a JSON value.
 *
 * @generated from service exprml.v1.Decoder
 */
export declare const Decoder: GenService<{
    /**
     * Decode decodes a YAML string into a JSON value.
     *
     * @generated from rpc exprml.v1.Decoder.Decode
     */
    decode: {
        methodKind: "unary";
        input: typeof DecodeInputSchema;
        output: typeof DecodeOutputSchema;
    };
}>;
