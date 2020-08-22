/* const {
    executeCommand
} = require('../providers/utils'); */
const TestModel = require('./Test');

class NWCronJob{

    constructor(expression, test, title = '', options = {}){
        if(!expression)
            throw new Error('cron expression is not defined');
        if(!test)
            throw new Error('command is not defined');

        this.expression = expression;
        this.test = test;
        this.title = title;
        this.tags = options.tags;
        this._id = options.id;
        this.running = options.running;
    }

    get cronExecuteFunction(){
        let testCommand = this.test.getCommand();
        let context = this;
        return async function(callback){
            //let results = await executeCommand(testCommand);
            let results = "The command result, will execute command: " + testCommand;
            callback(results, context);
        }
    }

    get callbackFunction(){
        let title = this.title;
        let tags = this.tags;
        return function(results){
            console.log("Job finished");
            console.log("Results", results);
            console.log("Tags", tags);
            console.log("Job title", title);
        }
    }

    static fromJSON(cronjobJSON){
        return new NWCronJob(
            cronjobJSON.expression,
            TestModel.fromJSON(cronjobJSON.test),
            cronjobJSON.title,
            {
                tags: cronjobJSON.tags,
                id: cronjobJSON._id,
                running: cronjobJSON.running
            }
        )
    }

}

module.exports = NWCronJob;