import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Expr } from "./expr_pb.js";
import type { Value } from "./value_pb.js";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file exprml/v1/parser.proto.
 */
export declare const file_exprml_v1_parser: GenFile;
/**
 * ParseInput is the input message for the Parse method.
 *
 * @generated from message exprml.v1.ParseInput
 */
export type ParseInput = Message<"exprml.v1.ParseInput"> & {
    /**
     * JSON value to parse.
     *
     * @generated from field: exprml.v1.Value value = 1;
     */
    value?: Value;
};
/**
 * Describes the message exprml.v1.ParseInput.
 * Use `create(ParseInputSchema)` to create a new message.
 */
export declare const ParseInputSchema: GenMessage<ParseInput>;
/**
 * ParseOutput is the output message for the Parse method.
 *
 * @generated from message exprml.v1.ParseOutput
 */
export type ParseOutput = Message<"exprml.v1.ParseOutput"> & {
    /**
     * Whether an error occurred during parsing.
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
     * Parsed Expr.
     *
     * @generated from field: exprml.v1.Expr expr = 3;
     */
    expr?: Expr;
};
/**
 * Describes the message exprml.v1.ParseOutput.
 * Use `create(ParseOutputSchema)` to create a new message.
 */
export declare const ParseOutputSchema: GenMessage<ParseOutput>;
/**
 * Parser interface parses a JSON value into a Node.
 *
 * @generated from service exprml.v1.Parser
 */
export declare const Parser: GenService<{
    /**
     * Parse parses a JSON value into a Node.
     *
     * @generated from rpc exprml.v1.Parser.Parse
     */
    parse: {
        methodKind: "unary";
        input: typeof ParseInputSchema;
        output: typeof ParseOutputSchema;
    };
}>;
