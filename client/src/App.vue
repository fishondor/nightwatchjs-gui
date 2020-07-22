<template>
  <v-app>
    <NavigationDrawer />
    <AppBar />
    <v-main class="app-main">
        <router-view/>
    </v-main>
    <v-footer app dark>
        <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import NavigationDrawer from '@/views/components/NavigationDrawer';
import AppBar from '@/views/components/AppBar';

export default {
    name: 'App',

    components: {
      NavigationDrawer,
      AppBar
    },

    data: () => ({
      //
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
        }
    }
};
</script>

<style lang="scss" scoped>
.app-main{
  height: 100vh;
}
</style>
