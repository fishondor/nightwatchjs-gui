<template>
    <v-layout child-flex>
        <v-data-table
            :headers="headers"
            :items="jobs"
            item-key="_id"
        >
            <template v-slot:item.tags="{ item }">
                <v-chip v-for="tag in item.tags" :key="tag" class="mr-1" color="primary">
                    {{tag}}
                </v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon
                    small
                    @click="deleteItem(item)"
                >
                    mdi-delete
                </v-icon>
                <CommandDialog :test="item.test" />
            </template>
            <template v-slot:item.running="{ item }">
                <v-tooltip 
                    top 
                    v-if="item.running"
                    :open-delay="500">
                    <template v-slot:activator="{ on, attrs }">
                        <v-chip v-bind="attrs" v-on="on" :color="'green'" dark @click="stopItem(item)">
                            Active
                        </v-chip>
                    </template>
                    <span>Click to stop</span>
                </v-tooltip>
                <v-tooltip 
                    top 
                    v-else
                    :open-delay="500">
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

import CommandDialog from './CommadDialog'

export default {
    components: {
        CommandDialog
    },
    computed: {
        ...mapState({
            jobs: state => state.testsCronJobs
        })
    },
    data () {
        return {
            headers: [
                { text: 'ID', value: '_id' },
                { text: 'Title', value: 'title' },
                { text: 'Expression', value: 'expression' },
                { text: 'Tags', value: 'tags'},
                { text: 'Status', value: 'running' },
                { text: '', value: 'actions' }
            ]
        }
    },
    methods: {
        getCommand: async function(test){
            let command = await this.$serverService.getTestCommand(test);
            return command;
        },
        deleteItem: async function(item){
            try{
                let itemsDeleted = await this.$serverService.deleteCronJob(item);
                if(!itemsDeleted){
                    this.$loggerService.error(`No items were deleted`);
                    this.$notificationsService.error("Could not delete item. Please refer to logs for more information");
                    return;
                }else{
                    this.$notificationsService.success(`Cron Job ${item.title} was deleted successfully`);
                }
                
                let cronJobs = this.jobs.filter(job => job._id != item._id);
                this.$store.commit('setTestsCronJobs', cronJobs);
            }catch(err){
                this.$loggerService.error(`Error deleteing job: ${err}`);
            }
        },
        stopItem: async function(item){
            try{
                let itemStatus = await this.$serverService.stopCronJob(item._id);
                if(!itemStatus){
                    this.$notificationsService.error(`Error while trying to stop job ${item._id}`);
                    return;
                }
                if(itemStatus.running){
                    this.$notificationsService.error(`Could not stop job ${item._id}`);
                    return;
                }
                this.$notificationsService.success(`Job ${item._id} stopped`);
                item.running = itemStatus.running;
            }catch(err){
                this.$loggerService.error(`Error deactivating job: ${err}`);
            }
        },
        startItem: async function(item){
            try{
                let itemStatus = await this.$serverService.startCronJob(item._id);
                if(!itemStatus){
                    this.$notificationsService.error(`Error while trying to start job ${item._id}`);
                    return;
                }
                if(!itemStatus.running){
                    this.$notificationsService.error(`Could not start job ${item._id}`);
                    return;
                }
                this.$notificationsService.success(`Job ${item._id} started`);
                item.running = itemStatus.running;
            }catch(err){
                this.$loggerService.error(`Error activating job: ${err}`);
            }
        }
    }
}
</script>

<style lang="scss">
.v-tooltip__content {
    line-height: 15px;
    padding: 5px;
}
</style>