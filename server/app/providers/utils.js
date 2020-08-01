var exec = require('child_process').exec;

const executeCommand = (command) => {
    console.log("Executing command", command);
    return new Promise(
        (resolve) => {
            exec(command, function(error, stdout){ resolve(stdout) });
        }
    )
};

module.exports = {
    executeCommand
}