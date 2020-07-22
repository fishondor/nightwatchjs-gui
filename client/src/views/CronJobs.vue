<template>
    <v-layout class="fill-height">
        <router-view />
        <v-btn
            v-show="!hidden"
            fixed
            dark
            fab
            bottom
            right
            color="pink"
            >
            <router-link to="/new" append><v-icon>mdi-plus</v-icon></router-link>
        </v-btn>
    </v-layout>
</template>

<script>

export default {
    created(){
        this.getCronJobs();
    },
    computed: {
        hidden() {
            return this.$route.path != '/new';
        }
    },
    methods: {
        getCronJobs: async function(){
          let response = await this.$serverService.getCronJobs();
          this.$store.commit('setTestsCronJobs', response.jobs);
        },
        registerCron: async function(){
          //let response = await this.$serverService.registerTestCronJob();
          let response = await this.$serverService.getCronJobs();
          console.log(response);
        }
    }
}
</script>