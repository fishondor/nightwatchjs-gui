<template>
    <v-container>
        <v-row dense>
            <v-col cols="6">
                <RunTestsForm @onSubmit="onTestFormSubmit" :loading="loading"/>
            </v-col>
            <v-col cols="6">
                <v-card
                    elevation="2"
                >
                    <v-card-title>
                        Results
                    </v-card-title>

                    <v-card-text class="pa-3">
                      <pre class="test-results-output" v-html="testsResults"></pre>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import RunTestsForm from '@/components/RunTestsForm';

export default {
  name: 'Home',
  components: {
    RunTestsForm
  },
  data: () => ({
    testsResults: "No tests results to show",
    loading: false
  }),
  created(){
    this.getTestGroups();
    this.getTestsEnvironments();
    this.getVariablesEnvironments();
    this.getTests();
  },
  methods: {
    getTestGroups: async function(){
      let groups = await this.$serverService.getTestGroups();
      this.$store.commit('setTestGroups', groups);
    },
    getTests: async function(){
      let tests = await this.$serverService.getTests();
      this.$store.commit('setTests', tests);
    },
    getTestsEnvironments: async function(){
      let testsEnvironments = await this.$serverService.getTestsEnvironments();
      this.$store.commit('setTestsEnvironments', testsEnvironments);
    },
    getVariablesEnvironments: async function(){
      let variablesEnvironments = await this.$serverService.getVariablesEnvironments();
      this.$store.commit('setVariablesEnvironments', variablesEnvironments);
    },
    onTestFormSubmit: async function(value){
      this.loading = true;
      switch (value.runType) {
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

<style lang="scss" scoped>
.test-results-output{
  background-color: black;
  color: white;
  overflow: auto;
}
</style>