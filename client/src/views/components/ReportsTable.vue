<template>
    <v-layout child-flex>
        <v-data-table
            :headers="headers"
            :items="reports"
            :sort-by="['createdAt']"
            item-key="_id"
            @click:row="viewItem"
        >
        <template v-slot:item.createdAt="{ item }">
            {{formatDate(item.createdAt)}}
        </template>
        <template v-slot:item.report.modules="{ item }">
            <v-chip v-for="(test, key) in item.report.modules" 
                :key="key" 
                class="mr-1"
                small
                :color="testColor(test)">
                {{key}}
            </v-chip>
        </template>
        </v-data-table>
    </v-layout>
</template>

<script>
import { format } from 'date-fns';

const dateFormat = "MMM do yy H:m";

export default {
    data () {
        return {
            headers: [
                { text: 'Executed', value: 'createdAt' },
                { text: 'Modules', value: 'report.modules' },
                { text: 'Passed', value: 'report.passed' },
                { text: 'Failed', value: 'report.failed' },
                { text: 'Errors', value: 'report.errors' }
            ],
            reports: []
        }
    },
    created(){
        this.getReports();
    },
    methods: {
        async getReports(){
            let data = await this.$serverService.getLogFilesList();
            this.reports = data.reports;
        },
        formatDate(dateString){
            let date = new Date(dateString);
            return format(date, dateFormat);
        },
        testColor(test){
            return test.failedCount == 0 && test.errorsCount == 0 ? 'success' : 'warning'
        },
        viewItem(item){
            this.$router.push({ name: 'report', params: { report: item.report, options: item.options, browser: item.browser, timestamp: item.timestamp } })
        }
    }
}
</script>