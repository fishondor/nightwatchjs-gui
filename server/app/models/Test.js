const {
    capitalizeFirstLetter,
    executeCommand
} = require('../providers/utils');

class Test{

    constructor(type, test){
        let path = `./testTypes/Test${capitalizeFirstLetter(type)}`;
        console.log("path", path);
        let testType = require(path);
        return new testType(test.tests, test.environments, test.args);
    }

    static cronCommandFunction(command) {
        return function(onComplete){
            /* executeCommand(`cd .. && ${command}`)
                .then(
                    result => onComplete(result)
                ); */
            console.log("Starting job", command);
            onComplete("This is the result");
        }
    }

    static cronCommandCompleteFunction(result) {
        console.log(`Finished job`, result);
    }

}

module.exports = Test