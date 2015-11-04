// Main entry point.
var express = require('express');
var path = require('path');
var php = require('php-embed');

var IP = path.join(__dirname, '..', 'ip');
process.env.MW_INSTALL_PATH = IP;
process.env.PATH =
  '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin';

var runServer = function(options) {
  options = options || Object.create(null);
  var serverName = options.serverName || 'localhost';
  var serverPort = options.serverPort;
  if (typeof serverPort !== 'number') { serverPort = 8080; }
  var localSettingsHook = options.localSettingsHook;
  var expressHook = options.expressHook || (function() {});
  var enableTests = options.enableTests || false;
  var app = express();
  var handlePhp = function(phpfile, pathinfo, req, res) {
    php.request({
      file: path.join(IP, phpfile + '.php'),
      request: req,
      stream: res,
      serverInitFunc: function(server) {
        server.SERVER_NAME = serverName;
        server.SCRIPT_NAME = '/w/' + phpfile + '.php';
        server.PHP_SELF = server.REQUEST_URI;
        server.PATH_INFO = '/' + pathinfo;
        // According to PHP's cgi_main.c:
        // PATH_TRANSLATED = DOCUMENT_ROOT + PATH_INFO
        server.DOCUMENT_ROOT = '/var/www'; // Lie
        server.PATH_TRANSLATED = server.DOCUMENT_ROOT + '/' + pathinfo;
        if (false /* Useful for debugging. */) {
          console.log('PHP request:', server.REQUEST_METHOD,
                      server.SCRIPT_NAME, server.QUERY_STRING);
        }
      },
      context: {
        mwHook: function(globals) {
          if (enableTests) {
            globals.set('wgEnableJavaScriptTest', true);
          }
          // Allow end user to do additional config.
          if ((typeof localSettingsHook) === 'function') {
            localSettingsHook(globals);
          }
        },
      },
    }).catch(function(e) {
      console.error('PHP error:', e);
    }).then(function() {
      res.end();
    });
  };
  app.all('/wiki/?*', function(req, res) {
    handlePhp('index', req.params[0], req, res);
  });
  app.all('/w/:file.php/?*', function(req, res) {
    handlePhp(req.params.file, req.params[0], req, res);
  });
  // This next path is used when running the QUnit test suite.
  app.all('/w/tests/qunit/data/:file.php/?*', function(req, res) {
    handlePhp('tests/qunit/data/' + req.params.file, req.params[0], req, res);
  });
  app.get('/wiki/?*', function(req, res) {
    res.send('Hello, world!');
  });
  app.use('/w', express.static(IP));
  var server = app.listen(serverPort, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
  });
  expressHook(app); // Allow end user to add additional routes.
  // If `expressHook` didn't already add a route for `/`, add one here
  // to redirect to the main page of the wiki.
  app.get('/', function(req, res) {
    res.redirect('/wiki/');
  });
  // Ditto for a favicon.
  app.get('/favicon.ico', function(req, res) {
    res.redirect('/w/favicon.ico');
  });
  return server;
};

module.exports.runServer = runServer;
