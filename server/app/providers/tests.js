var AU = require('ansi_up');
const { TreeView } = require('node-treeview');

const Test = require('../models/Test');

const Environment = require('./Environment')();

var ansi_up = new AU.default;

const {
    executeCommand
} = require('./utils');

const runTest = async (test) => {
    let result = await executeCommand(
        test.getCommand(Environment.NIGHTWATCH_BINARY_PATH), 
        Environment.PROJECT_ROOT_DIRECTORY
    );
    return ansi_up.ansi_to_html(result);
}

const api = {
    runTest: async (req, res) => {
        let test = Test.fromJSON(req.body.test);
        test.setReporterPath(Environment.REPORTER_PATH);
        test.setSystemEnvVars([{name: 'NWJSGUI_SERVER_PORT', value: Environment.SERVER_PORT}]);
        let results = await runTest(test);
        return res.json(results);
    },

    getTestsTreeView: async (req, res) => {
        let treeView = new TreeView({relative: true, include: Environment.TESTS_DIRECTORIES});
        let treeViews = await treeView.process(Environment.PROJECT_ROOT_DIRECTORY);
        res.json(treeViews);
    },
    
    getTestEnvironments: (req, res) => {
        res.status(200).send(Object.keys(Environment.TESTS_ENVIRONMENTS));
    },

    getTestsCommand: (req, res) => {
        let test = Test.fromJSON(req.body.test);
        let testCommand = Test.testCommand(test, Environment.NIGHTWATCH_BINARY_PATH);
        res.json(testCommand);
    }
}

module.exports = {
    api,
    runTest
}