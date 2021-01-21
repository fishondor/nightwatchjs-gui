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

    isValid(){
        return this.environments.length && this.tests.length;
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

export default Test;