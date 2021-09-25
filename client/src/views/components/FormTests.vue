<template>
    <v-form
            v-model="formValid"
    >
        <div>
            <v-btn color="primary" 
                :disabled="!formValid" 
                @click="runTest"
                :loading="loading">Run this test now</v-btn>
        </div>
        <v-container fluid>
            <v-row>
            <v-col>
                <v-row>
                    <v-col>
                        <v-radio-group v-model="formValues.type" row @change="formValues.selectedTests = null">
                            <v-radio label="Group Tests" value="groups"></v-radio>
                            <v-radio label="Single Test" value="single"></v-radio>
                        </v-radio-group>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                    <h4>Select test {{formValues.type === "groups" ? "groups" : ""}}</h4>
                        <v-autocomplete
                            v-model="formValues.selectedTests"
                            :items="testsList"
                            label="Start typing and select"
                            @change="onFormChanged"
                            :multiple="formValues.type === 'groups'"
                            small-chips
                            outlined
                            deletable-chips
                            clearable
                            item-text="pathname"
                            item-value="pathname"
                            :rules="formRules.tests"
                        ></v-autocomplete>
                    </v-col>
                </v-row>
            </v-col>
            <v-col>
                <v-row>
                    <v-col>
                    <h4>Tests environment</h4>
                        <v-combobox
                            v-model="formValues.selectedEnvironments"
                            :items="testsEnvironments"
                            label="Select environment"
                            @change="onFormChanged"
                            multiple
                            small-chips
                            outlined
                            deletable-chips
                            clearable
                            :rules="formRules.environments"
                        ></v-combobox>
                    </v-col>
                </v-row>
                <h4>Environment variables</h4>
                <v-row v-for="(envVariable, index) in formValues.environmentVariables"
                    :key="index">
                    <v-col cols="6">
                        <v-text-field
                            v-model="formValues.environmentVariables[index].name"
                            label="Name"
                            outlined
                            @change="onFormChanged"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field
                            v-model="formValues.environmentVariables[index].value"
                            label="Value"
                            outlined
                            @change="onFormChanged"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <div class="d-flex justify-end">
                    <v-btn class="mx-2" 
                        fab 
                        dark 
                        small 
                        color="warning"
                        @click="formValues.environmentVariables.pop(); onFormChanged()">
                        <v-icon dark>mdi-minus</v-icon>
                    </v-btn>
                    <v-btn class="mx-2" 
                        fab 
                        dark 
                        small 
                        color="info"
                        @click="formValues.environmentVariables.push({name: '', value: ''}); onFormChanged()">
                        <v-icon dark>mdi-plus</v-icon>
                    </v-btn>
                </div>
            </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script>
import { mapState } from 'vuex';

import Test from '../../models/Test';

import {
    disableNodeByType,
    createListFromTreeview
} from '../../providers/Utils';

export default {
    data: () => ({
        formValid: false,
        formValues: {
            selectedTestGroups: [],
            selectedTest: [],
            selectedEnvironments: [],
            environmentVariables: [
                {name: "", value: ""}
            ],
            type: 'groups',
            selectedTests: null
        },
        loading: false,
        formRules: {
            tests: [
                v => 
                    v !== null && 
                    v != undefined && 
                    (!Array.isArray(v) || !!v.length) || 
                    "pleas select test or test groups"
            ],
            environments: [
                v => 
                    !!v.length || 
                    "pleas select environments"
            ],
        }
    }),
    computed: {
        ...mapState({
            tests: function(state){
                let tests = state.tests.map(
                    test => disableNodeByType(test, 'dir')
                )
                return tests;
            },
            testGroups: function(state){
                return state.testGroups.map(
                    group => disableNodeByType(group, 'file')
                )
            },
            testsList: function(state){
                return createListFromTreeview(state.tests, this.formValues.type === "groups" ? 'dir' : 'file')
            },
            variablesEnvironments: state => state.variablesEnvironments,
            testsEnvironments: state => state.testsEnvironments
        })
    },
    methods: {
        onFormChanged: function(){
            try{
                let test = this.toTestObject(this.formValues);
                this.$emit('onUpdate', test);
            }catch{
                this.$emit('onUpdate', false);
            }
        },
        runTest: async function(){
            this.loading = true;
            let response = await this.$serverService.runTest(this.toTestObject(this.formValues));
            this.$emit('onTestResults', response);
            this.loading = false;
        },
        toTestObject: function(formValues){
            return new Test(
                formValues.type, 
                formValues.selectedTests, 
                formValues.selectedEnvironments, 
                { environmentVariables: formValues.environmentVariables }
            );
        }
    }
}
</script>