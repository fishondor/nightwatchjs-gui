const fs = require('fs');
const path = require('path');

var PROJECT_ROOT_DIRECTORY = process.cwd();
if(process.env.ENV && process.env.ENV == 'dev') PROJECT_ROOT_DIRECTORY += '/..';

const DB_FILE_PATH = `${PROJECT_ROOT_DIRECTORY}/nightwatchjs-gui-db`;

const CONFIG_JSON_FILE_PATH = `${PROJECT_ROOT_DIRECTORY}/nightwatch.json`
const CONFIG_JS_FILE_PATH = `${PROJECT_ROOT_DIRECTORY}/nightwatch.conf.js`
const CONFIG_FILE_PATH = fs.existsSync(CONFIG_JS_FILE_PATH) ? CONFIG_JS_FILE_PATH :
    (fs.existsSync(CONFIG_JSON_FILE_PATH) ? CONFIG_JSON_FILE_PATH : false);

const TESTS_DIRECTORIES = [`${PROJECT_ROOT_DIRECTORY}/tests`];

const TESTS_OUTPUT_DIRECTORY = process.cwd() + '/nightwatchjs-gui-reports';

const REPORTER_PATH = path.resolve(__dirname, 'reporter.js');

const SERVER_PORT = '8080';

module.exports = {
    PROJECT_ROOT_DIRECTORY,
    DB_FILE_PATH,
    CONFIG_JSON_FILE_PATH,
    CONFIG_JS_FILE_PATH,
    CONFIG_FILE_PATH,
    TESTS_DIRECTORIES,
    TESTS_OUTPUT_DIRECTORY,
    REPORTER_PATH,
    SERVER_PORT
}