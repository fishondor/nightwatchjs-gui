<template>
    <v-snackbar
        v-model="notification.show"
        :color="notification.color"
        :timeout="timeout"
        >
        {{ notification.text }}
        <v-btn
            dark
            text
            @click="close"
        >
            Close
        </v-btn>
    </v-snackbar>
</template>

<script>
import { mapState } from 'vuex';
export default {
    data(){
        return{
            timeout: 5000
        }
    },
    computed: mapState({
        notification: state => state.notification
    }),
    methods: {
        close(){
            this.$store.commit('setNotification', {show: false});
        }
    }
}
</script>