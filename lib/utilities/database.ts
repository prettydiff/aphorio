
const database = function database():database {
    const get_by_id = function database_getById(config:config_id):record_array | record_object {
            const column_record:[number, string] = config.table.meta.schema_object[config.column],
                column_index:number = (column_record === undefined)
                    ? null
                    : column_record[0];
            let index:number = 0;
            if (column_index === null) {
                return null;
            }
            do {
                if (config.table.records[index] !== null && config.table.records[index][column_index] === config.value) {
                    if (config.format === "object") {
                        return config.table.object_convert(config.table, config.table.records[index]);
                    }
                    return config.table.records[index];
                }
                index = index + 1;
            } while (index < config.table.meta.count_record);
            return null;
        },
        get_quantity = function database_getQuantity(config:config_quantity):record_array[] | record_object[] {
            const list_array:record_array[] = [],
                list_object:record_object[] = [],
                count_record:number = Number(config.table.meta.count_record);
            let index:number = (config.start_from === "end")
                    ? count_record
                    : config.start_from,
                count:number = 0;
            if (config.start_from === "end") {
                do {
                    if (config.table.records[index] !== null) {
                        count = count + 1;
                    }
                    index = index - 1;
                } while (index > 0 && count < config.quantity);
                count = 0;
            } else if (config.start_from > count_record) {
                return list_array;
            }
            do {
                if (config.table.records[index] !== null) {
                    if (config.format === "object") {
                        list_object.push(config.table.object_convert(config.table, config.table.records[index]));
                    } else {
                        list_array.push(config.table.records[index]);
                    }
                    count = count + 1;
                }
                index = index + 1;
            } while (index < count_record && count < config.quantity);
            if (config.format === "object") {
                return list_object;
            }
            return list_array;
        },
        object_convert = function database_objectConvert(table:table, record:record_array):record_object {
            const output:record_object = {},
                len:number = table.meta.count_column;
            let index:number = 0;
            do {
                output[table.meta.schema_array[index][0]] = record[index];
                index = index + 1;
            } while (index < len);
            return output;
        },
        record_create = function database_recordCreate(table:table, data:record_object|type_record_array, format:"array"|"object"):[record_array|record_object, string] {
            const validate:type_validate_output = table.record_validate({
                    output_format: format,
                    record_existing: null,
                    record_update: data,
                    table: table
                });
            if (validate[0] === null) {
                return [null, validate[1]];
            }
            return [validate[0] as record_array, "Record matches schema and added to table."];
        },
        record_delete = function database_recordDelete(table:table, id:string):[record_array, string] {
            const record_output:type_record_array = [],
                record_store:type_record_array = table.records[id];
            let index:number = 0;
            if (record_store === undefined) {
                return [null, `No record in table ${table.meta.name} of id ${id}.`];
            }
            do {
                record_output.push(record_store[index]);
                index = index + 1;
            } while (index < table.meta.count_column);
            table.records[id] = null;
            table.meta.count_record = table.meta.count_record - 1;
            return [record_output, `Record ${id} deleted from table ${table.meta.name}.`];
        },
        record_validate = function database_recordValidate(config:config_database_validate):type_validate_output {
            const now:number = Date.now(),
                complete = function database_recordValidate_complete(input:record_array):[record_array | record_object, string] {
                    if (config.record_existing === null) {
                        config.table.keys.push(String(config.table.meta.index));
                        input[input.length - 3] = config.table.meta.index;
                        input[input.length - 2] = now;
                        input.id = config.table.meta.index;
                        config.table.meta.count_record = config.table.meta.count_record + 1;
                        config.table.meta.index = config.table.meta.index + 1;
                    } else {
                        input[input.length - 3] = config.record_existing.id;
                        input[input.length - 2] = config.record_existing[config.table.meta.count_column - 2];
                        input.id = config.record_existing.id;
                    }
                    input[input.length - 1] = now;
                    config.table.records[input.id] = input;
                    if (config.output_format === "object") {
                        return [config.table.object_convert(config.table, input), null];
                    }
                    return [input, null];
                };
            if (config.table === null || config.table === undefined) {
                return [null, "Table submitted to record_validate is null or undefined."];
            }
            if (Array.isArray(config.record_update) === true) {
                const arr:record_array = config.record_update,
                    len:number = arr.length;
                let index:number = 0;
                if (len > config.table.meta.count_column) {
                    return [null, "Submitted object record contains more properties than the table has columns."];
                }
                if (len === 0) {
                    return [null, "Submitted object record contains no properties"];
                }
                do {
                    if (arr[index] !== null && typeof arr[index] !== config.table.meta.schema_array[index][1]) {
                        return [null, `Table ${config.table.meta.name} expects type ${config.table.meta.schema_array[index][1]} on column ${config.table.meta.schema_array[index][0]} but received value ${arr[index]} of type ${typeof arr[index]}.`];
                    }
                    index = index + 1;
                } while (index < len);
                if (len < config.table.meta.count_column) {
                    do {
                        arr.push(null);
                        index = index + 1;
                    } while (index < config.table.meta.count_column);
                }
                return complete(arr);
            }
            {
                const obj:record_object = config.record_update as record_object,
                    keys:string[] = Object.keys(obj),
                    len:number = keys.length,
                    arr:record_array = [];
                let index:number = 0;
                if (len > config.table.meta.count_column) {
                    return [null, "Submitted object record contains more properties than the table has columns."];
                }
                if (len === 0) {
                    return [null, "Submitted object record contains no properties"];
                }
                do {
                    if (config.table.meta.schema_object[keys[index]] === null || config.table.meta.schema_object[keys[index]] === undefined) {
                        return [null, `Table ${config.table.meta.name} does not have a column named ${keys[index]}`];
                    }
                    if (typeof obj[keys[index]] !== config.table.meta.schema_object[keys[index]][1]) {
                        return [null, `Table ${config.table.meta.name} expects type ${config.table.meta.schema_object[keys[index]][1]} on column ${config.table.meta.schema_object[keys[index]][0]} but received value ${obj[keys[index]]} of type ${typeof obj[keys[index]]}.`];
                    }
                    arr[config.table.meta.schema_object[keys[index]][0]] = obj[keys[index]];
                    index = index + 1;
                } while (index < len);
                index = 0;
                do {
                    if (arr[index] === undefined) {
                        arr[index] = null;
                    }
                    index = index + 1;
                } while (index < config.table.meta.count_column);
                return complete(arr);
            }
        },
        table_create = function database_tableCreate(name:string, schema:table_schema_array|table_schema_object, returned?:boolean):table|void {
            const now:number = Date.now(),
                meta:table_meta = {
                    count_column: 0,
                    count_record: 0,
                    index: 0,
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
                get_array_by_id = function database_tableCreate_getArrayById(column: "string", value: type_record_primitive):record_array {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                    const table:table = this;
                    return database.get_by_id({
                        column: column,
                        format: "array",
                        table: table,
                        value: value
                    }) as record_array;
                },
                get_object_by_id = function database_tableCreate_getArrayById<Type>(column: "string", value: type_record_primitive):Type {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                    const table:table = this;
                    return database.get_by_id({
                        column: column,
                        format: "object",
                        table: table,
                        value: value
                    }) as Type;
                },
                get_quantity_array = function database_tableCreate_getQuantityArray(quantity:number, start_from: number | "end"):record_array[] {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                    const table:table = this;
                    return database.get_quantity({
                        format: "array",
                        quantity: quantity,
                        start_from: start_from,
                        table: table
                    }) as record_array[];
                },
                get_quantity_object = function database_tableCreate_getQuantityObject<Type>(quantity:number, start_from: number | "end"):Type[] {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                    const table:table = this;
                    return database.get_quantity({
                        format: "object",
                        quantity: quantity,
                        start_from: start_from,
                        table: table
                    }) as Type[];
                },
                record_create_array = function database_tableCreate_recordCreateArray(data:record_object|type_record_array):[record_array, string] {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                    const table:table = this;
                    return database.record_create(table, data, "array") as [record_array, string];
                },
                record_create_object = function database_tableCreate_recordCreateObject<Type>(data:record_object|type_record_array):[Type, string] {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                    const table:table = this;
                    return database.record_create(table, data, "object") as [Type, string];
                },
                record_delete_array = function database_tableCreate_recordDeleteArray(id:string):[record_array, string] {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                    const table:table = this;
                    return database.record_delete(table, id);
                },
                record_delete_object = function database_tableCreate_recordDeleteObject<Type>(id:string):[Type, string] {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                    const table:table = this,
                        record:[record_array, string] = database.record_delete(table, id);
                    if (record[0] === null) {
                        return [null, record[1]];
                    }
                    return [table.object_convert(table, record[0]) as Type, record[1]];
                },
                record_modify_array = function database_tableCreate_recordModifyArray(id:string, data:record_object|type_record_array):[record_array, string] {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                    const table:table = this,
                        existing:record_array = table.records[id];
                    if (existing === null || existing === undefined) {
                        return [null, `Record ${id} of table ${table.meta.name} is ${String(existing)}.`];
                    }
                    {
                        const validate:type_validate_output = table.record_validate({
                            output_format: "array",
                            record_existing: existing,
                            record_update: data,
                            table: table
                        });
                        if (validate[0] === null) {
                            return [null, validate[1]];
                        }
                        return [existing, `Record ${id} of table ${table.meta.name} is modified.`];
                    }
                },
                record_modify_object = function database_tableCreate_recordModifyObject<Type>(id:string, data:record_object|type_record_array):[Type, string] {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                    const table:table = this,
                        existing:record_array = table.records[id];
                    if (existing === null || existing === undefined) {
                        return [null, `Record ${id} of table ${table.meta.name} is ${String(existing)}.`];
                    }
                    {
                        const validate:type_validate_output = table.record_validate({
                            output_format: "object",
                            record_existing: existing,
                            record_update: data,
                            table: table
                        });
                        if (validate[0] === null) {
                            return [null, validate[1]];
                        }
                        return [table.object_convert(table, existing) as Type, `Record ${id} of table ${table.meta.name} is modified.`];
                    }
                },
                search = function database_tableCreate_search(query:type_table_query_array[]):void {

                },
                table:table = {
                    keys: [],
                    meta: meta,
                    get_array_by_id: get_array_by_id,
                    get_object_by_id: get_object_by_id,
                    get_quantity_array: get_quantity_array,
                    get_quantity_object: get_quantity_object,
                    object_convert: database.object_convert,
                    record_create_array: record_create_array,
                    record_create_object: record_create_object,
                    record_delete_array: record_delete_array,
                    record_delete_object: record_delete_object,
                    record_modify_array: record_modify_array,
                    record_modify_object: record_modify_object,
                    record_validate: database.record_validate,
                    records: {},
                    search: search
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
                            meta.schema_array.push([keys[index], scheme[keys[index]][1]]);
                            meta.schema_object[keys[index]] = [count, scheme[keys[index]][1]];
                            meta.count_column = meta.count_column + 1;
                            count = count + 1;
                        }
                        index = index + 1;
                    } while (index < len);
                }
            }
            meta.schema_array.push(["index", "string"]);
            meta.schema_array.push(["record_created", "number"]);
            meta.schema_array.push(["record_modified", "number"]);
            meta.schema_object["index"] = [count + 1, "string"];
            meta.schema_object["record_created"] = [count + 2, "number"];
            meta.schema_object["record_modified"] = [index + 3, "number"];
            meta.count_column = count + 3;
            if (returned === true) {
                return table;
            }
            database.store[name] = table;
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
            get_by_id: get_by_id,
            get_quantity: get_quantity,
            object_convert: object_convert,
            record_create: record_create,
            record_delete: record_delete,
            record_validate: record_validate,
            store: {},
            table_create: table_create,
            table_delete: table_delete,
            table_get: table_get,
            table_list: table_list
        };
    return database;
};

export default database;