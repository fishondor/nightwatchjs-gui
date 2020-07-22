<template>
    <v-form
        ref="form"
        v-model="valid"
        lazy-validation
    >
        <v-row>
            <v-col>
                <v-treeview
                v-model="selection"
                :items="items"
                :selection-type="'independent'"
                selectable
                return-object
                open-all
                ></v-treeview>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col class="pa-6" cols="6">
                <template v-if="!selection.length">
                No nodes selected.
                </template>
                <template v-else>
                <div v-for="node in selection" :key="node.id">
                    {{ node.name }}
                </div>
                </template>
            </v-col>
        </v-row>
        <v-row>
            <v-col v-if="runType == 'single'" cols="12">
                <v-radio-group v-model="formValues.selectedTest">
                    <v-radio
                        v-for="test in tests"
                        :key="`test_${test}`"
                        :label="test"
                        :value="test"
                    ></v-radio>
                </v-radio-group>
            </v-col>
            <v-col v-if="runType == 'groups'" cols="12" class="grid-layout">
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
                    v-for="testEnv in testsEnvironments"
                    :key="testEnv"
                    v-model="formValues.selectedEnvironments"
                    :label="testEnv"
                    :value="testEnv"
                    hide-details
                ></v-checkbox>
            </v-col>
            <v-col cols="12">
                <v-radio-group v-model="formValues.selectedVariablesEnvironments">
                    <v-radio
                        v-for="envVar in variablesEnvironments"
                        :key="`variables_env_${envVar}`"
                        :label="envVar"
                        :value="envVar"
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
            selectedTestGroups: [],
            selectedTest: false,
            selectedEnvironments: [],
            selectedVariablesEnvironments: false
        }
    }),
    props: {
        loading: {default: false},
        runType: {default: 'groups'}
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
                if(this.runType == 'groups' && !this.formValues.selectedTestGroups.length)
                    return false;
                if(this.runType == 'single' && !this.formValues.selectedTest)
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