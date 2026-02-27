
interface database {
    table_create: (name:string, schema:[string, type_table_schema][]) => void;
    table_delete: (name:string) => void;
    table_get: (name:string) => table;
    table_list: () => string[];
    table_stats: (name:string) => table_stats;
    meta: {
        created: number;
        modified: number;
        name: string;
        table_count: number;
        table_last_modified: string;
    };
    store: {
        [key:string]: table;
    };
}

interface database_stats {

};

interface dbms {
    database_create: (name:string) => void;
    database_delete: (name:string) => void;
    database_get: (name:string) => database;
    database_list: () => string[];
    database_stats: (name:string) => database_stats;
    store: {
        [key:string]: database;
    };
}

interface record_object {
    [key:string]: type_record_primitive;
};

interface table {
    meta: table_meta;
    record_create: (record:record_object | type_record_array) => void;
}

interface table_meta {
    count_column: bigint;
    count_record: bigint;
    index: bigint;
    name: string;
    schema: {
        [key:string]: [number, type_table_schema];
    };
}

interface table_stats {

}

type type_record_array = type_record_primitive[];
type type_record_primitive = bigint | boolean | number | object | string;
type type_table_schema = "bigint" | "boolean" | "number" | "object" | "string";
