const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');

const api = require('./api');
const Logger = require('./providers/Logger');

const logger = new Logger('Server');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', api);

app.use(express.static(path.join(__dirname, '../../client/dist')));

app.route('/*').get(
    (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    }
)

const port = process.env.PORT || '8080';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => logger.info(`API listening on ${port}`));