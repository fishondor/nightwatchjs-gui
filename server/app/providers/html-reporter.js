const axios = require('axios');

const Logger = require('./Logger');

const logger = new Logger('html-reporter');

module.exports = {
  write : async function(results, options, done) {

    try{
        await axios.post('http://localhost:8080/api/report', 
        {
            report: JSON.stringify(results)
        });
        done();
    }catch(err){
        logger.error(err);
    }
    
  }
};