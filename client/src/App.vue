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
    <Notification />
    <Loader />
  </v-app>
</template>

<script>
import NavigationDrawer from '@/views/components/NavigationDrawer';
import AppBar from '@/views/components/AppBar';
import Notification from '@/views/components/Notification';
import Loader from './views/components/Loader';

export default {
    name: 'App',

    components: {
      NavigationDrawer,
      AppBar,
      Notification,
      Loader
    },

    data: () => ({
      //
    }),
    created(){
        this.getTestGroups();
        this.getTestsEnvironments();
        this.getTests();
        this.getTestsList();
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
        getTestsList: async function(){
          let tests = await this.$serverService.getTestsList();
          this.$store.commit('setTestsList', tests)
        },
        getTestsEnvironments: async function(){
          let testsEnvironments = await this.$serverService.getTestsEnvironments();
          this.$store.commit('setTestsEnvironments', testsEnvironments);
        }
    }
};
</script>

<style lang="scss" scoped>
.app-main{
  height: 100vh;
}
</style>
