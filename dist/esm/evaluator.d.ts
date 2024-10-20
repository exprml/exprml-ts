import { EvaluateInput, EvaluateOutput } from "./gen/pb/exprml/v1/evaluator_pb.js";
import { Expr_Path } from "./gen/pb/exprml/v1/expr_pb.js";
import { Value } from "./gen/pb/exprml/v1/value_pb.js";
export declare class Config {
    constructor(props?: {
        extension?: Map<string, (path: Expr_Path, args: Record<string, Value>) => EvaluateOutput>;
        beforeEvaluate?: (input: EvaluateInput) => void;
        afterEvaluate?: (input: EvaluateInput, output: EvaluateOutput) => void;
    });
    extension: Map<string, (path: Expr_Path, args: Record<string, Value>) => EvaluateOutput>;
    beforeEvaluate: (input: EvaluateInput) => void;
    afterEvaluate: (input: EvaluateInput, output: EvaluateOutput) => void;
}
export declare class Evaluator {
    constructor(config?: Config);
    private readonly config;
    evaluateExpr(input: EvaluateInput): EvaluateOutput;
    evaluateEval(input: EvaluateInput): EvaluateOutput;
    evaluateScalar(input: EvaluateInput): EvaluateOutput;
    evaluateRef(input: EvaluateInput): EvaluateOutput;
    evaluateObj(input: EvaluateInput): EvaluateOutput;
    evaluateArr(input: EvaluateInput): EvaluateOutput;
    evaluateJson(input: EvaluateInput): EvaluateOutput;
    evaluateIter(input: EvaluateInput): EvaluateOutput;
    evaluateElem(input: EvaluateInput): EvaluateOutput;
    evaluateCall(input: EvaluateInput): EvaluateOutput;
    evaluateCases(input: EvaluateInput): EvaluateOutput;
    evaluateOpUnary(input: EvaluateInput): EvaluateOutput;
    evaluateOpBinary(input: EvaluateInput): EvaluateOutput;
    evaluateOpVariadic(input: EvaluateInput): EvaluateOutput;
}
