<template>
    <v-layout child-flex>
        <v-data-table
            :headers="headers"
            :items="jobs"
            :single-expand="false"
            :expanded.sync="expanded"
            item-key="job_id"
            show-expand
            class="elevation-1"
        >
            <template v-slot:item.actions="{ item }">
                <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)"
                >
                    mdi-pencil
                </v-icon>
                <v-icon
                    small
                    @click="deleteItem(item)"
                >
                    mdi-delete
                </v-icon>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                    <span>Command:</span>
                    <CommandlineOutput :output="item.command" />
                    <span>{{`Notification to: ${item.notifyEmail}`}}</span>
                </td>
            </template>
            <template v-slot:item.running="{ item }">
                <v-tooltip top v-if="item.running">
                    <template v-slot:activator="{ on, attrs }">
                        <v-chip v-bind="attrs" v-on="on" :color="'green'" dark @click="stopItem(item)">
                            Active
                        </v-chip>
                    </template>
                    <span>Click to stop</span>
                </v-tooltip>
                <v-tooltip top v-else>
                    <template v-slot:activator="{ on, attrs }">
                        <v-chip v-bind="attrs" v-on="on" :color="'orange'" dark @click="startItem(item)">
                            Paused
                        </v-chip>
                    </template>
                    <span>Click to start</span>
                </v-tooltip>
            </template>
        </v-data-table>
    </v-layout>
</template>

<script>
import { mapState } from 'vuex'

import CommandlineOutput from '@/views/components/CommandlineOutput'

export default {
    components: {
        CommandlineOutput
    },
    computed: {
        ...mapState({
            jobs: state => state.testsCronJobs
        })
    },
    data () {
        return {
            expanded: [],
            singleExpand: false,
            headers: [
                { text: 'ID', value: 'job_id' },
                { text: 'Title', value: 'title' },
                { text: 'Expression', value: 'expression' },
                { text: 'Status', value: 'running' },
                { text: '', value: 'actions' },
                { text: '', value: 'data-table-expand' },
            ]
        }
    },
    methods: {
        editItem: function(item){
            console.log("Edit", item);
        },
        deleteItem: async function(item){
            try{
                let itemsDeleted = await this.$serverService.deleteCronJob(item);
                if(!itemsDeleted){
                    this.$loggerService.error(`No items were deleted`);
                    return;
                }
                let cronJobs = this.jobs.filter(job => job.job_id != item.job_id);
                this.$store.commit('setTestsCronJobs', cronJobs);
            }catch(err){
                this.$loggerService.error(`Error deleteing job: ${err}`);
            }
        },
        stopItem: async function(item){
            try{
                let itemStatus = await this.$serverService.stopCronJob(item);
                item.running = itemStatus.running;
            }catch(err){
                this.$loggerService.error(`Error deactivating job: ${err}`);
            }
        },
        startItem: async function(item){
            try{
                let itemStatus = await this.$serverService.startCronJob(item);
                item.running = itemStatus.running;
            }catch(err){
                this.$loggerService.error(`Error activating job: ${err}`);
            }
        }
    }
}
</script>