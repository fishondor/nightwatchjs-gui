const path = require('path');
var AU = require('ansi_up');
var glob = require('glob');

var ansi_up = new AU.default;

const {
    extractTestsNames,
    getDirectories,
    extractEnvironments,
    executeTestGroup,
    executeTest
} = require('./utils');

const TESTS_ROOT_DIRECTORY = __dirname + '/../../../../';

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
    let testEnvironments = req.body.environments;
    let testsLocalEnvironment = req.body.testsLocalEnvironment || false;
    let response = await executeTest(test, testEnvironments.join(','), testsLocalEnvironment);
    console.log("Response", response);
    return res.status(200).send(ansi_up.ansi_to_html(response));
}

const getTestGroups = (req, res) => {
    let directories = getDirectories(path.join(TESTS_ROOT_DIRECTORY, 'tests'));
    let tests = extractTestsNames(directories);
    res.status(200).send(tests);
}

const getTests = (req, res) => {
    let root = path.join(TESTS_ROOT_DIRECTORY, 'tests');
    glob(root + '/**/*', (err, files) => {
        files = files.filter(
            file => file.endsWith('.js')
        )
        files = files.map(function(file) {
            return path.relative(root, file);
        });
        res.status(200).send(files);
    });
}

const getTestEnvironments = (req, res) => {
    let environments = extractEnvironments(path.join(TESTS_ROOT_DIRECTORY, 'config/testing-environments'));
    res.status(200).send(environments);
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
    getTests,
    getTestEnvironments,
    getVariablesEnvironments
}