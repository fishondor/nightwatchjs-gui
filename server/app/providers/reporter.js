const axios = require('axios');

const Logger = require('./Logger');

const logger = new Logger('html-reporter');

module.exports = {
  write : async function(results, options, done) {

    try{
        await axios.post('http://localhost:8080/api/report', 
        {
            report: JSON.stringify(results),
            options: JSON.stringify(options),
            timestamp: new Date().toString(),
            browser: options.filename_prefix.split('_').join(' ')
        });
        done();
    }catch(err){
        logger.error(err);
    }
    
  }
};