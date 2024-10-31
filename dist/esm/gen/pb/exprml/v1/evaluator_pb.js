// @generated by protoc-gen-es v2.2.0 with parameter "target=ts,import_extension=js"
// @generated from file exprml/v1/evaluator.proto (package exprml.v1, syntax proto3)
/* eslint-disable */
import { enumDesc, fileDesc, messageDesc, serviceDesc } from "@bufbuild/protobuf/codegenv1";
import { file_exprml_v1_expr } from "./expr_pb.js";
import { file_exprml_v1_value } from "./value_pb.js";
/**
 * Describes the file exprml/v1/evaluator.proto.
 */
export const file_exprml_v1_evaluator = /*@__PURE__*/ fileDesc("ChlleHBybWwvdjEvZXZhbHVhdG9yLnByb3RvEglleHBybWwudjEiWAoIRGVmU3RhY2sSIwoGcGFyZW50GAEgASgLMhMuZXhwcm1sLnYxLkRlZlN0YWNrEicKA2RlZhgCIAEoCzIaLmV4cHJtbC52MS5FdmFsLkRlZmluaXRpb24iVgoNRXZhbHVhdGVJbnB1dBImCglkZWZfc3RhY2sYASABKAsyEy5leHBybWwudjEuRGVmU3RhY2sSHQoEZXhwchgCIAEoCzIPLmV4cHJtbC52MS5FeHByIoUDCg5FdmFsdWF0ZU91dHB1dBIwCgZzdGF0dXMYASABKA4yIC5leHBybWwudjEuRXZhbHVhdGVPdXRwdXQuU3RhdHVzEhUKDWVycm9yX21lc3NhZ2UYAiABKAkSKAoKZXJyb3JfcGF0aBgDIAEoCzIULmV4cHJtbC52MS5FeHByLlBhdGgSHwoFdmFsdWUYBCABKAsyEC5leHBybWwudjEuVmFsdWUi3gEKBlN0YXR1cxIGCgJPSxAAEhEKDUlOVkFMSURfSU5ERVgQZBIPCgtJTlZBTElEX0tFWRBlEhMKD1VORVhQRUNURURfVFlQRRBmEhUKEUFSR1VNRU5UX01JU01BVENIEGcSGAoUQ0FTRVNfTk9UX0VYSEFVU1RJVkUQaBIXChNSRUZFUkVOQ0VfTk9UX0ZPVU5EEGkSEgoOTk9UX0NPTVBBUkFCTEUQahIVChFOT1RfRklOSVRFX05VTUJFUhBrEgsKB0FCT1JURUQQbBIRCg1VTktOT1dOX0VSUk9SEG0yTgoJRXZhbHVhdG9yEkEKCEV2YWx1YXRlEhguZXhwcm1sLnYxLkV2YWx1YXRlSW5wdXQaGS5leHBybWwudjEuRXZhbHVhdGVPdXRwdXQiAEJkCg1jb20uZXhwcm1sLnYxQg5FdmFsdWF0b3JQcm90b1ABogIDRVhYqgIJRXhwcm1sLlYxygIJRXhwcm1sXFYx4gIVRXhwcm1sXFYxXEdQQk1ldGFkYXRh6gIKRXhwcm1sOjpWMWIGcHJvdG8z", [file_exprml_v1_expr, file_exprml_v1_value]);
/**
 * Describes the message exprml.v1.DefStack.
 * Use `create(DefStackSchema)` to create a new message.
 */
export const DefStackSchema = /*@__PURE__*/ messageDesc(file_exprml_v1_evaluator, 0);
/**
 * Describes the message exprml.v1.EvaluateInput.
 * Use `create(EvaluateInputSchema)` to create a new message.
 */
export const EvaluateInputSchema = /*@__PURE__*/ messageDesc(file_exprml_v1_evaluator, 1);
/**
 * Describes the message exprml.v1.EvaluateOutput.
 * Use `create(EvaluateOutputSchema)` to create a new message.
 */
export const EvaluateOutputSchema = /*@__PURE__*/ messageDesc(file_exprml_v1_evaluator, 2);
/**
 * Status of the evaluation.
 *
 * @generated from enum exprml.v1.EvaluateOutput.Status
 */
export var EvaluateOutput_Status;
(function (EvaluateOutput_Status) {
    /**
     * Evaluation was successful.
     *
     * @generated from enum value: OK = 0;
     */
    EvaluateOutput_Status[EvaluateOutput_Status["OK"] = 0] = "OK";
    /**
     * Index is invalid.
     *
     * @generated from enum value: INVALID_INDEX = 100;
     */
    EvaluateOutput_Status[EvaluateOutput_Status["INVALID_INDEX"] = 100] = "INVALID_INDEX";
    /**
     * Key is invalid.
     *
     * @generated from enum value: INVALID_KEY = 101;
     */
    EvaluateOutput_Status[EvaluateOutput_Status["INVALID_KEY"] = 101] = "INVALID_KEY";
    /**
     * Type is unexpected.
     *
     * @generated from enum value: UNEXPECTED_TYPE = 102;
     */
    EvaluateOutput_Status[EvaluateOutput_Status["UNEXPECTED_TYPE"] = 102] = "UNEXPECTED_TYPE";
    /**
     * Argument mismatch.
     *
     * @generated from enum value: ARGUMENT_MISMATCH = 103;
     */
    EvaluateOutput_Status[EvaluateOutput_Status["ARGUMENT_MISMATCH"] = 103] = "ARGUMENT_MISMATCH";
    /**
     * Cases are not exhaustive.
     *
     * @generated from enum value: CASES_NOT_EXHAUSTIVE = 104;
     */
    EvaluateOutput_Status[EvaluateOutput_Status["CASES_NOT_EXHAUSTIVE"] = 104] = "CASES_NOT_EXHAUSTIVE";
    /**
     * Reference not found.
     *
     * @generated from enum value: REFERENCE_NOT_FOUND = 105;
     */
    EvaluateOutput_Status[EvaluateOutput_Status["REFERENCE_NOT_FOUND"] = 105] = "REFERENCE_NOT_FOUND";
    /**
     * Values are not comparable.
     *
     * @generated from enum value: NOT_COMPARABLE = 106;
     */
    EvaluateOutput_Status[EvaluateOutput_Status["NOT_COMPARABLE"] = 106] = "NOT_COMPARABLE";
    /**
     * Not a finite number.
     *
     * @generated from enum value: NOT_FINITE_NUMBER = 107;
     */
    EvaluateOutput_Status[EvaluateOutput_Status["NOT_FINITE_NUMBER"] = 107] = "NOT_FINITE_NUMBER";
    /**
     * Evaluation was aborted.
     *
     * @generated from enum value: ABORTED = 108;
     */
    EvaluateOutput_Status[EvaluateOutput_Status["ABORTED"] = 108] = "ABORTED";
    /**
     * Unknown error.
     *
     * @generated from enum value: UNKNOWN_ERROR = 109;
     */
    EvaluateOutput_Status[EvaluateOutput_Status["UNKNOWN_ERROR"] = 109] = "UNKNOWN_ERROR";
})(EvaluateOutput_Status || (EvaluateOutput_Status = {}));
/**
 * Describes the enum exprml.v1.EvaluateOutput.Status.
 */
export const EvaluateOutput_StatusSchema = /*@__PURE__*/ enumDesc(file_exprml_v1_evaluator, 2, 0);
/**
 * Evaluator interface evaluates an expression.
 *
 * @generated from service exprml.v1.Evaluator
 */
export const Evaluator = /*@__PURE__*/ serviceDesc(file_exprml_v1_evaluator, 0);
