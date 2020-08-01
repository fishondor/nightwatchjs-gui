<template>
    <v-container fluid class="new-cron-job-main">
        <Dashboard :output="command">
            <h3>Set cron job</h3>
            <FormCronJob @onSubmit="onCronSubmit"/>
            <h3>Set Test</h3>
            <FormTests @onUpdate="onTestUpdated" @onTestResults="setTestResults" />
        </Dashboard>
    </v-container>
</template>

<script>
import FormTests from './components/FormTests';
import FormCronJob from './components/FormCronJob';
import Dashboard from './layouts/Dashboard';

import CronJob from '../../../shared/CronJob';

export default {
    components: {
        FormTests,
        FormCronJob,
        Dashboard
    },
    data: () => ({
        testPath: '',
        testEnvironments: '',
        test: {},
        command: 'No valid command available yet'
    }),
    methods: {
        onTestUpdated: function(test){
            if(test){
                this.test = test;
                this.command = this.test.getCommand();
            }else{
                this.command = 'No valid command available yet'
            }
        },
        setTestResults: function(result){
            this.command = result;
        },
        onCronSubmit: async function(values){
            let cronjob = new CronJob(values.expression, this.test, values.title, {notifyEmail: values.notifyEmail});
            let response = await this.$serverService.registerTestCronJob(cronjob);
            if(response)
                this.$notificationsService.success(`Cron Job ${response.job.title} was registered and activated`);
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