<template>
    <div class="new-cron-job-main">
        <Dashboard :output="command">
            <v-stepper
                v-model="e1">
                <v-stepper-header>
                    <template>
                        <v-stepper-step
                            :key="`1-step`"
                            :complete="e1 > 1"
                            :step="1"
                            :editable="false">
                            Select the test or test group to run
                        </v-stepper-step>
                        <v-stepper-step
                            :key="`2-step`"
                            :complete="e1 > 2"
                            :step="2"
                            :editable="false">
                            Set cronjob
                        </v-stepper-step>
                    </template>
                </v-stepper-header>

                <v-stepper-items>
                    <v-stepper-content
                        :step="1"
                    >
                        <FormTests @onUpdate="onTestUpdated" @onTestResults="setTestResults" />

                        <v-btn
                            :disabled="!test || !test.isValid()"
                            color="primary"
                            @click="e1 = 2">
                            Continue
                        </v-btn>
                    </v-stepper-content>
                </v-stepper-items>
                <v-stepper-items>
                    <v-stepper-content
                        :step="2"
                    >
                        <FormCronJob @onUpdate="onCronUpdated"/>

                        <v-btn
                            :disabled="!cron"
                            color="primary"
                            @click="onCronSubmit">
                            Save and activate
                        </v-btn>

                        <v-btn text
                            @click="e1 = 1">
                            Back    
                        </v-btn>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </Dashboard>
    </div>
</template>

<script>
import FormTests from './components/FormTests';
import FormCronJob from './components/FormCronJob';
import Dashboard from './layouts/Dashboard';

import CronJob from '../models/CronJob';

export default {
    components: {
        FormTests,
        FormCronJob,
        Dashboard
    },
    data: () => ({
        testPath: '',
        testEnvironments: '',
        test: false,
        cron: false,
        command: 'No valid command available yet',
        e1: 1
    }),
    methods: {
        onTestUpdated: async function(test){
            this.test = test;
            if(!this.test){
                this.command = 'No valid command available yet';
                return;
            }
            let command = await this.$serverService.getTestCommand(this.test);
            this.command = command;
        },
        onCronUpdated: function(cron){
            this.cron = cron;
        },
        setTestResults: function(result){
            this.command = result;
        },
        onCronSubmit: async function(){
            let cronjob = new CronJob(this.cron.expression, this.test, this.cron.title, {tags: this.cron.tags});
            let response = await this.$serverService.registerTestCronJob(cronjob);
            if(response){
                this.$notificationsService.success(`Cron Job ${response.job.title} was registered and activated`);
                this.$store.commit('addCronjob', CronJob.fromJSON(response.job));
                this.$router.push({ name: 'cronJobs' });
            }
            else
                this.$notificationsService.error("Could not register item. Please refer to logs for more information");
        }
    }
}
</script>

<style scoped>
.new-cron-job-main{
    height: 100%;
    width: 100%;
}
</style>