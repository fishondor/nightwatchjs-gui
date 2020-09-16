<template>
    <v-form
         v-model="isValid"
         @input="onFormInput"
    >
        <v-row class="d-flex flex-sm-row flex-column">
            <v-col class="flex-grow-1">
                <v-text-field
                    v-model="formValues.title"
                    label="Title"
                    outlined
                    required
                    validate-on-blur
                    :rules="formValidation.required"
                ></v-text-field>
            </v-col>
            <v-col class="flex-grow-1">
                <v-text-field
                    v-model="formValues.expression"
                    label="Cron job expression"
                    outlined
                    required
                    validate-on-blur
                    :rules="formValidation.cron"
                ></v-text-field>
            </v-col>
            <v-col class="flex-grow-1">
                <v-combobox
                    v-model="formValues.tags"
                    :items="cronjobsTags"
                    label="Tags (will be passed to callback)"
                    multiple
                    small-chips
                    outlined
                    deletable-chips
                    clearable
                ></v-combobox>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { mapState } from 'vuex';
import cron from 'cron-validate'

export default {
    data: () => ({
        formValues: {
            title: '',
            expression: '',
            tags: []
        },
        loading: false,
        isValid: true,
        formValidation: {
            required: [v => !!v || 'This field is required'],
            cron: [v => {
                let validation = cron(v, {
                    preset: 'npm-node-cron',
                });
                return validation.isValid() || validation.error.join(', ');
            }]
        }
    }),
    computed: {
        ...mapState({
            cronjobsTags: state => state.testsCronJobs.reduce((prev, current) => {
                return prev.concat(current.tags);
            }, [])
        })
    },
    methods: {
        onFormInput: function(value){
            this.$emit('onUpdate', value ? this.formValues : false)
        }
    }
}
</script>