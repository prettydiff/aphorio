
const database = function database():database {
    const table_create = function database_tableCreate(name:string, schema:table_schema_array|table_schema_object):void {
            const now:number = Date.now(),
                meta:table_meta = {
                    count_column: 0,
                    count_record: 0n,
                    index: 0n,
                    name: name,
                    schema_array: [],
                    schema_object: {},
                    table_created: now,
                    table_modified: now
                },
                array_test_table:boolean = Array.isArray(schema),
                len_schema:number = (array_test_table === true)
                    ? (schema as table_schema_array).length
                    : 0,
                record_create = function database_tableCreate_recordCreate(data:record_object|type_record_array):[boolean, string] {
                    const table:table = this,
                        array_test_record:boolean = Array.isArray(data),
                        now:number = Date.now(),
                        record:type_record_array = [];
                    if (array_test_record === true) {
                        const arr:type_record_array = data as type_record_array,
                            len:number = arr.length;
                        let index:number = 0;
                        if (len > table.meta.count_column) {
                            return [false, "Submitted array record contains more indexes than the table has columns."]
                        }
                        if (len > 0) {
                            if (arr[index] !== null && typeof arr[index] !== table.meta.schema_array[index][1]) {
                                return [false, `Table ${table.meta.name} expects type ${table.meta.schema_array[index][1]} on column ${index} (${table.meta.schema_array[index][0]}) but received value ${arr[index]} of type ${typeof arr[index]}.`];
                            }
                            record.push(arr[index]);
                            index = index + 1;
                        } while (index < len);
                    } else if (data !== null && data !== undefined) {
                        const obj:record_object = data as record_object,
                            keys:string[] = Object.keys(obj),
                            len:number = keys.length;
                        let index:number = 0;
                        if (len > table.meta.count_column) {
                            return [false, "Submitted object record contains more properties than the table has columns."]
                        }
                        if (len > 0) {
                            if (obj[keys[index]] !== null && obj[keys[index]] !== table.meta.schema_array[index][1]) {
                                return [false, `Table ${table.meta.name} expects type ${table.meta.schema_array[index][1]} on column ${table.meta.schema_object[keys[index]][0]} (${table.meta.schema_object[keys[index]][1]}) but received value ${obj[keys[index]]} of type ${typeof obj[keys[index]]}.`];
                            }
                            record.push([keys[index], obj[keys[index]]]);
                            index = index + 1;
                        } while (index < len);
                    }
                    record.push(table.meta.index);
                    record.push(now);
                    record.push(now);
                    table.records[String(table.meta.index)] = record;
                    table.meta.count_record = table.meta.count_record + 1n;
                    table.meta.index = table.meta.index + 1n;
                    return [true, "Record matches schema and added to table."];
                },
                record_delete = function database_tableCreate_recordDelete(id:bigint):type_record_primitive {
                    const table:table = this,
                        record:type_record_primitive = table.records[String(id)];
                    if (record === undefined) {
                        return null;
                    }
                    delete table.records[id.toString()];
                    table.meta.count_record = table.meta.count_record - 1n;
                    return record;
                },
                record_modify = function database_tableCreate_recordModify(id:bigint, data:record_object|table_schema_array):void {
                    const table:table = this,
                        record:type_record_primitive = table.records[String(id)],
                        array_test_record:boolean = Array.isArray(data);
                    if (record === undefined) {
                        return;
                    }
                    if (array_test_record === true) {
                        const arr:table_schema_array = data as table_schema_array,
                            len:number = arr.length;
                        if (len > 0) {
                            let index:number = 0;
                            do {
                                if (arr[index] === null || table.meta.schema_object[arr[index][0]][1] === arr[index][1]) {
                                    //record[table.meta.schema_object[arr[index][0]][0]] = 
                                }
                            } while (index < len);
                        }

                    }
                },
                search = function database_tableCreate_search(query:type_table_query_array|type_table_query_array[]):void {

                };
            let index:number = 0,
                count:number = 0;
            if (array_test_table === true) {
                if (len_schema > 0) {
                    const scheme:table_schema_array = schema as table_schema_array;
                    do {
                        if (scheme[index][0] !== "index" && scheme[index][0] !== "record_created" && scheme[index][0] !== "record_modified") {
                            meta.schema_array.push(scheme[index]);
                            meta.schema_object[scheme[index][0]] = [count, scheme[index][1]];
                            meta.count_column = meta.count_column + 1;
                            count = count + 1;
                        }
                        index = index + 1;
                    } while (index < len_schema);
                }
            } else if (schema !== null && schema !== undefined) {
                const scheme:table_schema_object = schema as table_schema_object,
                    keys:string[] = Object.keys(scheme),
                    len:number = keys.length;
                if (len > 0) {
                    let index:number = 0;
                    do {
                        if (keys[index] !== "index" && keys[index] !== "record_created" && keys[index] !== "record_modified") {
                            meta.schema_array.push([keys[index], scheme[keys[index]]]);
                            meta.schema_object[keys[index]] = [count, scheme[keys[index]]];
                            meta.count_column = meta.count_column + 1;
                            count = count + 1;
                        }
                        index = index + 1;
                    } while (index < len);
                }
            }
            meta.schema_array.push(["index", "bigint"]);
            meta.schema_array.push(["record_created", "number"]);
            meta.schema_array.push(["record_modified", "number"]);
            meta.schema_object["index"] = [count + 1, "bigint"];
            meta.schema_object["record_created"] = [count + 2, "number"];
            meta.schema_object["record_modified"] = [index + 3, "number"];
            meta.count_column = count + 3;
            database.store[name] = {
                meta: meta,
                record_create: record_create,
                record_delete: record_delete,
                record_modify: record_modify,
                records: {},
                search: search
            };
        },
        table_delete = function database_tableDelete(name:string):void {
            delete this.store[name];
        },
        table_get = function database_tableGet(name:string):table {
            return this.store[name];
        },
        table_list = function database_tableList():table_stats {
            const db:database = this,
                keys:string[] = Object.keys(db.store).sort(),
                len:number = keys.length,
                output:table_stats = {};
            let index:number = 0;
            if (len > 0) {
                do {
                    output[keys[index]] = {
                        count_column: db.store[keys[index]].meta.count_column,
                        count_record: db.store[keys[index]].meta.count_record,
                        schema_array: db.store[keys[index]].meta.schema_array,
                        schema_object: db.store[keys[index]].meta.schema_object,
                        time_created: new Date(db.store[keys[index]].meta.table_created),
                        time_modified: new Date(db.store[keys[index]].meta.table_modified)
                    };
                    index = index + 1;
                } while (index < len);
            }
            return output;
        },
        database:database = {
            table_create: table_create,
            table_delete: table_delete,
            table_get: table_get,
            table_list: table_list,
            store: {}
        };
    return database;
};

export default database;