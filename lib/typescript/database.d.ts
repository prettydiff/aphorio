
interface config_database_validate {
    output_format: "array" | "object";
    record_existing: record_array;
    record_update: record_object | type_record_array;
    table: table;
}

interface config_id {
    column: string;
    format: "array" | "object";
    table: table;
    value: type_record_primitive;
}

interface config_quantity {
    format: "array" | "object";
    quantity: number;
    start_from: number | "end";
    table: table;
}

interface database {
    get_by_id: (config:config_id) => record_array | record_object;
    get_quantity: (config:config_quantity) => record_array[] | record_object[];
    object_convert: (table:table, record:record_array) => record_object;
    record_create: (table:table, data:record_object|type_record_array, format:"array"|"object") => [record_array | record_object, string];
    record_delete: (table:table, id:string) => [record_array, string];
    record_validate: type_record_validate;
    store: {
        [key:string]: table;
    };
    table_create: (name:string, schema:[string, type_table_schema][], returned?:boolean) => table | void;
    table_delete: (name:string) => void;
    table_get: (name:string) => table;
    table_list: () => table_stats;
}

interface record_array extends type_record_array {
    id?: number;
}

interface record_object {
    [key:string]: type_record_primitive;
}

interface record_store {
    [key:string]: type_record_array;
}

interface table {
    get_array_by_id: (column:"string", value:type_record_primitive) => record_array;
    get_object_by_id: <Type>(column:"string", value:type_record_primitive) => Type;
    get_quantity_array: (quantity:number, start_from:number|"end") => record_array[];
    get_quantity_object: <Type>(quantity:number, start_from:number|"end") => Type[];
    keys: string[];
    meta: table_meta;
    object_convert: (table:table, record:record_array) => record_object;
    record_create_array: (record:record_object|type_record_array) => [record_array, string];
    record_create_object: <Type>(record:record_object|type_record_array) => [Type, string];
    record_delete_array: (id:string) => [record_array, string];
    record_delete_object: <Type>(id:string) => [Type, string];
    record_modify_array: (id:string, data:record_object|type_record_array) => [record_array, string];
    record_modify_object: <Type>(id:string, data:record_object|type_record_array) => [Type, string];
    record_validate: type_record_validate;
    records: record_store;
    search: (query:type_table_query_array[]) => void;
}

interface table_meta {
    count_column: number;
    count_record: number;
    index: number;
    name: string;
    schema_array: table_schema_array;
    schema_object: table_schema_object;
    table_created: number;
    table_modified: number;
}

interface table_schema_object {
    [key:string]: [number, type_table_schema];
}

interface table_stats {
    [key:string]: {
        count_column: number;
        count_record: number;
        schema_array: table_schema_array;
        schema_object: table_schema_object;
        time_created: Date;
        time_modified: Date;
    };
}

type comparator = "greater" | "is" | "lesser" | "not";
type table_schema_array = type_record_item[];
type type_record_array = Array<type_record_primitive>;
type type_record_item = [string, type_table_schema];
type type_record_primitive = boolean | number | object | string;
type type_record_update = [record_array | record_object, string];
type type_record_validate = (config:config_database_validate) => type_validate_output;
type type_table_query_array = [number|string, comparator, type_record_primitive];
type type_table_schema = "boolean" | "number" | "object" | "string";
type type_validate_output = [record_array | record_object, string];
