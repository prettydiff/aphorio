
const database = function database():database {
    const record_validate = function database_recordValidate(table:table, record:record_object|type_record_array, existing:record_array):[record_array, string] {
            const now:number = Date.now(),
                complete = function database_recordValidate_complete(input:record_array):[record_array, string] {
                    if (existing === null) {
                        input[input.length - 3] = table.meta.index;
                        input[input.length - 2] = now;
                        input.id = table.meta.index;
                        table.meta.count_record = table.meta.count_record + 1n;
                        table.meta.index = table.meta.index + 1n;
                    } else {
                        input[input.length - 3] = existing.id;
                        input[input.length - 2] = existing[table.meta.count_column - 2];
                        input.id = existing.id;
                    }
                    input[input.length - 1] = now;
                    table.records[input.id.toString()] = input;
                    return [input, null];
                };
            if (table === null || table === undefined) {
                return [null, "Table submitted to record_validate is null or undefined."];
            }
            if (Array.isArray(record) === true) {
                const arr:record_array = record,
                    len:number = arr.length;
                let index:number = 0;
                if (len > table.meta.count_column) {
                    return [null, "Submitted object record contains more properties than the table has columns."];
                }
                if (len === 0) {
                    return [null, "Submitted object record contains no properties"];
                }
                do {
                    if (arr[index] !== null && typeof arr[index] !== table.meta.schema_array[index][1]) {
                        return [null, `Table ${table.meta.name} expects type ${table.meta.schema_array[index][1]} on column ${table.meta.schema_array[index][0]} but received value ${arr[index]} of type ${typeof arr[index]}.`];
                    }
                    index = index + 1;
                } while (index < len);
                if (len < table.meta.count_column) {
                    do {
                        arr.push(null);
                        index = index + 1;
                    } while (index < table.meta.count_column);
                }
                return complete(arr);
            }
            const obj:record_object = record as record_object,
                keys:string[] = Object.keys(obj),
                len:number = keys.length,
                arr:record_array = [];
            let index:number = 0;
            if (len > table.meta.count_column) {
                return [null, "Submitted object record contains more properties than the table has columns."];
            }
            if (len === 0) {
                return [null, "Submitted object record contains no properties"];
            }
            do {
                if (table.meta.schema_object[keys[index]] === null || table.meta.schema_object[keys[index]] === undefined) {
                    return [null, `Table ${table.meta.name} does not have a column named ${keys[index]}`];
                }
                if (typeof obj[keys[index]] !== table.meta.schema_object[keys[index]][1]) {
                    return [null, `Table ${table.meta.name} expects type ${table.meta.schema_object[keys[index]][1]} on column ${table.meta.schema_object[keys[index]][0]} but received value ${obj[keys[index]]} of type ${typeof obj[keys[index]]}.`];
                }
                arr[table.meta.schema_object[keys[index]][0]] = obj[keys[index]];
                index = index + 1;
            } while (index < len);
            index = 0;
            do {
                if (arr[index] === undefined) {
                    arr[index] = null;
                }
                index = index + 1;
            } while (index < table.meta.count_column);
            return complete(arr);
        },
        table_create = function database_tableCreate(name:string, schema:table_schema_array|table_schema_object):void {
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
                    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                    const table:table = this,
                        validate:[record_array, string] = table.record_validate(table, data, null);
                    if (validate[0] === null) {
                        return [false, validate[1]];
                    }
                    return [true, "Record matches schema and added to table."];
                },
                record_delete = function database_tableCreate_recordDelete(id:bigint):record_array {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                    const table:table = this,
                        record_output:type_record_array = [],
                        record_store:type_record_array = table.records[id.toString()];
                    let index:number = 0;
                    if (record_store === undefined) {
                        return [false, `No record in table ${table.meta.name} of id ${id}.`];
                    }
                    do {
                        record_output.push(record_store[index]);
                        index = index + 1;
                    } while (index < table.meta.count_column);
                    table.records[id.toString()] = null;
                    table.meta.count_record = table.meta.count_record - 1n;
                    return record_output;
                },
                record_modify = function database_tableCreate_recordModify(id:bigint, data:record_object|type_record_array):[boolean, string] {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                    const table:table = this,
                        existing:record_array = table.records[id.toString()];
                    if (existing === null || existing === undefined) {
                        return [false, `Record ${id} of table ${table.meta.name} is ${String(existing)}.`];
                    }
                    {
                        const validate:[record_array, string] = table.record_validate(table, data, existing);
                        if (validate[0] === null) {
                            return [false, validate[1]];
                        }
                        return [true, `Record ${id} of table ${table.meta.name} is modified.`];
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
                record_validate: database.record_validate,
                records: {},
                search: search
            };
        },
        table_delete = function database_tableDelete(name:string):void {
            // eslint-disable-next-line no-restricted-syntax
            delete this.store[name];
        },
        table_get = function database_tableGet(name:string):table {
            // eslint-disable-next-line no-restricted-syntax
            return this.store[name];
        },
        table_list = function database_tableList():table_stats {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
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
            record_validate: record_validate,
            table_create: table_create,
            table_delete: table_delete,
            table_get: table_get,
            table_list: table_list,
            store: {}
        };
    return database;
};

export default database;