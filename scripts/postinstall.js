#!/usr/bin/env node
// Post-install script: configures mediawiki.
var Promise = require('prfun');
var packageJson = require('../package.json');

var cpr = Promise.promisify(require('cpr'));
var fs = require('pn/fs');
var passwordGenerator = require('password-generator');
var path = require('path');
var php = require('php-embed');

var SKIP_COPY = false;
var adminUser = 'admin';
var adminPassword = passwordGenerator();
var scriptPath = '/wiki';

// First thing we need to do is clone the mediawiki repo into the `ip`
// directory, because we want to maintain a clean submodule but mediawiki
// wants us to edit some files in place (in particular, setting up the
// vendor symlink).
// XXX do this only when version has changed.
var IP = path.resolve(path.join(__dirname, '..', 'ip'));
Promise.resolve().then(function() {
  if (SKIP_COPY) { return; }
  console.log('Copying mediawiki to $IP...');
  return cpr(path.join(__dirname, '..', 'mediawiki'), IP, {
    deleteFirst: true,
    filter: function(f) {
      if (/\/\.git$/.test(f)) { return false; }
      if (/\/mediawiki\/(vendor|skins|data)(\/.*)?$/.test(f)) { return false; }
      return true;
    },
  });
}).then(function() {
  if (SKIP_COPY) { return; }
  console.log('Creating symlinks...');
  return Promise.join(
	fs.symlink('../vendor', path.join(IP, 'vendor'), 'dir'),
	fs.symlink('../skins', path.join(IP, 'skins'), 'dir'),
    fs.mkdir(path.join(IP, 'data'))
  );
}).then(function() {
  console.log('Running PHP installer...');
  process.env.MW_INSTALL_PATH = IP;
  var file = path.join(IP, 'maintenance', 'install.php');
  return php.request({
    file: file,
    args: [ file, '--dbtype', 'sqlite', '--dbpath', path.join(IP, 'data'),
            '--scriptpath', scriptPath,
            '--pass', adminPassword, 'MediaWiki', adminUser, ],
  });
}).then(function() {
  var pwfile = path.join(IP, '..', 'admin.json');
  console.log('Writing admin login information to', pwfile);
  return fs.writeFile(pwfile, JSON.stringify({
    username: adminUser,
    password: adminPassword,
    scriptPath: scriptPath,
  }), { encoding: 'utf8' });
}).then(function() {
  console.log('Adding hook to LocalSettings.php');
  return fs.appendFile(path.join(IP, 'LocalSettings.php'), [
    '',
    '// Hook for additional configuration by ' + packageJson.name,
    'if (isset($_SERVER["CONTEXT"]) && isset($_SERVER["CONTEXT"]->mwHook)) {',
    '  $_SERVER["CONTEXT"]->mwHook($GLOBALS);',
    '}',
    '',].join('\n'), 'utf8');
}).then(function() {
  console.log('Done!');
}).done();
