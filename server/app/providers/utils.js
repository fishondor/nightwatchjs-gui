var exec = require('child_process').exec;

const Logger = require('./Logger');

const logger = new Logger("Utils");

const executeCommand = (command, path) => {
    logger.info("executing command", command);
    return new Promise(
        (resolve) => {
            exec(command, {cwd: path || process.cwd()}, function(error, stdout){ 
                if(error)
                    logger.error(error);
                resolve(stdout) });
        }
    )
};

module.exports = {
    executeCommand
}