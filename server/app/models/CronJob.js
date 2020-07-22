const dbTableSchema = `job_id INTEGER PRIMARY KEY,
expression TEXT NOT NULL,
command TEXT NOT NULL,
title TEXT,
notifyEmail TEXT`;

const dbTableName = 'jobs'

class NWCronJob{

    static get dbTableSchema(){return dbTableSchema}

    static get dbTableName(){return dbTableName}

    constructor(expression, command, title = '', notifyEmail = []){
        if(!expression)
            throw new Error('cron expression is not defined');
        if(!command)
            throw new Error('command is not defined');

        this.expression = expression;
        this.command = command;
        this.title = title;
        this.notifyEmail = notifyEmail;
    }

    getDBInsertSchema(){
        return `${NWCronJob.dbTableName}(expression, command, title, notifyEmail)`;
    }

    getDBValuesArray(){
        return [
            this.expression,
            this.command,
            this.title,
            this.notifyEmail
        ]
    }

}

module.exports = NWCronJob;