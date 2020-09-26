#!/usr/bin/env node
const {
    argv
} = require('yargs');

if(argv.d){
    var pm2 = require('pm2');
    pm2.connect(function(err) {
        if (err) {
          console.error(err);
          process.exit(2);
        }
    });
    pm2.start({
        script    : `${__dirname}/../server/start-server.js`,
        name: 'nightwatch-gui-server',
        args: Object.keys(argv).map(
            key => `--${key}=${argv[key]}`
        )
    }, function(err, apps) {
        pm2.disconnect(); 
        if (err) throw err
    });
}else if(argv.stop){
    var pm2 = require('pm2');
    pm2.connect(function(err) {
        if (err) {
          console.error(err);
          process.exit(2);
        }
    });
    pm2.stop('nightwatch-gui-server');
    pm2.disconnect();
}else{
    var NWJSGUI = require('../NightwatchJSGUI');
    
    new NWJSGUI(argv);
}