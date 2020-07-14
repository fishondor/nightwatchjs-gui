import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tests: [],
        testsEnvironments: [],
        variablesEnvironments: [],
        testGroups: []
    },
    mutations: {
        setTests(state, tests){
            state.tests = tests;
        },
        setTestsEnvironments(state, testsEnvironments){
            state.testsEnvironments = testsEnvironments;
        },
        setVariablesEnvironments(state, variablesEnvironments){
            state.variablesEnvironments = variablesEnvironments;
        },
        setTestGroups(state, testGroups){
            state.testGroups = testGroups;
        }
    },
    getters: {
        tests: state => state.tests,
        testGroups: state => state.testGroups,
        variablesEnvironments: state => state.variablesEnvironments,
        testsEnvironments: state => state.testsEnvironments
    }
})
