<template>
    <v-container>
        <v-row dense>
            <v-col cols="6">
                <RunTestsForm @onSubmit="onTestFormSubmit" :loading="loading" :runType="type"/>
            </v-col>
            <v-col cols="6">
                <v-card
                    elevation="2"
                >
                    <v-card-title>
                        Results
                    </v-card-title>

                    <v-card-text class="pa-3">
                        <CommandlineOutput :output="testsResults" />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import RunTestsForm from '@/views/components/RunTestsForm';
import CommandlineOutput from '@/views/components/CommandlineOutput';

export default {
    name: 'TestsDashboard',
    components: {
        RunTestsForm,
        CommandlineOutput
    },
    data: () => ({
        testsResults: "No tests results to show",
        loading: false
    }),
    props: {
        type: null
    },
    methods: {
        onTestFormSubmit: async function(value){
            this.loading = true;
            switch (this.type) {
                case 'single':
                await this.runSingleTest(
                    value.selectedTest, 
                    value.selectedEnvironments, 
                    value.selectedVariablesEnvironments
                )
                break;
                case 'group':
                await this.runTestGroup(
                    value.selectedTestGroups, 
                    value.selectedEnvironments, 
                    value.selectedVariablesEnvironments
                )
                break;
            }
            this.loading = false;
        },
        runSingleTest: async function(test, environments, variablesEnvironment){
            let response = await this.$serverService.runTest(
                test, 
                environments, 
                variablesEnvironment
            );
            this.testsResults = response;
            return;
        },
        runTestGroup: async function(groups, environments, variablesEnvironment){
            let response = await this.$serverService.runTestGroup(
                groups, 
                environments, 
                variablesEnvironment
            );
            this.testsResults = response;
            return;
        }
    }
}
</script>