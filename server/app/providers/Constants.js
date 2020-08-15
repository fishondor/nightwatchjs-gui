const fs = require('fs');

const Logger = require('./Logger');

var PROJECT_ROOT_DIRECTORY = process.cwd();
if(process.env.ENV && process.env.ENV == 'dev') PROJECT_ROOT_DIRECTORY += '/..';

const DB_FILE_PATH = `${PROJECT_ROOT_DIRECTORY}/nightwatchjs-gui-db/cron_jobs.db`;

const CONFIG_JSON_FILE_PATH = `${PROJECT_ROOT_DIRECTORY}/nightwatch.json`
const CONFIG_JS_FILE_PATH = `${PROJECT_ROOT_DIRECTORY}/nightwatch.conf.js`
const CONFIG_FILE_PATH = fs.existsSync(CONFIG_JS_FILE_PATH) ? CONFIG_JS_FILE_PATH :
    (fs.existsSync(CONFIG_JSON_FILE_PATH) ? CONFIG_JSON_FILE_PATH : false);

const TESTS_DIRECTORIES = [`${PROJECT_ROOT_DIRECTORY}/tests`];

var logger = new Logger('Constants Service');

class ConstantsService{

    constructor(constants){
        this.constants = constants;
        this.PROJECT_ROOT_DIRECTORY = PROJECT_ROOT_DIRECTORY;
        this.DB_FILE_PATH = DB_FILE_PATH;
        this.TESTS_DIRECTORIES = TESTS_DIRECTORIES;
        this.setProperties(constants);
    }

    setProperties(constants = {}){
        if(!constants.configFilePath && !CONFIG_FILE_PATH)
            throw new Error(`Config file was not found as ${CONFIG_JSON_FILE_PATH} or ${CONFIG_JS_FILE_PATH}. Please provide valid path to your nightwatch configuration file`);

        this.configFilePath = constants.configFilePath || CONFIG_FILE_PATH;

        if(!fs.existsSync(this.configFilePath))
            throw new Error(`Could not find configuration file at ${this.configFilePath}`);

        let config = require(this.configFilePath);

        if(config.src_folders && Array.isArray(config.src_folders) && config.src_folders.length)
            this.TESTS_DIRECTORIES = config.src_folders.map(item => `${PROJECT_ROOT_DIRECTORY}/${item}`);

        this.TESTS_DIRECTORIES.map(
            directory => {
                if(!fs.existsSync(directory))
                    throw new Error(`Could not find tests src folders at ${directory}. Please make sure you define this source in your nightwatch config file correctly or use default 'tests' folder`);
            }
        )

        if(constants.dbFilePath)
            this.DB_FILE_PATH = constants.dbFilePath;

        if(!config.test_settings)
            throw new Error('Tests settings is not defined in config file');

        this.TESTS_ENVIRONMENTS = config.test_settings;
    }

}

var constantsService = false;

var getInstance = (arguments, moshe) => {
    if(!constantsService)
        constantsService = new ConstantsService(arguments);
    else if(arguments)
        logger.warn(`Constants service was called with arguments but already instantiated. Service will keep using ${constantsService.configFilePath}`);
    return constantsService;
}

module.exports = getInstance;