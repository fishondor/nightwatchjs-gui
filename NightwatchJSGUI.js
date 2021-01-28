var EnvironmentService = require('./server/app/providers/Environment');

class NightwatchJSGUI{
    
    constructor(args = {}){
        EnvironmentService(args);
        var Server = require('./server/app/server');
        let server = new Server();
        server.start();
    }

}

module.exports = NightwatchJSGUI;