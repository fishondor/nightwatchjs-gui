class Test{

    constructor(tests, environments, args = {}){
        if(!environments)
            throw new Error('environments argument is not defined');
        if(!tests)
            throw new Error("Missing argument test");
            
        this.tests = tests;
        this.environments = environments;
        this.environmentVariables = args.environmentVariables;
    }

    getCommand(){
        let environmentVariables = Object.keys(this.environmentVariables).reduce(
            (variables, key) => {
                variables += `${key}=${this.environmentVariables[key]} `;
                return variables;
            },
            ''
        );
        let environments = this.environments.join(',');
        return `${environmentVariables}npx nightwatch -e ${environments} ${this.testCommand}`;
    }

}

module.exports = Test