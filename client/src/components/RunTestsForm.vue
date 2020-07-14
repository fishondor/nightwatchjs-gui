<template>
    <v-form
        ref="form"
        v-model="valid"
        lazy-validation
    >
        <v-row>
            <v-col cols="12">
                <v-radio-group v-model="formValues.runType">
                    <v-radio
                        :label="`Run test group`"
                        :value="'group'"
                    ></v-radio>
                    <v-radio
                        :label="`Run single test`"
                        :value="'single'"
                    ></v-radio>
                </v-radio-group>
            </v-col>
            <v-col v-if="formValues.runType == 'single'" cols="12">
                <v-radio-group v-model="formValues.selectedTest">
                    <v-radio
                        v-for="group in tests"
                        :key="`test_${group}`"
                        :label="group"
                        :value="group"
                    ></v-radio>
                </v-radio-group>
            </v-col>
            <v-col v-if="formValues.runType == 'group'" cols="12" class="grid-layout">
                <v-checkbox
                    v-for="group in testGroups"
                    :key="group"
                    v-model="formValues.selectedTestGroups"
                    :label="group"
                    :value="group"
                    hide-details
                ></v-checkbox>
            </v-col>
            <v-col cols="12" class="grid-layout">
                <v-checkbox
                    v-for="group in testsEnvironments"
                    :key="group"
                    v-model="formValues.selectedEnvironments"
                    :label="group"
                    :value="group"
                    hide-details
                ></v-checkbox>
            </v-col>
            <v-col cols="12">
                <v-radio-group v-model="formValues.selectedVariablesEnvironments">
                    <v-radio
                        v-for="group in variablesEnvironments"
                        :key="`variables_env_${group}`"
                        :label="group"
                        :value="group"
                    ></v-radio>
                </v-radio-group>
            </v-col>
        </v-row>
        <v-btn
            color="success"
            class="mr-4"
            :loading="loading"
            :disabled="loading || !valid"
            @click="onFormSubmit">
            Run tests
        </v-btn>
    </v-form>
</template>

<script>
import { mapState } from 'vuex'

export default {
    data: () => ({
        formValues: {
            runType: 'group',
            selectedTestGroups: [],
            selectedTest: false,
            selectedEnvironments: [],
            selectedVariablesEnvironments: false
        }
    }),
    props: {
        loading: {default: false}
    },
    computed: {
        ...mapState({
            tests: state => state.tests,
            testGroups: state => state.testGroups,
            variablesEnvironments: state => state.variablesEnvironments,
            testsEnvironments: state => state.testsEnvironments
        }),
        valid: {
            get(){
                if(!this.formValues.selectedEnvironments.length)
                    return false;
                if(this.formValues.runType == 'group' && !this.formValues.selectedTestGroups.length)
                    return false;
                if(this.formValues.runType == 'single' && !this.formValues.selectedTest)
                    return false;
                return true;
            },
           set(valid){
             return valid
           } 
        }
    },
    methods: {
        onFormSubmit: function(){
            this.$emit('onSubmit', this.formValues);
        }
    }
}
</script>

<style lang="scss" scoped>
.grid-layout,
div::v-deep .v-input--radio-group__input,
[role="radiogroup"]{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    column-gap: 1em;
    word-break: break-word;
}
</style>