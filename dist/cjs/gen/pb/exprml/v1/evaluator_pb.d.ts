import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Eval_Definition, Expr, Expr_Path } from "./expr_pb.js";
import type { Value } from "./value_pb.js";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file exprml/v1/evaluator.proto.
 */
export declare const file_exprml_v1_evaluator: GenFile;
/**
 * FunDefList is a list of function definitions.
 *
 * @generated from message exprml.v1.DefStack
 */
export type DefStack = Message<"exprml.v1.DefStack"> & {
    /**
     * Parent definition list.
     *
     * @generated from field: exprml.v1.DefStack parent = 1;
     */
    parent?: DefStack;
    /**
     * Definition.
     *
     * @generated from field: exprml.v1.Eval.Definition def = 2;
     */
    def?: Eval_Definition;
};
/**
 * Describes the message exprml.v1.DefStack.
 * Use `create(DefStackSchema)` to create a new message.
 */
export declare const DefStackSchema: GenMessage<DefStack>;
/**
 * EvaluateInput is the input message for the EvaluateExpr method.
 *
 * @generated from message exprml.v1.EvaluateInput
 */
export type EvaluateInput = Message<"exprml.v1.EvaluateInput"> & {
    /**
     * Function definition stack.
     *
     * @generated from field: exprml.v1.DefStack def_stack = 1;
     */
    defStack?: DefStack;
    /**
     * Expression to evaluate.
     *
     * @generated from field: exprml.v1.Expr expr = 2;
     */
    expr?: Expr;
};
/**
 * Describes the message exprml.v1.EvaluateInput.
 * Use `create(EvaluateInputSchema)` to create a new message.
 */
export declare const EvaluateInputSchema: GenMessage<EvaluateInput>;
/**
 * EvaluateOutput is the output message for the EvaluateExpr method.
 *
 * @generated from message exprml.v1.EvaluateOutput
 */
export type EvaluateOutput = Message<"exprml.v1.EvaluateOutput"> & {
    /**
     * Status of the evaluation.
     *
     * @generated from field: exprml.v1.EvaluateOutput.Status status = 1;
     */
    status: EvaluateOutput_Status;
    /**
     * Error message if status is not OK.
     *
     * @generated from field: string error_message = 2;
     */
    errorMessage: string;
    /**
     * Error path if status is not OK.
     *
     * @generated from field: exprml.v1.Expr.Path error_path = 3;
     */
    errorPath?: Expr_Path;
    /**
     * Result of the evaluation.
     *
     * @generated from field: exprml.v1.Value value = 4;
     */
    value?: Value;
};
/**
 * Describes the message exprml.v1.EvaluateOutput.
 * Use `create(EvaluateOutputSchema)` to create a new message.
 */
export declare const EvaluateOutputSchema: GenMessage<EvaluateOutput>;
/**
 * Status of the evaluation.
 *
 * @generated from enum exprml.v1.EvaluateOutput.Status
 */
export declare enum EvaluateOutput_Status {
    /**
     * Evaluation was successful.
     *
     * @generated from enum value: OK = 0;
     */
    OK = 0,
    /**
     * Index is invalid.
     *
     * @generated from enum value: INVALID_INDEX = 100;
     */
    INVALID_INDEX = 100,
    /**
     * Key is invalid.
     *
     * @generated from enum value: INVALID_KEY = 101;
     */
    INVALID_KEY = 101,
    /**
     * Type is unexpected.
     *
     * @generated from enum value: UNEXPECTED_TYPE = 102;
     */
    UNEXPECTED_TYPE = 102,
    /**
     * Argument mismatch.
     *
     * @generated from enum value: ARGUMENT_MISMATCH = 103;
     */
    ARGUMENT_MISMATCH = 103,
    /**
     * Cases are not exhaustive.
     *
     * @generated from enum value: CASES_NOT_EXHAUSTIVE = 104;
     */
    CASES_NOT_EXHAUSTIVE = 104,
    /**
     * Reference not found.
     *
     * @generated from enum value: REFERENCE_NOT_FOUND = 105;
     */
    REFERENCE_NOT_FOUND = 105,
    /**
     * Values are not comparable.
     *
     * @generated from enum value: NOT_COMPARABLE = 106;
     */
    NOT_COMPARABLE = 106,
    /**
     * Not a finite number.
     *
     * @generated from enum value: NOT_FINITE_NUMBER = 107;
     */
    NOT_FINITE_NUMBER = 107,
    /**
     * Evaluation was aborted.
     *
     * @generated from enum value: ABORTED = 108;
     */
    ABORTED = 108,
    /**
     * Unknown error.
     *
     * @generated from enum value: UNKNOWN_ERROR = 109;
     */
    UNKNOWN_ERROR = 109
}
/**
 * Describes the enum exprml.v1.EvaluateOutput.Status.
 */
export declare const EvaluateOutput_StatusSchema: GenEnum<EvaluateOutput_Status>;
/**
 * Evaluator interface evaluates an expression.
 *
 * @generated from service exprml.v1.Evaluator
 */
export declare const Evaluator: GenService<{
    /**
     * EvaluateExpr evaluates an expression.
     *
     * @generated from rpc exprml.v1.Evaluator.Evaluate
     */
    evaluate: {
        methodKind: "unary";
        input: typeof EvaluateInputSchema;
        output: typeof EvaluateOutputSchema;
    };
}>;
