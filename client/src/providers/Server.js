import Vue from 'vue';
import axios from 'axios';

import CronJob from '../../../shared/CronJob';

class ServerService{

    init(logger){
        this.logger = logger;
    }

    async getData(route, errorMessage){
        try{
            let response = await axios.get(`/api/${route}`);
            if(response.status != 200){
                this.logger.error(errorMessage, response.status, response.data || "");
            }
            return response.data;
        }catch(error){
            this.logger.error(error);
            return false;
        }
    }

    async postData(route, data, errorMessage){
        try{
            let response = await axios.post(`/api/${route}`, data);
            if(response.status != 200){
                this.logger.error(errorMessage, response.status, response.data || "");
            }
            return response.data;
        }catch(error){
            this.logger.error(error);
            return false;
        }
    }

    getTestGroups(){
        return this.getData('groups', "Could not get test groups");
    }

    getTests(){
        return this.getData('tests', "Could not get tests");
    }

    getTestsEnvironments(){
        return this.getData('tests-environments', "Could not get tests environments");
    }

    runTest(test){
        return this.postData('run-test', {test: test}, "Could not run test");
    }

    registerTestCronJob(cron){
        return this.postData('job', {cronjob: cron}, "Could not register cron job");
    }

    async getCronJobs(){
        let data = await this.getData('jobs', 'Could not get cron jobs');
        return data.jobs.map(job => CronJob.fromJSON(job));
    }

    stopCronJob(jobId){
        return this.getData(`job/stop/${jobId}`, "Could not stop cron job");
    }

    startCronJob(jobId){
        return this.getData(`job/start/${jobId}`, "Could not start cron job");
    }

    deleteCronJob(job){
        return this.getData(`job/${job._id}`, "Could not delete cron job");
    }

}

const serverService = new ServerService();

Vue.mixin({
    beforeCreate(){
        const options = this.$options;
        if(options.serverService)
            this.$serverService = options.serverService;
        else if(options.parent && options.parent.$serverService)
            this.$serverService = options.parent.$serverService;
    }
});

export {
    serverService,
    ServerService
};