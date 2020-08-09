import Vue from 'vue';

class LoggerService{

    info(...message){
        console.log(...message);
    }

    warn(...message){
        console.warn(...message);
    }

    error(...message){
        console.error(...message);
    }

}

const loggerService = new LoggerService();

Vue.mixin({
    beforeCreate(){
        const options = this.$options;
        if(options.loggerService)
            this.$loggerService = options.loggerService;
        else if(options.parent && options.parent.$loggerService)
            this.$loggerService = options.parent.$loggerService;
    }
});

export {
    loggerService,
    LoggerService
};