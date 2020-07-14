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

    async runTest(test, environments, variablesEnvironment){
        try{
            let response = await axios.post('/api/run-test', {
                test: test,
                environments: environments,
                variablesEnvironment: variablesEnvironment
            });
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