var Server = require('./server/app/server');
var ConstantsService = require('./server/app/providers/Constants');

class NightwatchJSGUI{
    
    constructor(args = {}){
        ConstantsService(args);
        let server = new Server(args);
        server.start();
    }

}

module.exports = NightwatchJSGUI;