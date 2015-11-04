#!/usr/bin/env node
// Install packages and run the mediawiki qunit tests.
var Promise = require('prfun');
var cp = require('child_process');
var path = require('path');
var mw = require('../');

var IP = path.join(__dirname, '..', 'ip');
var server;

Promise.resolve().then(function() {
  console.log('Installing npm packages...');
  return new Promise(function(resolve, reject) {
    cp.spawn('npm', ['install'], {
      cwd: IP,
      stdio: 'inherit',
    }).on('close', resolve).on('error', reject);
  });
}).then(function(code) {
  if (code !== 0) {
    throw new Error('`npm install` failed with exit code: ' + code);
  }
}).then(function() {
  // Start up our server on a random port.
  var res, rej;
  var p = new Promise(function(_res, _rej) { res = _res; rej = _rej; });
  server = mw.runServer({
    serverName: 'localhost',
    serverPort: 0,
    enableTests: true,
  });
  server.on('listening', res);
  server.on('error', rej);
  return p;
}).then(function() {
  // Ok, now run the tests!
  return new Promise(function(resolve, reject) {
    var env = Object.create(process.env);
    env.MW_SERVER = 'http://localhost:' + server.address().port;
    env.MW_SCRIPT_PATH = '/w';
    cp.spawn('node_modules/.bin/grunt', ['qunit'], {
      cwd: IP,
      stdio: 'inherit',
      env: env,
    }).on('close', resolve).on('error', reject);
  });
}).then(function(code) {
  if (code !== 0) {
    throw new Error('`grunt qunit` failed with exit code: ' + code);
  }
}).finally(function() {
  // One way or the other, shut down the server.
  server.close();
}).then(function() {
  console.log('Success!');
}).done();
