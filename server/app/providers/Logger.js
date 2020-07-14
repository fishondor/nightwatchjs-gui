const chalk = require('chalk');

class Logger{

    constructor(name){
        this.name = name;
    }

    info(message){
        console.log(this.name, message);
    }

    error(message){
        console.error(this.name, message);
    }

    warn(message){
        console.warn(this.name, message);
    }

}

module.exports = Logger;