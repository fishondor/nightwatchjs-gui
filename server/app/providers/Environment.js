const fs = require('fs');
const path = require('path');

var {
    PROJECT_ROOT_DIRECTORY,
    DB_FILE_PATH,
    CONFIG_JSON_FILE_PATH,
    CONFIG_JS_FILE_PATH,
    CONFIG_FILE_PATH,
    TESTS_DIRECTORIES,
    TESTS_OUTPUT_DIRECTORY,
    REPORTER_PATH,
    SERVER_PORT
} = require('./constants');
const Logger = require('./Logger');
var logger = new Logger('Environment Service');

class EnvironmentService{

    constructor(constants){
        this.constants = constants || {};
        this.PROJECT_ROOT_DIRECTORY = PROJECT_ROOT_DIRECTORY;
        this.DB_FILE_PATH = this.constants.dbFilePath || DB_FILE_PATH;
        this.REPORTER_PATH = this.constants.reporter || REPORTER_PATH;
        this.SERVER_PORT = this.constants.port || SERVER_PORT;
        this.setPropertiesFromConfigFile(this.constants);
    }

    setPropertiesFromConfigFile(constants = {}){
        if(!constants.configFilePath && !CONFIG_FILE_PATH)
            throw new Error(`Config file was not found as ${CONFIG_JSON_FILE_PATH} or ${CONFIG_JS_FILE_PATH}. Please provide valid path to your nightwatch configuration file`);

        this.configFilePath = constants.configFilePath || CONFIG_FILE_PATH;

        if(!fs.existsSync(this.configFilePath))
            throw new Error(`Could not find configuration file at ${this.configFilePath}`);

        let config = require(this.configFilePath);

        this.TESTS_DIRECTORIES = (config.src_folders && Array.isArray(config.src_folders) && config.src_folders.length) ?
            config.src_folders.map(item => `${PROJECT_ROOT_DIRECTORY}/${item}`) : TESTS_DIRECTORIES;

        this.TESTS_DIRECTORIES.map(
            directory => {
                if(!fs.existsSync(directory))
                    throw new Error(`Could not find tests src folders at ${directory}. Please make sure you define this source in your nightwatch config file correctly or use default 'tests' folder`);
            }
        )

        if(!config.test_settings)
            throw new Error('Tests settings is not defined in config file');

        this.TESTS_ENVIRONMENTS = config.test_settings;
        
        if (typeof constants.cronjobCallback === 'function') {
            this.CRONJOB_CALLBACK = constants.cronjobCallback;
        }else if(typeof constants.cronjobCallback === 'string') {
            if(!fs.existsSync(constants.cronjobCallback))
                throw new Error(`Argument cronjobCallback: ${constants.cronjobCallback} is not a valid path`);
            
            this.CRONJOB_CALLBACK = require(constants.cronjobCallback);
            if(typeof this.CRONJOB_CALLBACK !== 'function')
                throw new Error(`Exported callback must be of type function. file ${constants.cronjobCallback} exports type ${typeof this.CRONJOB_CALLBACK}`);
        }

        this.TESTS_OUTPUT_DIRECTORY = config.output_folder || `${this.PROJECT_ROOT_DIRECTORY}/${path.basename(TESTS_OUTPUT_DIRECTORY)}`;
    }

}

var constantsService = false;

var getInstance = (args) => {
    if(!constantsService)
        constantsService = new EnvironmentService(args);
    else if(args)
        logger.warn(`Environment service was called with arguments but already instantiated. Service will keep using ${constantsService.configFilePath}`);
    return constantsService;
}

module.exports = getInstance;