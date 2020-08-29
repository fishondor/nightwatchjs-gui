<template>
    <v-form
        ref="cronjobs-form"
        lazy-validation
    >
        <v-row class="d-flex flex-sm-row flex-column">
            <v-col class="flex-grow-1">
                <v-text-field
                    v-model="formValues.title"
                    label="Title"
                    outlined
                    validate-on-blur
                ></v-text-field>
            </v-col>
            <v-col class="flex-grow-1">
                <v-text-field
                    v-model="formValues.expression"
                    label="Cron job expression"
                    outlined
                    required
                    validate-on-blur
                ></v-text-field>
            </v-col>
            <v-col class="flex-grow-1">
                <v-combobox
                    v-model="formValues.tags"
                    :items="cronjobsTags"
                    label="Tags (will be used for finished callback)"
                    multiple
                    small-chips
                    outlined
                    deletable-chips
                    clearable
                ></v-combobox>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-btn color="primary" 
                    @click="submitForm"
                    :loading="loading">Save and activate</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data: () => ({
        formValues: {
            title: '',
            expression: '',
            tags: []
        },
        loading: false
    }),
    computed: {
        ...mapState({
            cronjobsTags: state => state.testsCronJobs.reduce((prev, current) => {
                return prev.concat(current.tags);
            }, [])
        })
    },
    methods: {
        submitForm: function(){
            this.$emit('onSubmit', this.formValues);
        },
    }
}
</script>