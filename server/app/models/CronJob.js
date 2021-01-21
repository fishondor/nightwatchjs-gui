const axios = require('axios');

const TestModel = require('./Test');

const Environment = require('../providers/Environment')();

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
        let context = this;
        return async function(callback){
            let results = await axios.post(`http://localhost:${Environment.SERVER_PORT}/api/run-test`,
                {test: context.test}
            );
            callback(results, context);
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