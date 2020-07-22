const sqlite3 = require('sqlite3');

const Logger = require('./Logger');

class DbService{

    constructor(){
        this.logger = new Logger("Database service");
    }

    setDbPath(path){
        this.path = path;
    }

    connect(){
        if(!this.path)
            throw new Error('DB path not defined. Please init the service with setDbPath');
        return new Promise(
            (resolve, reject) => {
                this.db = new sqlite3.Database(this.path, 
                    err => {
                        if(err){
                            this.logger.error(`Cannot connect to DB. Error: ${err}`);
                            reject();
                            return;
                        }
                        resolve();
                        this.logger.info("Connected to database");
                    }
                );
            }
        )
    }

    close(){
        return new Promise(
            (resolve, reject) => {
                this.db.close((err) => {
                    if (err) {
                      this.logger.error(err.message);
                      reject();
                    }
                    resolve();
                    this.logger.info('Closed database connection.');
                });
            }
        )
    }

    createTableCommand(tableName, tableSchemna){
        return new Promise(
            (resolve, reject) => {
                this.db.run(
                    `CREATE TABLE IF NOT EXISTS ${tableName}(${tableSchemna})`,
                    (err)=> {
                        if(err){
                            this.logger.error(`Can not create table. Error: ${err}`)
                            reject();
                            return;
                        }
                        resolve();
                        this.logger.info(`Table ${tableName} instantiated successfully`)
                    }
                )
            }
        )
    }

    async createTable(tableName, tableSchemna){
        await this.connect();
        await this.createTableCommand(tableName, tableSchemna);
        await this.close();
    }

    insert(tableSchemna, values){
        this.connect();
        let context = this;
        return new Promise(
            (resolve, reject) => {
                this.db.run(`INSERT INTO ${tableSchemna} VALUES(${values.map(() => '?').join(',')})`, values,
                    function(err){
                        if(err){
                            context.logger.error(`Can not insert values into DB. Error: ${err}`)
                            reject();
                            return;
                        }
                        resolve(this.lastID);
                    }
                );
                this.close();
            }
        )
    }

    getAll(tableName){
        this.connect();
        return new Promise(
            (resolve, reject) => {
                this.db.all(`SELECT * FROM ${tableName}`, [],
                    (err, rows) => {
                        if(err){
                            this.logger.error(`Can not get rows from table ${tableName}. Error: ${err}`)
                            reject();
                            return;
                        }
                        resolve(rows);
                    }
                );
                this.close();
            }
        )
    }

    delete(tableName, condition){
        this.connect();
        let context = this;
        return new Promise(
            (resolve, reject) => {
                this.db.run(`DELETE FROM ${tableName} WHERE ${condition.name}${condition.operator}?`, condition.value,
                    function(err){
                        if(err){
                            context.logger.error(`Can not delete from ${tableName} by ${condition.name}${condition.operator}${condition.value}. Error: ${err}`)
                            reject();
                            return;
                        }
                        resolve(this.changes);
                    }
                );
                this.close();
            }
        )
    }
}

let dbService = new DbService();

module.exports = dbService;