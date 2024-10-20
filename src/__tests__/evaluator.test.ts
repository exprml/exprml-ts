import jest from "@jest/globals";

const {test, describe} = jest;

import {
    DecodeInputSchema,
    Decoder,
    EvaluateInputSchema, EvaluateOutput_Status,
    Evaluator,
    ParseInputSchema,
    Parser,
    Value, Value_Type
} from "../index.js";
import * as fs from "node:fs";
import * as path from "node:path";
import {create} from "@bufbuild/protobuf";


type Testcase = {
    yaml: string;
    wantValue?: Value;
    wantError?: boolean;
}

function provideTestcases(): Map<string, Testcase> {
    const testcases: Map<string, Testcase> = new Map();
    const filePaths = fs.readdirSync(path.join("testdata", "evaluator"), {recursive: true}) as string[];
    for (const filePath of filePaths) {
        if (filePath.endsWith(".in.yaml")) {
            const key = filePath.replace(/\.in\.yaml$/, "");
            const fileContent = fs.readFileSync(path.join("testdata", "evaluator", filePath), "utf-8");
            const testcase = testcases.get(key) ?? {yaml: fileContent};
            testcase.yaml = fileContent;
            testcases.set(key, testcase);
        } else if (filePath.endsWith(".want.yaml")) {
            const key = filePath.replace(/\.want\.yaml$/, "");
            const fileContent = fs.readFileSync(path.join("testdata", "evaluator", filePath), "utf-8");
            const want = new Decoder().decode(create(DecodeInputSchema, {yaml: fileContent}));
            if (want.isError) {
                throw new Error(`fail to decode yaml: ${want.errorMessage}`);
            }
            const testcase = testcases.get(key) ?? {yaml: ""};
            if ("want_value" in want.value!.obj) {
                testcase.wantValue = want.value!.obj["want_value"];
            }
            if ("want_error" in want.value!.obj) {
                testcase.wantError = want.value!.obj["want_error"].bool;
            }
            if (!testcase.wantValue && !testcase.wantError) {
                throw new Error(`want_value or want_error is not found in ${path}`);
            }
            testcases.set(key, testcase);
        }
    }
    return testcases;
}

describe("Evaluator_evaluate", () => {
    const testcases = provideTestcases();
    for (const name of testcases.keys().toArray().toSorted()) {
        test(name, () => {
            const testcase = testcases.get(name);

            const decodeResult = new Decoder()
                .decode(create(DecodeInputSchema, {yaml: testcase!.yaml}));
            if (decodeResult.isError) {
                throw new Error(`failed to decode yaml: ${decodeResult.errorMessage}`);
            }

            const parseResult = new Parser()
                .parse(create(ParseInputSchema, {value: decodeResult.value}));
            if (parseResult.isError) {
                throw new Error(`failed to parse: ${parseResult.errorMessage}`);
            }

            const evaluateResult = new Evaluator()
                .evaluateExpr(create(EvaluateInputSchema, {expr: parseResult.expr}));
            if (testcase?.wantError ?? false) {
                expect(evaluateResult.status).not.toBe(EvaluateOutput_Status.OK);
            } else {
                if (evaluateResult.status !== EvaluateOutput_Status.OK) {
                    expect(evaluateResult.status).toBe(EvaluateOutput_Status.OK);
                    throw new Error(`failed to parse: ${evaluateResult.errorMessage}`);
                }
                const msg = checkEqual([], testcase!.wantValue!, evaluateResult.value!);
                if (msg != null) {
                    throw new Error(`failed to evaluate: ${msg}`);
                }
            }
        });
    }
})

function checkEqual(path: string[], want: Value, got: Value): string | null {
    const p = "/" + path.join("/");
    if (want.type !== got.type) {
        return `type mismatch: path=${p}, got=${got.type}, want=${want.type}`;
    }
    switch (want.type) {
        case Value_Type.NULL:
            return null;
        case Value_Type.BOOL:
            if (want.bool !== got.bool) {
                return `boolean mismatch: path=${p}, got=${got.bool}, want=${want.bool}`;
            }
            return null;
        case Value_Type.NUM:
            if (want.num !== got.num) {
                return `number mismatch: path=${p}, got=${got.num}, want=${want.num}`;
            }
            return null;
        case Value_Type.STR:
            if (want.str !== got.str) {
                return `string mismatch: path=${p}, got=${got.str}, want=${want.str}`;
            }
            return null;
        case Value_Type.ARR:
            if (want.arr.length !== got.arr.length) {
                return `array length mismatch: path=${p}, got=${got.arr.length}, want=${want.arr.length}`;
            }
            for (let i = 0; i < want.arr.length; i++) {
                const newPath = [...path, `${i}`];
                const msg = checkEqual(newPath, want.arr[i], got.arr[i]);
                if (msg != null) {
                    return msg;
                }
            }
            return null;
        case Value_Type.OBJ:
            const wk = sortedKeys(want.obj);
            const gk = sortedKeys(got.obj);
            if (!arraysEqual(wk, gk)) {
                return `object keys mismatch: path=${p}, got=[${gk.join(",")}], want=[${wk.join(",")}]`;
            }
            for (const k of wk) {
                const newPath = [...path, k];
                const msg = checkEqual(newPath, want.obj[k], got.obj[k]);
                if (msg != null) {
                    return msg;
                }
            }
            return null;
        default:
            return `unexpected type: path=${p}, got=${got.type}, want=${want.type}`;
    }
}

function sortedKeys(obj: Record<string, Value>): string[] {
    return Object.keys(obj).sort();
}

function arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}