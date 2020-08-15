<template>
    <v-form
            ref="cronjobs-form"
            lazy-validation
    >
        <div>
            <v-btn color="primary" 
                :disabled="!formValid" 
                @click="runTest"
                :loading="loading">Run this test now</v-btn>
        </div>
        <div class="d-flex flex-sm-row flex-column">
            <div class="flex-grow-1">
                <v-row>
                    <v-col>
                        <v-radio-group v-model="formValues.type" row>
                            <v-radio label="Group Tests" value="groups"></v-radio>
                            <v-radio label="Single Test" value="single"></v-radio>
                        </v-radio-group>
                    </v-col>
                </v-row>
                <v-row v-if="formValues.type=='groups'">
                    <v-col>
                        <h4>Available test groups</h4>
                        <div v-for="item in testGroups" :key="'testgroup' + item.name">
                            <p>{{item.name}}</p>
                            <v-treeview
                                v-model="formValues.selectedTestGroups"
                                :items="item.items"
                                selection-type="independent"
                                selectable
                                return-object
                                item-children="nodes"
                                item-key="pathname"
                                item-disabled="disabled"
                                @input="onFormChanged"
                            ></v-treeview>
                        </div>
                    </v-col>
                </v-row>
                <v-row v-if="formValues.type=='single'">
                    <v-col>
                        <h4>Available tests</h4>
                        <v-radio-group v-model="formValues.selectedTest" v-on:change="onFormChanged">
                            <div v-for="item in tests" :key="'test-' + item.name">
                                <p>{{item.name}}</p>
                                <v-treeview
                                    activatable
                                    color="info"
                                    :items="item.items"
                                    item-children="nodes"
                                    return-object
                                    item-key="pathname"
                                >
                                    <template v-slot:prepend="{ item }">
                                        <v-radio
                                            :label="''"
                                            :value="item"
                                            :disabled="item.disabled"
                                        ></v-radio>
                                    </template>
                                </v-treeview>
                            </div>
                        </v-radio-group>
                    </v-col>
                </v-row>
            </div>
            <div class="flex-grow-1">
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
            </div>
        </div>
    </v-form>
</template>

<script>
import { mapState } from 'vuex';

import Test from '../../../../shared/Test';

import {
    createPathString
} from '../../providers/Utils';

export default {
    data: () => ({
        formValues: {
            selectedTestGroups: [],
            selectedTest: false,
            selectedEnvironments: [],
            environmentVariables: [
                {name: "", value: ""}
            ],
            type: 'groups'
        },
        loading: false
    }),
    computed: {
        ...mapState({
            tests: function(state){
                return state.tests.map(
                    test => {
                        return {
                            name: test.name,
                            items: this.disableItemsByType(test.items, 'dir')
                        }
                    }
                )
            },
            testGroups: function(state){
                return state.testGroups.map(
                    group => {
                        return {
                            name: group.name,
                            items: this.disableItemsByType(group.items, 'file')
                        }
                    }
                )
            },
            variablesEnvironments: state => state.variablesEnvironments,
            testsEnvironments: state => state.testsEnvironments
        }),
        formValid: {
            get(){
                if(!this.formValues.selectedEnvironments.length)
                    return false;
                if(this.formValues.type == 'groups' && !this.formValues.selectedTestGroups.length)
                    return false;
                if(this.formValues.type == 'single' && !this.formValues.selectedTest)
                    return false;
                return true;
            },
           set(formValid){
             return formValid
           } 
        }
    },
    methods: {
        submitForm: function(){
            this.$emit('onSubmit', this.formValues);
        },
        disableItemsByType: function(items, type){
            let disabled = items.map(
                item => {
                    item.disabled = item.type == type;
                    if(item.nodes)
                        item.nodes = this.disableItemsByType(item.nodes, type);
                    return item;
                }
            )
            return disabled;
        },
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
            let response = await this.$serverService.runTest(this.toTestObject(this.formValues).getCommand());
            this.$emit('onTestResults', response);
            this.loading = false;
        },
        toTestObject: function(formValues){
            let tests = formValues.type == 'groups' ? 
                formValues.selectedTestGroups.map(group => createPathString(group)) : 
                createPathString(formValues.selectedTest);
            return new Test(
                formValues.type, 
                tests, 
                formValues.selectedEnvironments, 
                { environmentVariables: formValues.environmentVariables }
            );
        }
    }
}
</script>