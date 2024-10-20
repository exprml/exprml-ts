# exprml-ts

`exprml-ts` is a TypeScript and JavaScript library implementing an ExprML interpreter.
The ExprML is a programming language that can evaluate expressions represented in the YAML format.

The language specification is available at https://github.com/exprml/exprml-language .

## Installation

```bash
npm install @bufbuild/protobuf@2.2.0 exprml-ts
```

## Examples

Evaluate the expression an expression represented in the YAML format.

```ts
import {
    DecodeInputSchema,
    Decoder,
    EncodeInputSchema,
    Encoder,
    EvaluateInputSchema,
    Evaluator,
    ParseInputSchema,
    Parser
} from "exprml-ts";
import {create} from "@bufbuild/protobuf";

// Decode the YAML string to a JSON value of JavaScript.
const decodeResult = new Decoder()
    .decode(create(DecodeInputSchema, {yaml: "cat: ['`Hello`', '`, `', '`ExprML`', '`!`']"}));
// Parse an AST from the JSON value.
const parseResult = new Parser()
    .parse(create(ParseInputSchema, {value: decodeResult.value}));
// Evaluate expression of the AST as a JSON value.
const evaluateResult = new Evaluator()
    .evaluateExpr(create(EvaluateInputSchema, {expr: parseResult.expr}));
// Encode the JSON value to a YAML string.
const encodeResult = new Encoder()
    .encode(create(EncodeInputSchema, {value: evaluateResult.value}));

console.log(encodeResult.result);
// => Hello, ExprML!
```

Call JavaScript function from ExprML.

```ts
import {
    Config,
    DecodeInputSchema,
    Decoder,
    EncodeInputSchema,
    Encoder,
    EvaluateInputSchema, EvaluateOutput, EvaluateOutputSchema,
    Evaluator, Expr_Path,
    ParseInputSchema,
    Parser, strValue, Value, ValueSchema
} from "exprml-ts";
import {create} from "@bufbuild/protobuf";

const decodeResult = new Decoder()
    .decode(create(DecodeInputSchema, {yaml: "cat: ['`Hello`', '`, `', '`ExprML`', '`!`']"}));

const parseResult = new Parser()
    .parse(create(ParseInputSchema, {value: decodeResult.value}));

const evaluator = new Evaluator(new Config({
    extension: new Map([
        // Define an extension function named $hello, which takes an argument $name and returns a greeting string.
        ["$hello", (path: Expr_Path, args: Record<string, Value>): EvaluateOutput => {
            const name = args["$name"];
            return create(EvaluateOutputSchema, {
                value: create(ValueSchema, strValue(`Hello, ${name.str}!`)),
            });
        }],
    ]),
}));
const evaluateResult = evaluator.evaluateExpr(create(EvaluateInputSchema, {expr: parseResult.expr}));

const encodeResult = new Encoder().encode(create(EncodeInputSchema, {value: evaluateResult.value}));
console.log(encodeResult.result);
// => Hello, Extension!
```

Hook PHP functions before and after each evaluation of nested expressions.

```ts
import {
    Config,
    DecodeInputSchema,
    Decoder,
    EvaluateInput,
    EvaluateInputSchema, EvaluateOutput,
    Evaluator, format,
    ParseInputSchema,
    Parser, ValueSchema
} from "exprml-ts";
import {create, toJsonString} from "@bufbuild/protobuf";

const decodeResult = new Decoder()
    .decode(create(DecodeInputSchema, {yaml: "cat: ['`Hello`', '`, `', '`ExprML`', '`!`']"}));

const parseResult = new Parser()
    .parse(create(ParseInputSchema, {value: decodeResult.value}));


const evaluator = new Evaluator(new Config({
    /* Hook a function before the evaluation of each expression. */
    beforeEvaluate: (input: EvaluateInput) => {
        console.log(`before:\t${format(input.expr!.path!)}`);
    },
    /* Hook a function after the evaluation of each expression. */
    afterEvaluate: (input: EvaluateInput, output: EvaluateOutput) => {
        console.log(`after:\t${format(input.expr!.path!)} --> ${toJsonString(ValueSchema, output.value!)}`);
    }
}));

evaluator.evaluateExpr(create(EvaluateInputSchema, {expr: parseResult.expr}));
// =>
// before: /
// before: /cat/0
// after:  /cat/0 --> {"type":"STR","str":"Hello"}
// before: /cat/1
// after:  /cat/1 --> {"type":"STR","str":", "}
// before: /cat/2
// after:  /cat/2 --> {"type":"STR","str":"ExprML"}
// before: /cat/3
// after:  /cat/3 --> {"type":"STR","str":"!"}
// after:  / --> {"type":"STR","str":"Hello, ExprML!"}
```

## NPM

https://www.npmjs.com/package/exprml-ts
