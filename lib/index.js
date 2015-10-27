// Main entry point.
var express = require('express');
var path = require('path');
var php = require('php-embed');

var IP = path.join(__dirname, '..', 'ip');
process.env.MW_INSTALL_PATH = IP;
process.env.PATH =
  '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin';

var makeServer = function(port) {
  var app = express();
  app.get('/', function(req, res) {
    res.redirect('/wiki/');
  });
  var handlePhp = function(phpfile, pathinfo, req, res) {
    php.request({
      file: path.join(IP, phpfile + '.php'),
      request: req,
      stream: res,
      serverInitFunc: function(server) {
        server.SERVER_NAME = 'localhost'; // XXX
        server.SCRIPT_NAME = '/w/' + phpfile + '.php';
        server.PHP_SELF = server.REQUEST_URI;
        server.PATH_INFO = '/' + pathinfo;
        // According to PHP's cgi_main.c:
        // PATH_TRANSLATED = DOCUMENT_ROOT + PATH_INFO
        server.DOCUMENT_ROOT = '/var/www'; // Lie
        server.PATH_TRANSLATED = server.DOCUMENT_ROOT + '/' + pathinfo;
        // Console.log("PHP request:", server.SCRIPT_NAME, server.QUERY_STRING);
      },
      context: {
        mwHook: function(globals) {
          // XXX We can't actually set any globals, because
          // node-php-embed doesn't yet wrap PHP arrays.
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
  app.get('/wiki/?*', function(req, res) {
    res.send('Hello, world!');
  });
  app.use('/w', express.static(IP));
  var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
  });
  return server;
};

module.exports.makeServer = makeServer;
