import type { GenEnum, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file exprml/v1/value.proto.
 */
export declare const file_exprml_v1_value: GenFile;
/**
 * JSON value.
 *
 * @generated from message exprml.v1.Value
 */
export type Value = Message<"exprml.v1.Value"> & {
    /**
     * Type of the value.
     *
     * @generated from field: exprml.v1.Value.Type type = 1;
     */
    type: Value_Type;
    /**
     * bool has a boolean value if the type is TYPE_BOOL.
     *
     * @generated from field: bool bool = 2;
     */
    bool: boolean;
    /**
     * num has a number value if the type is TYPE_NUM.
     *
     * @generated from field: double num = 3;
     */
    num: number;
    /**
     * str has a string value if the type is TYPE_STR.
     *
     * @generated from field: string str = 4;
     */
    str: string;
    /**
     * arr has an array value if the type is TYPE_ARR.
     *
     * @generated from field: repeated exprml.v1.Value arr = 5;
     */
    arr: Value[];
    /**
     * obj has an object value if the type is TYPE_OBJ.
     *
     * @generated from field: map<string, exprml.v1.Value> obj = 6;
     */
    obj: {
        [key: string]: Value;
    };
};
/**
 * Describes the message exprml.v1.Value.
 * Use `create(ValueSchema)` to create a new message.
 */
export declare const ValueSchema: GenMessage<Value>;
/**
 * Type of a JSON value.
 *
 * @generated from enum exprml.v1.Value.Type
 */
export declare enum Value_Type {
    /**
     * Unspecified.
     *
     * @generated from enum value: UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Null type.
     *
     * @generated from enum value: NULL = 1;
     */
    NULL = 1,
    /**
     * Boolean type.
     *
     * @generated from enum value: BOOL = 2;
     */
    BOOL = 2,
    /**
     * Number type.
     *
     * @generated from enum value: NUM = 3;
     */
    NUM = 3,
    /**
     * String type.
     *
     * @generated from enum value: STR = 4;
     */
    STR = 4,
    /**
     * Array type.
     *
     * @generated from enum value: ARR = 5;
     */
    ARR = 5,
    /**
     * Object type.
     *
     * @generated from enum value: OBJ = 6;
     */
    OBJ = 6
}
/**
 * Describes the enum exprml.v1.Value.Type.
 */
export declare const Value_TypeSchema: GenEnum<Value_Type>;
