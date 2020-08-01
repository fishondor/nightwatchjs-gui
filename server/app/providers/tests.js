const path = require('path');
var AU = require('ansi_up');
const { TreeView } = require('node-treeview');

const Logger = require('./Logger');
const {
    TESTS_ROOT_DIRECTORY
} = require('./environment');

var ansi_up = new AU.default;

const {
    executeCommand
} = require('./utils');

const logger = new Logger('Tests service');

const runTest = async (test) => {
    let result = await executeCommand(`cd ${TESTS_ROOT_DIRECTORY} && ` + test);
    return ansi_up.ansi_to_html(result);
}

const api = {
    runTest: async (req, res) => {
        let test = req.body.test;
        let results = await runTest(test);
        return res.json(results);
    },

    getTestsTreeView: async (req, res) => {
        let root = path.join(TESTS_ROOT_DIRECTORY, 'tests');
        try {
            let tree = await new TreeView({relative: true}).process(root);
            res.json(tree);
        } catch (error) {
            logger.error("Error getting tree", error);
            res.sendStatus(500);
        }
    },
    
    getTestEnvironments: (req, res) => {
        let environments = require(`${TESTS_ROOT_DIRECTORY}/nightwatch.conf.js`).test_settings;
        res.status(200).send(Object.keys(environments));
    }
}

module.exports = {
    api,
    runTest
}