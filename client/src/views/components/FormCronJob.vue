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
                <v-text-field
                    v-model="formValues.notificationEmail"
                    label="Notification email"
                    outlined
                    :rules="formValidation.emailRules"
                    validate-on-blur
                ></v-text-field>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>

export default {
    data: () => ({
        formValues: {
            title: '',
            expression: '',
            notificationEmail: ''
        },
        formValidation: {
            emailRules: [
                v => /.+@.+\..+/.test(v) || 'Email must be valid',
            ]
        }
    }),
}
</script>