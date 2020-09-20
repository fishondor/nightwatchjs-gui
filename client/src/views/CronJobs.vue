<template>
    <v-layout class="fill-height">
        <router-view />
    </v-layout>
</template>

<script>

export default {
    created(){
        this.getCronJobs();
    },
    methods: {
        getCronJobs: async function(){
          let jobs = await this.$serverService.getCronJobs();
          this.$store.commit('setTestsCronJobs', jobs);
        }
    }
}
</script>