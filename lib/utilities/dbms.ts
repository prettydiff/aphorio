
const database_create = function database_create(name:string):void {
        const table_create = function table_create(name:string, schema:[string, type_table_schema][]):void {
                const meta:table_meta = {
                        count_column: 1n,
                        count_record: 0n,
                        index: 0n,
                        name: name,
                        schema: {}
                    },
                    len_schema:number = schema.length,
                    db:database = this;
                let index:number = 0;
                do {
                    meta.schema[schema[index][0]] = [index + 1, schema[index][1]];
                    meta.count_column = meta.count_column + 1n;
                    index = index + 1;
                } while (index < len_schema);
                db.store[name] = {
                    meta: meta,
                    record_create: function record_create():void {}
                };
            },
            table_delete = function table_delete(name:string):void {
                delete this.store[name];
            },
            table_get = function table_get(name:string):table {
                return this.store[name];
            },
            table_list = function table_list():string[] {
                return Object.keys(this.store).sort();
            },
            table_stats = function table_stats(name:string):table_stats {
                const stats:table_stats = {};
                return stats;
            },
            database:database = {
                table_create: table_create,
                table_delete: table_delete,
                table_get: table_get,
                table_list: table_list,
                table_stats: table_stats,
                meta: {
                    created: Date.now(),
                    modified: Date.now(),
                    name: name,
                    table_count: 0,
                    table_last_modified: null
                },
                store: {}
            };
        dbms.store[name] = database;
    },
    database_delete = function database_delete(name:string):void {
        delete dbms.store[name];
    },
    database_get = function database_get(name:string):database {
        return dbms.store[name];
    },
    database_list = function database_list():string[] {
        return Object.keys(dbms.store).sort();
    },
    database_stats = function database_stats(name:string):database_stats {
        const stats:database_stats = {};
        return stats;
    },
    dbms:dbms = {
        database_create: database_create,
        database_delete: database_delete,
        database_get: database_get,
        database_list: database_list,
        database_stats: database_stats,
        store: {}
    };

export default dbms;