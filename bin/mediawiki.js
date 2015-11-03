#!/usr/bin/env node
var server = require('../');

var argv = require('yargs')
    .usage('Usage: $0 -h [host] -p [port]')
    .alias('h', 'host')
    .nargs('h', 1)
    .describe('h', 'Server name (default: localhost)')
    .alias('p', 'port')
    .nargs('p', 1)
    .describe('p', 'Server port (default: 8080)')
    .help('h')
    .alias('h', 'help')
    .alias('t', 'test')
    .describe('t', 'Enable JavaScript unit testing')
    .argv;

server.runServer({
  serverName: argv.host,
  serverPort: argv.port,
  enableTests: argv.test,
});
