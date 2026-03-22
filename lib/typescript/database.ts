
interface database {
    store: {
        [key:string]: table;
    };
    record_validate: type_record_validate;
    table_create: (name:string, schema:[string, type_table_schema][]) => void;
    table_delete: (name:string) => void;
    table_get: (name:string) => table;
    table_list: () => table_stats;
}

interface record_array extends type_record_array {
    id?: string;
}

interface record_object {
    [key:string]: type_record_primitive;
}

interface record_store {
    [key:string]: type_record_array;
}

interface table {
    keys: string[];
    meta: table_meta;
    record_create: (record:record_object|type_record_array) => [boolean, string];
    record_delete: (id:string) => record_array;
    record_modify: (id:string, data:record_object|type_record_array) => [boolean, string];
    record_validate: type_record_validate;
    records: record_store;
    search: (query:type_table_query_array|type_table_query_array[]) => void;
}

interface table_meta {
    count_column: number;
    count_record: bigint;
    index: bigint;
    name: string;
    schema_array: table_schema_array;
    schema_object: table_schema;
    table_created: number;
    table_modified: number;
}

interface table_schema {
    [key:string]: [number, type_table_schema];
}

interface table_schema_object {
    [key:string]: type_table_schema;
}

interface table_stats {
    [key:string]: {
        count_column: number;
        count_record: bigint;
        schema_array: table_schema_array;
        schema_object: table_schema;
        time_created: Date;
        time_modified: Date;
    };
}

type comparator = "greater" | "is" | "lesser" | "not";
type table_schema_array = type_record_item[];
type type_record_array = Array<type_record_primitive>;
type type_record_item = [string, type_table_schema];
type type_record_primitive = bigint | boolean | number | string;
type type_record_validate = (table:table, record:record_object|type_record_array, existing:record_array) => [record_array, string];
type type_table_query_array = [number|string, comparator, type_record_primitive];
type type_table_schema = "bigint" | "boolean" | "number" | "string";
