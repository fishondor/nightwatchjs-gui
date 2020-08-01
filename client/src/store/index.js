import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tests: [],
        testsEnvironments: [],
        testGroups: [],
        testsCronJobs: [],
        notification: {}
    },
    mutations: {
        setTests(state, tests){
            state.tests = tests;
        },
        setTestsEnvironments(state, testsEnvironments){
            state.testsEnvironments = testsEnvironments;
        },
        setTestGroups(state, testGroups){
            state.testGroups = testGroups;
        },
        setTestsCronJobs(state, jobs){
            state.testsCronJobs = jobs;
        },
        setNotification(state, notification){
          state.notification = notification;
        }
    },
    getters: {
        tests: state => state.tests,
        testGroups: state => state.testGroups,
        testsEnvironments: state => state.testsEnvironments,
        testsCronJobs: state => state.testsCronJobs,
        notification: state => state.notification
    }
})
