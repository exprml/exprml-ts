import { Value } from "./gen/pb/exprml/v1/value_pb.js";
export declare function objValue(obj: Record<string, Value>): Value;
export declare function arrValue(arr: Value[]): Value;
export declare function strValue(str: string): Value;
export declare function numValue(num: number): Value;
export declare function boolValue(b: boolean): Value;
