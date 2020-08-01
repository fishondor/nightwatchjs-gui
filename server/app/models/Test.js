const testCommand = {
    groups: (tests) => {
        return `--group ${tests.join(',')}`;
    },
    single: (test) => {
        return `--test ${test}`;
    }
}

class Test{

    constructor(type, tests, environments, args = {}){
        if(!environments)
            throw new Error('environments argument is not defined');
        if(!tests)
            throw new Error("Missing argument test");
            
        this.type = type;
        this.tests = tests;
        this.environments = environments;
        this.environmentVariables = args.environmentVariables;
    }

    getCommand(){
        let environmentVariables = this.environmentVariables.reduce(
            (variables, item) => {
                if(!item.name && !item.value)
                    return variables;
                variables += `${item.name}=${item.value} `;
                return variables;
            },
            ''
        );
        let environments = this.environments.join(',');
        return `${environmentVariables}node_modules/.bin/nightwatch -e ${environments} ${testCommand[this.type](this.tests)}`;
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
    
    static fromJSON(testJSON){
        return new Test(
            testJSON.type,
            testJSON.tests,
            testJSON.environments,
            {environmentVariables: testJSON.environmentVariables}
        )
    }

}

module.exports = Test