const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');

const Logger = require('./providers/Logger');
const Environment = require('./providers/Environment')();

const logger = new Logger('Server');

class NWGUIServer{

    constructor(){
        this.app = express();
        this.port = Environment.SERVER_PORT;
    }

    start(){
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));

        this.app.use('/api', require('./api'));
        
        this.app.use(express.static(path.join(__dirname, '../../client/dist')));
        
        this.app.route('/*').get(
            (req, res) => {
                res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
            }
        );

        this.app.set('port', this.port);

        this.server = http.createServer(this.app);

        this.server.listen(this.port, () => logger.info(`API listening on ${this.port}`));
    }

}

module.exports = NWGUIServer;