var AU = require('ansi_up');
const { TreeView } = require('node-treeview');

const Logger = require('./Logger');
const {
    PROJECT_ROOT_DIRECTORY,
    TESTS_DIRECTORIES,
    TESTS_ENVIRONMENTS
} = require('./Constants')();

var ansi_up = new AU.default;

const {
    executeCommand
} = require('./utils');

const logger = new Logger('Tests service');

const runTest = async (test) => {
    let result = await executeCommand(`cd ${PROJECT_ROOT_DIRECTORY} && ` + test);
    return ansi_up.ansi_to_html(result);
}

const api = {
    runTest: async (req, res) => {
        let test = req.body.test;
        let results = await runTest(test);
        return res.json(results);
    },

    getTestsTreeView: async (req, res) => {
        let treeView = new TreeView({relative: true, include: TESTS_DIRECTORIES});
        let treeViews = await treeView.process(PROJECT_ROOT_DIRECTORY);
        res.json(treeViews);
    },
    
    getTestEnvironments: (req, res) => {
        res.status(200).send(Object.keys(TESTS_ENVIRONMENTS));
    }
}

module.exports = {
    api,
    runTest
}