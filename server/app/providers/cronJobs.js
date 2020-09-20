var CronJobManager = require('cron-job-manager');

const DBService = require('./Database');
const CronJobModel = require('../models/CronJob');
const Logger = require('./Logger');

const {
    DB_FILE_PATH,
    CRONJOB_CALLBACK
} = require('./Environment')();

class CronJobsService{

    constructor(){
        this.logger = new Logger("CronJobs service");
        this.cronJobManager = new CronJobManager();
        this.db = new DBService(`${DB_FILE_PATH}/cron_jobs.db`);
    }

    async registerJob(doc){
        try{
            let newDoc = await this.db.insert(doc);
            if(!newDoc){
                this.logger.error(`Invalid response in register job to DB: ${newDoc}`);
                return false;
            }
            this.logger.info(`Successfully registered job`, newDoc);
    
            return newDoc;
        }catch(err){
            this.logger.error(`Error registering job to DB. Error: ${err}`);
            return false;
        }
    }

    async getRegisteredJobs(){
        try{
            let jobs = await this.db.getAll();
            if(!jobs){
                this.logger.error(`Invalid response from get all jobs: ${jobs}`);
                return false;
            }
            return jobs.map(job => CronJobModel.fromJSON(job));
        }catch(err){
            this.logger.error(`Error getting all jobs. Error: ${err}`);
            return false;
        }
    }

    async deleteJob(jobId){
        if(this.cronJobManager.exists(jobId))
            this.cronJobManager.deleteJob(jobId);
        try{
            let result = await this.db.delete(jobId);
            if(!result){
                this.logger.error(`No jobs were deleted`, jobId);
                return false;
            }
            return result;
        }catch(err){
            this.logger.error(`Cannot delete job from DB:`, jobId, err);
            return false;
        }
    }

    addJob(job){
        if(this.cronJobManager.exists(job._id))
            throw new Error(`Job ${job._id} already registered`);
        let logger = this.logger;
        this.cronJobManager.add(
            job._id,
            job.expression,
            job.cronExecuteFunction,
            {
                start: false, 
                onComplete: CRONJOB_CALLBACK || function(results, cronjob){
                    logger.info(`Cronjob ${cronjob._id} is complete`, `Results: ${results}`, `Cronjob: ${JSON.stringify(cronjob)}`);
                }, 
            }
        );

        return this.cronJobManager.listCrons();
    }

    async initRegisteredJobs(){
        try{
            let registeredJobs = await this.getRegisteredJobs();
            registeredJobs.map(
                job => {
                    this.addJob(job);
                    if(job.running){
                        let running = this.jobActions.start(job._id);
                        if(!running){
                            this.logger.error(`Job ${job._id} did not start properly`);
                        }
                    }
                }
            )
        }catch(error){
            this.logger.error("Error instantiating jobs")
        }
    }

    async updateJob(id, updateObject){
        try{
            let updated = await this.db.update(id, updateObject);
            if(!updated){
                this.logger.error(`Cannot update job`, job, updateObject);
                return false;
            }
            return updated;
        }catch(err){
            this.logger.error(`Error updating job: ${err}`);
            return false;
        }
    }

    isJobRunning(id){
        let manager = this.cronJobManager;
        if(!manager.jobs || !manager.jobs[id])
            return false;
        let running = manager.jobs[id].running;
        return running;
    }

    get jobActions(){ return {
        stop: async (jobId) => {
            this.cronJobManager.stop(jobId);

            let status = this.isJobRunning(jobId);

            if(!status){
                let updatedDoc = await this.updateJob(jobId, {running: false});
                if(!updatedDoc)
                    this.logger.error("Error updating job status running to false");
            }

            return {running: status};
        },
        start: async (jobId) => {
            this.cronJobManager.start(jobId);

            let status = this.isJobRunning(jobId);

            if(status){
                let updatedDoc = await this.updateJob(jobId, {running: true});
                if(!updatedDoc)
                    this.logger.error("Error updating job status running to true");
            }

            return {running: status};
        }
    }}

}

const cronJobsService = new CronJobsService();

const api = {
    getJobs: async (req, res) => {
        try{
            let jobs = await cronJobsService.getRegisteredJobs();
            if(!jobs){
                res.sendStatus(500);
                return;
            }
            res.json({jobs: jobs});
        }catch(err){
            res.sendStatus(500);
        }
    },

    registerJob: async (req, res) => {
        let job = req.body.cronjob;
        let cronJobObject = CronJobModel.fromJSON(job);
        try{
            let newDoc = await cronJobsService.registerJob(cronJobObject);
            if(!newDoc){
                res.sendStatus(500);
                return;
            }

            let registeredCronjob = CronJobModel.fromJSON(newDoc);
            cronJobsService.addJob(registeredCronjob);
            cronJobsService.jobActions.start(registeredCronjob._id);
    
            let updated = await cronJobsService.updateJob(registeredCronjob._id, {running: true});

            res.json({job: updated});
        }catch(err){
            res.sendStatus(500);
        }
    },

    deleteJob: async (req, res) => {
        let jobId = req.params.id;
        try{
            let response = await cronJobsService.deleteJob(jobId);
            if(!response){
                res.sendStatus(500);
                return;
            }
            res.json(response);
        }catch(err){
            res.sendStatus(500);
        }
    },

    jobActions: async (req, res) => {
        let action = req.params.action;
        let jobId = req.params.id;
        try{
            let response = await cronJobsService.jobActions[action](jobId);
            if(!response){
                res.sendStatus(500);
                return;
            }
            res.json(response);
        }catch(err){
            res.sendStatus(500);
        }
    }
}

cronJobsService.initRegisteredJobs();

module.exports = api
