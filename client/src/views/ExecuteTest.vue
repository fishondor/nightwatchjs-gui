<template>
    <div class="execute-test-main">
        <Dashboard :output="command">
            <FormTests @onUpdate="onTestUpdated" @onTestResults="setTestResults" />
        </Dashboard>
    </div>
</template>

<script>
import FormTests from '@/views/components/FormTests';
import Dashboard from './layouts/Dashboard';

export default {
    name: 'ExecuteTest',
    components: {
        FormTests,
        Dashboard
    },
    data: () => ({
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
        }
    }
}
</script>

<style scoped>
.execute-test-main{
    height: 100%;
    width: 100%;
}
</style>