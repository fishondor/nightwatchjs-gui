var exec = require('child_process').exec;

const Logger = require('./Logger');

const logger = new Logger("Utils");

const executeCommand = (command) => {
    console.log("Executing command", command);
    return new Promise(
        (resolve) => {
            exec(command, function(error, stdout){ 
                if(error)
                    logger.error(error);
                resolve(stdout) });
        }
    )
};

module.exports = {
    executeCommand
}