# node-mediawiki-express
[![NPM][NPM1]][NPM2]

[![Build Status][1]][2] [![dependency status][3]][4] [![dev dependency status][5]][6]

The node `mediawiki-express` package uses the [`php-embed`] package to
embed [MediaWiki] with a node [`express`] server.

This is a proof-of-concept for a "single integrated install" of
MediaWiki, which will eventually bundle Parsoid and other PHP and
JavaScript services into a single server.

We hope to eventually allow easy addition of extensions and skins via
npm.  See https://phabricator.wikimedia.org/T114457 for more discussion.

# USAGE

To start a HTTP server on port 1234:
```sh
mediawiki -p 1234
```

Your wiki will then be found at http://localhost:123/wiki/

# API

To customize or extend your MediaWiki server, you can use the
JavaScript API.

## mwExpress.runServer(options)
Starts an express web server on a specified port, with `/w` and `/wiki`
routed to a MediaWiki installation.  The MediaWiki can be customized
via the `options` parameter.
*   `options`: an object containing various parameters for the server.
    All are optional.
    - `serverName`: the server name to pass to PHP, which will be used
        as part of MediaWiki's generated URLs. Defaults to
        `localhost`.
    - `serverPort`: the port on which to start the server.  Defaults
        to 8080.
    - `localSettingsHook`: a JavaScript function which will be invoked
        at the end of MediaWiki's `LocalSettings.php` file, and passed
        PHP's [`$GLOBALS`] array as its first parameter.  This allows
        you to customize the settings for the wiki.
    - `expressHook`: a JavaScript function which will be invoked after
        the MediaWiki-related routes have been set up on the express
        [`app`] object.  It is passed the [`app`] object as its first
        parameter.  This allows you to add additional routes to the
        server before starting it.  The `/` route will be added *after*
        `expressHook` returns (as a redirect to the main page of the
        wiki), so you can override the `/` route in this hook if you
        wish.

# INSTALLING

You can use [`npm`](https://github.com/isaacs/npm) to download and install:

* The latest `mediawiki-express` package: `npm install mediawiki-express`

* GitHub's `master` branch: `npm install https://github.com/cscott/node-mediawiki-express/tarball/master`

As a postinstall script, npm will configure mediawiki and create an
SQLite database for it to use.  It will create an admin account and
store its credentials in `admin.json` for you.

# TESTING

Currently `npm test` only runs a linter.  Hopefully in the future we
can hook up phantomjs to run the mediawiki test suite.

# CONTRIBUTORS

* [C. Scott Ananian](https://github.com/cscott)

# RELATED PROJECTS

* [`php-embed`](https://github.com/cscott/node-php-embed):
  Provides the bidirectional Node<->PHP embedding.
* [`php-express`](https://github.com/fnobi/php-express):
  A similar embedding of PHP into a Node.js server, but forks
  the PHP CLI binary in a separate process instead of embedding PHP.
* [`php-cgi`](https://www.npmjs.com/package/php-cgi):
  Another implementation forking the php binary and forging a
  CGI request.

# LICENSE
Copyright (c) 2015 C. Scott Ananian.

`mediawiki-express` is licensed using the same
[license](https://github.com/wikimedia/mediawiki/blob/master/COPYING)
as mediawiki itself.

[`php-embed`]: https://github.com/cscott/node-php-embed
[MediaWiki]: https://github.com/wikimedia/mediawiki
[`express`]: http://expressjs.com/
[`$GLOBALS`]: http://php.net/manual/en/reserved.variables.globals.php
[`app`]: http://expressjs.com/4x/api.html#app

[NPM1]: https://nodei.co/npm/mediawiki-express.png
[NPM2]: https://nodei.co/npm/mediawiki-express/

[1]: https://travis-ci.org/cscott/node-mediawiki-express.png
[2]: https://travis-ci.org/cscott/node-mediawiki-express
[3]: https://david-dm.org/cscott/node-mediawiki-express.png
[4]: https://david-dm.org/cscott/node-mediawiki-express
[5]: https://david-dm.org/cscott/node-mediawiki-express/dev-status.png
[6]: https://david-dm.org/cscott/node-mediawiki-express#info=devDependencies
