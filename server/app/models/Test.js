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

    getCommand(nightwatchPath){
        return Test.testCommand(this, nightwatchPath);
    }

    isValid(){
        return this.environments.length && this.tests.length;
    }

    setReporterPath(path){
        this.reporterPath = path;
    }

    setSystemEnvVars(envVars){
        this.systemEnvVars = envVars;
    }
    
    static fromJSON(testJSON){
        return new Test(
            testJSON.type,
            testJSON.tests,
            testJSON.environments,
            {environmentVariables: testJSON.environmentVariables}
        )
    }

    static testCommand(test, nightwatchPath){
        let types = {
            groups: (tests) => {
                return `--group ${tests.join(',')}`;
            },
            single: (test) => {
                return `--test ${test}`;
            }
        }
        let environmentVariables = Test.createEnvVarsString(test.environmentVariables);
        if(test.systemEnvVars)
            environmentVariables += " " + Test.createEnvVarsString(test.systemEnvVars);
        let environments = test.environments.join(',');
        let reporter = test.reporterPath ? `--reporter ${test.reporterPath}` : '';
        return `${environmentVariables}${nightwatchPath} -e ${environments} ${types[test.type](test.tests)} ${reporter}`;
    }

    static createEnvVarsString(envVars){
        return envVars.reduce(
            (variables, item) => {
                if(!item.name && !item.value)
                    return variables;
                variables += `${item.name}=${item.value} `;
                return variables;
            },
            ''
        );
    }

}

module.exports = Test