# NightwatchJS GUI

Run tests, create and manage cronjobs for automatic e2e tests from GUI.
Backend uses express.
Frontend uses Vue.js

## Using

Start server from command line: `nightwatchjs-gui` from your project root folder.\
`node_modules/.bin/nightwatchjs-gui` if the package is installed locally.\
Example:
`node_modules/.bin/nightwatchjs-gui --port=4600`

Start from js script: 
```javascript
const NightwatchJSGUI = require('nightwatchjs-gui');

var args = {
    port: 4600,
    configFilePath: '/var/www/html/e2e-tests/config.conf.js',
    dbFilePath: '/var/www/html/e2e-tests/gui-db/gui.db',
    cronjobCallback: (result, cronjob) => {
        //Get predefined emails by cronjobs tags and send the results
        let emails = getMailsByTags(cronjob.tags);
        emailService.send(emails, result);
    }
}

var nightwatchJSGUI = new NightwatchJSGUI(args);
```

### Options
**Name**|**Description**|**Type**|**Default**
-----|-----|-----|-----
port|The port for the server to expose|String|8080
configFilePath|Path to nightwatch configuration file. [Nightwatch documentation](https://nightwatchjs.org/gettingstarted/configuration/) [Read more](#configFilePath)|String|./nightwatch.conf.js OR nightwatch.json
dbFilePath|This is where db file will be created [Read more](#dbFilePath)|String|./nightwatchjs-gui-db/cron\_jobs.db
cronjobCallback|A callback function to run when test cronjob is done or a path to a file that exports this function [Read more](#cronjobCallback)|Function/String|System will log the result to console
reporter|Path to reporter file. [Read more](#reporter)|String||

#### <a name="configFilePath"></a>configFilePath
Absolute path to your nightwatch project config file. This will be used to extract the paths to tests folders and testing environments (selenium etc.). Tests folders must be defined in this file although this property is optional for nightwatch, this is the way nightwatch-gui will know how to list your tests and tests groups.

#### <a name="cronjobCallback"></a>cronjobCallback
Nightwatch GUI will call this function with the following arguments:\
* results - The test results parsed from stdout
* cronjob - The cronjob object that was executed

#### <a name="dbFilePath"></a>dbFilePath
Nightwatch GUI uses [nedb](https://www.npmjs.com/package/nedb) library for DB management. The data will be saved to the file specified in this argument.

#### <a name="reporter"></a>reporter
By default nightwatchjs-gui will save reports to db and parse them in reports page. You can set your own reporter as described in [Nightwatchjs documentation](https://github.com/nightwatchjs/nightwatch-docs/blob/master/guide/extending-nightwatch/custom-reporter.md). This argument will be used directly in the test command.

### Detach mode
To run as a background service use detach mode by adding ```-d``` flag. This will enable keeping nightwatchjs-gui alive after closing the command session.

To stop the service run ```nightwatchjs-gui --stop```

This package uses [pm2](https://www.npmjs.com/package/pm2) for running as a service. Checkout it's documentation for more options

## Docker
This project is also available as a docker image in [fishondor/nightwatchjs-gui](https://hub.docker.com/repository/docker/fishondor/nightwatchjs-gui).

Running the server from docker container will require configuring testing environments for local selenium testing. Running tests remotely (browserstack, crosssbrowsertesting) will have no difference though.

To run the image, map desired port to 8080 and mount nightwtch project folder to ```/var/nightwatch```. Example: ```docker run -p 8080:8080 -v "$(pwd)"/:/var/nightwatch fishondor/nightwatchjs-gui```.
Example for implementation with selenium-chrome-debug docker image using docker-compose, and nightwatch testing environment configuration can be found [here](examples/)

## Development
* Clone this repo (recommended into a nightwatch js project)
* run `npm run start:local` - this will start local server on port `8080` and vue.js project on port `4200`
* Open `localhost:4200`

## Authentication
This package does not implements authentication. One way to add authentication is to implement a proxy server that will handle authentication and pass requests to nightwatchjs-gui server.

Simple implementation of firebase auth reverse proxy server can be found [here](https://github.com/fishondor/simple-firebase-session-cookies-auth-reverse-proxy)