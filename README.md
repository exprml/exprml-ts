# exprml-ts

`exprml-ts` is a TypeScript and JavaScript library implementing an ExprML interpreter.
The ExprML is a programming language that can evaluate expressions represented in the YAML format.

The language specification is available at https://github.com/exprml/exprml-language .

## Installation

```bash
npm install @bufbuild/protobuf@2.2.0 exprml-ts@0.0.2
```

## Example

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

const decodeResult = new Decoder()
    .decode(create(DecodeInputSchema, {yaml: "cat: ['`Hello`', '`, `', '`ExprML`', '`!`']"}));

const parseResult = new Parser()
    .parse(create(ParseInputSchema, {value: decodeResult.value}));

const evaluateResult = new Evaluator()
    .evaluateExpr(create(EvaluateInputSchema, {expr: parseResult.expr}));

const encodeResult = new Encoder()
    .encode(create(EncodeInputSchema, {value: evaluateResult.value}));

console.log(encodeResult.result);
// => Hello, ExprML!
```

