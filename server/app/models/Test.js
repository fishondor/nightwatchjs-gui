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
        this.reporterPath = args.reporterPath;
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
        let reporter = this.reporterPath ? `--reporter ${this.reporterPath}` : '';
        return `${environmentVariables}node_modules/.bin/nightwatch -e ${environments} ${testCommand[this.type](this.tests)} ${reporter}`;
    }

    isValid(){
        return this.environments.length && this.tests.length;
    }

    setReporterPath(path){
        this.reporterPath = path;
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