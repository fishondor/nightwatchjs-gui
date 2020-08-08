const fs = require('fs');

var TESTS_ROOT_DIRECTORY = process.cwd();
if(process.env.ENV && process.env.ENV == 'dev') TESTS_ROOT_DIRECTORY += '/../';

const DB_FILE_PATH = `${TESTS_ROOT_DIRECTORY}nightwatchjs-gui-db/cron_jobs.db`;

const CONFIG_JSON_FILE_PATH = `${TESTS_ROOT_DIRECTORY}nightwatch.json`
const CONFIG_JS_FILE_PATH = `${TESTS_ROOT_DIRECTORY}nightwatch.conf.js`
const CONFIG_FILE_PATH = fs.existsSync(CONFIG_JS_FILE_PATH) ? CONFIG_JS_FILE_PATH :
    (fs.existsSync(CONFIG_JSON_FILE_PATH) ? CONFIG_JSON_FILE_PATH : false);

if(!CONFIG_FILE_PATH)
    throw new Error(`Config file was not found`);

const TESTS_DIRECTORY = `${TESTS_ROOT_DIRECTORY}tests`;

module.exports = {
    TESTS_ROOT_DIRECTORY,
    TESTS_DIRECTORY,
    DB_FILE_PATH,
    CONFIG_FILE_PATH
}