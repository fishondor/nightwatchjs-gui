import Test from './Test';

class CronJob{

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

    static fromJSON(cronjobJSON){
        return new CronJob(
            cronjobJSON.expression,
            Test.fromJSON(cronjobJSON.test),
            cronjobJSON.title,
            {
                tags: cronjobJSON.tags,
                id: cronjobJSON._id,
                running: cronjobJSON.running
            }
        )
    }

}

export default CronJob;