# NightwatchJS GUI

Run tests, create and manage cronjobs for automatic e2e tests from GUI.
Backend uses express.
Frontend uses Vue.js

## Using

Start server from command line: `nightwatchjs-gui` from your project root folder. `node_modules/.bin/nightwatchjs-gui` if the package is installed locally.
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

#### <a name="configFilePath"></a>configFilePath
Absolute path to your nightwatch project config file. This will be used to extract the paths to tests folders and testing environments (selenium etc.). Tests folders must be defined in this file although this property is optional for nightwatch, this is the way nightwatch-gui will know how to list your tests and tests groups.

#### <a name="cronjobCallback"></a>cronjobCallback
Nightwatch GUI will call this function with arguments:
-   results - The test results parsed from stdout
-   cronjob - The cronjob object that was executed

#### <a name="dbFilePath"></a>dbFilePath
Nightwatch GUI uses [nedb](https://www.npmjs.com/package/nedb) library for DB management. The data will be saved to the file specified in this argument.