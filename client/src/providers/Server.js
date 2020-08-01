import Vue from 'vue';
import axios from 'axios';

import CronJob from '../../../shared/CronJob';

class ServerService{

    init(logger){
        this.logger = logger;
    }

    async getTestGroups(){
        try{
            let response = await axios.get(`/api/groups`);
            if(response.status != 200){
                this.logger.error("Could not get test groups: ", response.status, response.data || "");
            }
            return response.data;
        }catch(error){
            this.logger.error(error);
            return false;
        }
    }

    async getTests(){
        try{
            let response = await axios.get('/api/tests');
            if(response.status != 200){
                this.logger.error("Could not get tests: ", response.status, response.data || "");
            }
            return response.data;
        }catch(error){
            this.logger.error(error);
            return false;
        }
    }

    async getTestsEnvironments(){
        try{
            let response = await axios.get('/api/tests-environments');
            if(response.status != 200){
                this.logger.error("Could not get tests environments: ", response.status, response.data || "");
            }
            return response.data;
        }catch(error){
            this.logger.error(error);
            return false;
        }
    }

    async runTest(test){
        try{
            let response = await axios.post('/api/run-test', {test: test});
            if(response.status != 200){
                this.logger.error("Could not run test: ", response.status, response.data || "");
            }
            return response.data;
        }catch(error){
            this.logger.error(error);
            return false;
        }
    }

    async registerTestCronJob(cron){
        try{
            let response = await axios.post(`/api/job`, {cronjob: cron});
            if(response.status != 200){
                this.logger.error("Could not register cron job: ", response.status, response.data || "");
            }
            return response.data;
        }catch(error){
            this.logger.error(error);
            return false;
        }
    }

    async getCronJobs(){
        try{
            let response = await axios.get('/api/jobs');
            if(response.status != 200){
                this.logger.error("Could not get cron jobs: ", response.status, response.data || "");
            }
            return response.data.jobs.map(job => CronJob.fromJSON(job));
        }catch(error){
            this.logger.error(error);
            return false;
        }
    }

    async stopCronJob(jobId){
        try{
            let response = await axios.get(`/api/job/stop/${jobId}`);
            if(response.status != 200){
                this.logger.error("Could not stop cron job: ", response.status, response.data || "");
            }
            return response.data;
        }catch(error){
            this.logger.error(error);
            return false;
        }
    }

    async startCronJob(jobId){
        try{
            let response = await axios.get(`/api/job/start/${jobId}`);
            if(response.status != 200){
                this.logger.error("Could not start cron job: ", response.status, response.data || "");
            }
            return response.data;
        }catch(error){
            this.logger.error(error);
            return false;
        }
    }

    async deleteCronJob(job){
        try{
            let response = await axios.delete(`/api/job/${job._id}`);
            if(response.status != 200){
                this.logger.error("Could not delete cron job: ", response.status, response.data || "");
            }
            return response.data;
        }catch(error){
            this.logger.error(error);
            return false;
        }
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