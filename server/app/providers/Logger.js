var chalk = require('chalk');

class Logger{

    constructor(name){
        this.name = name;
    }

    info(...message){
        console.log(chalk.green(this.name), ...message);
    }

    error(...message){
        console.error(chalk.red(this.name), ...message);
    }

    warn(...message){
        console.warn(chalk.yellow(this.name), ...message);
    }

}

module.exports = Logger;