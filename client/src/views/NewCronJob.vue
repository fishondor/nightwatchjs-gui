<template>
    <v-container fluid class="new-cron-job-main">
        <Dashboard :output="command">
            <h3>Set cron job</h3>
            <FormCronJob />
            <h3>Set Test</h3>
            <FormTests @onUpdate="onTestUpdated" @onTestResults="setTestResults" />
        </Dashboard>
    </v-container>
</template>

<script>
import FormTests from './components/FormTests';
import FormCronJob from './components/FormCronJob';
import Dashboard from './layouts/Dashboard';

import {
    createTestCommand
} from '../providers/Utils'

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
        command: 'No output yet'
    }),
    methods: {
        onTestUpdated: function(testValues){
            this.test = testValues;
            this.command = createTestCommand(this.test);
        },
        setTestResults: function(result){
            this.command = result;
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