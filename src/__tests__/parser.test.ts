import jest from "@jest/globals";

const {test, describe} = jest;

import {DecodeInputSchema, Decoder, ParseInputSchema, Parser} from "../index.js";
import * as fs from "node:fs";
import * as path from "node:path";
import {create} from "@bufbuild/protobuf";


type Testcase = {
    yaml: string;
}

function provideTestcases(): Map<string, Testcase> {
    const testcases: Map<string, Testcase> = new Map();
    const filePaths = fs.readdirSync(path.join("testdata", "parser", "error"), {recursive: true}) as string[];
    for (const filePath of filePaths) {
        if (filePath.endsWith(".in.yaml")) {
            const key = filePath.replace(/\.in\.yaml$/, "");
            const fileContent = fs.readFileSync(path.join("testdata", "parser", "error", filePath), "utf-8");
            const testcase = testcases.get(key) ?? {yaml: fileContent};
            testcase.yaml = fileContent;
            testcases.set(key, testcase);
        }
    }
    return testcases;
}

describe("Parser_error", () => {
    const testcases = provideTestcases();
    for (const name of testcases.keys().toArray().toSorted()) {
        test(name, () => {
            const testcase = testcases.get(name);

            const decodeResult = new Decoder()
                .decode(create(DecodeInputSchema, {text: testcase!.yaml}));
            if (decodeResult.isError) {
                throw new Error("Expected error but got success");
            }

            const parseResult = new Parser()
                .parse(create(ParseInputSchema, {value: decodeResult.value}));
            expect(parseResult.isError).toBe(true);
        });
    }
})