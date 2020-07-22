import Vue from 'vue';
import axios from 'axios';

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
            console.error(error);
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
            console.error(error);
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
            console.error(error);
            return false;
        }
    }

    async getVariablesEnvironments(){
        try{
            let response = await axios.get('/api/variables-environments');
            if(response.status != 200){
                this.logger.error("Could not get variables environments: ", response.status, response.data || "");
            }
            return response.data;
        }catch(error){
            console.error(error);
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
            console.error(error);
            return false;
        }
    }

    async runTestGroup(groups, environments, variablesEnvironment){
        try{
            let response = await axios.post('/api/run-test-group', {
                groups: groups,
                environments: environments,
                variablesEnvironment: variablesEnvironment
            });
            if(response.status != 200){
                this.logger.error("Could not run test group: ", response.status, response.data || "");
            }
            return response.data;
        }catch(error){
            console.error(error);
            return false;
        }
    }

    async registerTestCronJob(){
        let test = {
            type: 'groups',
            tests: ['wisestamp/features'],
            environments: ['selenium.chrome', 'selenium.firefox'],
            args: {
                environmentVariables: {
                    TESTS_ENV: 'wisestamp.qa'
                }
            }
        }
        try{
            let response = await axios.post(`/api/job`, {
                expression: '0/4 * * * * *',
                test: test,
                title: 'Wisestamp features 2',
                notifyEmail: 'ariel@vcita.com'
            });
            if(response.status != 200){
                this.logger.error("Could not register cron job: ", response.status, response.data || "");
            }
            return response.data;
        }catch(error){
            console.error(error);
            return false;
        }
    }

    async getCronJobs(){
        try{
            let response = await axios.get('/api/jobs');
            if(response.status != 200){
                this.logger.error("Could not get cron jobs: ", response.status, response.data || "");
            }
            return response.data;
        }catch(error){
            console.error(error);
            return false;
        }
    }

    async stopCronJob(job){
        try{
            let response = await axios.post('/api/job/stop', job);
            if(response.status != 200){
                this.logger.error("Could not stop cron job: ", response.status, response.data || "");
            }
            return response.data;
        }catch(error){
            console.error(error);
            return false;
        }
    }

    async startCronJob(job){
        try{
            let response = await axios.post('/api/job/start', job);
            if(response.status != 200){
                this.logger.error("Could not start cron job: ", response.status, response.data || "");
            }
            return response.data;
        }catch(error){
            console.error(error);
            return false;
        }
    }

    async deleteCronJob(job){
        console.log("deleting job", job);
        try{
            let response = await axios.post('/api/job/delete', job);
            if(response.status != 200){
                this.logger.error("Could not delete cron job: ", response.status, response.data || "");
            }
            return response.data;
        }catch(error){
            console.error(error);
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