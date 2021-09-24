import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tests: [],
        testsEnvironments: [],
        testGroups: [],
        testsCronJobs: [],
        notification: {},
        showLoader: false
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
        addCronjob(state, cronjob){
            state.testsCronJobs.push(cronjob);
        },
        setNotification(state, notification){
            state.notification = notification;
        },
        setShowLoader(state, showLoader){
            state.showLoader = showLoader
        }
    },
    getters: {
        tests: state => state.tests,
        testGroups: state => state.testGroups,
        testsEnvironments: state => state.testsEnvironments,
        testsCronJobs: state => state.testsCronJobs,
        notification: state => state.notification,
        showLoader: state => state.showLoader
    }
})
