var Server = require('./server/app/server');
var EnvironmentService = require('./server/app/providers/Environment');

class NightwatchJSGUI{
    
    constructor(args = {}){
        EnvironmentService(args);
        let server = new Server();
        server.start();
    }

}

module.exports = NightwatchJSGUI;