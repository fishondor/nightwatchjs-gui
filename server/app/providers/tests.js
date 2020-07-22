const path = require('path');
var AU = require('ansi_up');
var glob = require('glob');
const { TreeView } = require('node-treeview');

const Logger = require('./Logger');

var ansi_up = new AU.default;

const {
    extractTestsNames,
    getDirectories,
    extractEnvironments,
    executeTestGroup,
    executeTest,
    executeCommand
} = require('./utils');

const TESTS_ROOT_DIRECTORY = __dirname + '/../../../../';

const logger = new Logger('Tests service');

const runTestGroup = async (req, res) => {
    let testGroups = req.body.groups;
    let testEnvironments = req.body.environments;
    let testsLocalEnvironment = req.body.variablesEnvironment || false;
    let response = await executeTestGroup(testGroups.join(','), testEnvironments.join(','), testsLocalEnvironment);
    console.log("Response1", response);
    return res.status(200).send(ansi_up.ansi_to_html(response));
}

const runTest = async (req, res) => {
    let test = req.body.test;
    console.log("Test: ", test);
    console.log("CWD", process.cwd());
    let response = await executeCommand("cd .. && " + test);
    console.log("Response", response);
    return res.status(200).send(ansi_up.ansi_to_html(response));
}

const getTestGroups = async (req, res) => {
    let directories = getDirectories(path.join(TESTS_ROOT_DIRECTORY, 'tests'));
    let tests = extractTestsNames(directories);
    res.status(200).send(directories);
    let root = path.join(TESTS_ROOT_DIRECTORY, 'tests');
    try {
        let tree = await new TreeView({}).process(root);

        res.json(tree);
    } catch (error) {
        logger.error("Error getting tree", error);
        res.sendStatus(500);
    }
}

const getTestsTreeView = async (req, res) => {
    let root = path.join(TESTS_ROOT_DIRECTORY, 'tests');
    try {
        let tree = await new TreeView({relative: true}).process(root);
        res.json(tree);
    } catch (error) {
        logger.error("Error getting tree", error);
        res.sendStatus(500);
    }
}

const getTestEnvironments = (req, res) => {
    let environments = require(`${TESTS_ROOT_DIRECTORY}/nightwatch.conf.js`).test_settings;
    res.status(200).send(Object.keys(environments));
}

const getVariablesEnvironments = (req, res) => {
    let directories = getDirectories(path.join(TESTS_ROOT_DIRECTORY, 'config/variables'));
    let environments = extractTestsNames(directories);
    res.status(200).send(environments);
}

module.exports = {
    runTestGroup,
    runTest,
    getTestGroups,
    getTestsTreeView,
    getTestEnvironments,
    getVariablesEnvironments
}