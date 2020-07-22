var CronJobManager = require('cron-job-manager');

const db = require('./Database');
const CronJobModel = require('../models/CronJob');
const TestModel = require('../models/Test');
const Logger = require('./Logger');

const {
    executeCommand
} = require('./utils');

const logger = new Logger("CronJobs service");

const cronJobManager = new CronJobManager();

const TESTS_ROOT_DIRECTORY = __dirname + '/../../../../';
const DB_DIRECTORY = `${TESTS_ROOT_DIRECTORY}nightwatchjs-gui-cron`;
const DB_FILE = `${DB_DIRECTORY}/cron_jobs.db`;
const JOB_NAME_PREFIX = 'job_';


const initJob = (job) => {
    cronJobManager.add(
        `${JOB_NAME_PREFIX}${job.job_id}`,
        job.expression,
        TestModel.cronCommandFunction(job.command),
        {
            start: true, 
            onComplete: TestModel.cronCommandCompleteFunction
        }
    )
}

const deleteJob = async (job) => {
    try{
        let result = await db.delete(CronJobModel.dbTableName, {name: 'job_id', operator: '=', value: job.job_id});
        if(!result){
            logger.error(`No jobs were deleted`, job.job_id);
            return false;
        }
        return result;
    }catch(err){
        logger.error(`Cannot delete job from DB:`, job, err);
        return false;
    }
}

const initRegisteredJobs = async () => {
    let registerdJobs = await db.getAll(CronJobModel.dbTableName);
    console.log("jobs", registerdJobs);
    registerdJobs.map(
        job => {
            initJob(job)
        }
    );
}

db.setDbPath(DB_FILE);
db.createTable(CronJobModel.dbTableName, CronJobModel.dbTableSchema)
    .then(
        () => {
            initRegisteredJobs();
        }
    );

const registerJob = async (schema, values) => {
    try{
        let id = await db.insert(schema, values);
        if(!id){
            logger.error(`Invalid response in register job to DB: ${id}`);
            return false;
        }
        logger.info(`Successfully registered job ${id}`);

        return id;
    }catch(err){
        logger.error(`Error registering job to DB. Error: ${err}`);
        return false;
    }
}

const getRegisteredJobs = async () => {
    try{
        let jobs = await db.getAll(CronJobModel.dbTableName);
        if(!jobs){
            logger.error(`Invalid response from get all jobs: ${jobs}`);
            return false;
        }
        return jobs;
    }catch(err){
        logger.error(`Error registering job to DB. Error: ${err}`);
        return false;
    }
}

const setJobsStatuses = (jobs) => {
    let registeredJobs = cronJobManager.jobs;
    return jobs.map(
        job => {
            let job_id = `${JOB_NAME_PREFIX}${job.job_id}`;
            job['running'] = registeredJobs[job_id] ? registeredJobs[job_id].running : false;
            return job
        }
    );
}

const jobActions = {
    stop: async (job) => {
        cronJobManager.stop(`${JOB_NAME_PREFIX}${job.job_id}`);
        logger.info(`Stoped job: ${job.job_id}`);
        return {running: false};
    },
    start: async (job) => {
        cronJobManager.start(`${JOB_NAME_PREFIX}${job.job_id}`);
        logger.info(`Started job: ${job.job_id}`);
        return {running: true};
    },
    delete: async (job) => {
        await deleteJob(job);
        await this.stop(job);
        return true;
    }
}

const api = {
    getJobs: async (req, res) => {
        try{
            let jobs = await getRegisteredJobs();
            if(!jobs){
                res.sendStatus(500);
                return;
            }
            let jobsWithStatuses = setJobsStatuses(jobs);
            console.log("jobs", jobsWithStatuses);
            res.json({jobs: jobsWithStatuses});
        }catch(err){
            res.sendStatus(500);
        }
    },

    registerJob: async (req, res) => {
        let job = req.body;
        let test = new TestModel(job.test.type, job.test);
        let cronJobObject = new CronJobModel(
            job.expression, 
            test.getCommand(),
            job.title,
            job.notifyEmail
        );
        try{
            let id = await registerJob(cronJobObject.getDBInsertSchema(), cronJobObject.getDBValuesArray());
            if(!id){
                res.sendStatus(500);
                return;
            }
            res.json({jobID: id});
        }catch(err){
            res.sendStatus(500);
        }
    },

    jobActions: async (req, res) => {
        let job = req.body;
        let action = req.params.action;
        console.log("Param", action);
        try{
            let response = await jobActions[action](job);
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

module.exports = api
