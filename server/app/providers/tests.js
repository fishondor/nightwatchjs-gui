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
        let treeView = new TreeView({relative: true});
        let treeViews = [];
        for(let i = 0; i < TESTS_DIRECTORIES.length; i++){
            let path = TESTS_DIRECTORIES[i];
            try {
                let directory = path.replace(PROJECT_ROOT_DIRECTORY, '');
                let items = await treeView.process(path)
                treeViews.push({
                    name: directory,
                    items: items
                });
            } catch (error) {
                logger.error("Error getting tree", error);
                res.sendStatus(500);
                return;
            }
        }
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