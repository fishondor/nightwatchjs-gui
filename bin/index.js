#!/usr/bin/env node
const {
    argv
} = require('yargs');

var NWJSGUI = require('../NightwatchJSGUI');

new NWJSGUI(argv);