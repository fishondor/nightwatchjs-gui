<template>
    <v-layout child-flex>
        <v-data-table
            :headers="headers"
            :items="reports"
            item-key="_id"
        >
        </v-data-table>
    </v-layout>
</template>

<script>

export default {
    data () {
        return {
            headers: [
                { text: 'ID', value: '_id' },
                { text: 'Executed', value: 'createdAt' }
            ],
            reports: []
        }
    },
    created(){
        this.getReports();
    },
    methods: {
        onItemSelected(item){
            console.log("Selected", item);
        },
        async getReports(){
            let data = await this.$serverService.getLogFilesList();
            console.log("Reports", data.reports);
            this.reports = data.reports;
        },
    }
}
</script>