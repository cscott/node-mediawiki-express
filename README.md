# node-mediawiki-express
[![NPM][NPM1]][NPM2]

[![Build Status][1]][2] [![dependency status][3]][4] [![dev dependency status][5]][6]

The node `mediawiki-express` package uses the [`php-embed`] package to
embed [MediaWiki] with a node [`express`] server.

This is a proof-of-concept for a "single integrated install" of
MediaWiki, which will eventually bundle Parsoid and other PHP and
JavaScript services into a single server.

We hope to eventually allow easy addition of extensions and skins via
npm.

# USAGE

To start a HTTP server on port 1234:
```sh
mediawiki -p 1234
```

Your wiki will then be found at http://localhost:123/wiki/

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

* [`node-php-embed`](https://github.com/cscott/node-php-embed)

# LICENSE
Copyright (c) 2015 C. Scott Ananian.

`node-mediawiki-express` is licensed using the same
[license](https://github.com/wikimedia/mediawiki/blob/master/COPYING)
as mediawiki itself.

[`php-embed`]: https://github.com/cscott/node-php-embed
[MediaWiki]: https://github.com/wikimedia/mediawiki
[`express`]: http://expressjs.com/

[NPM1]: https://nodei.co/npm/mediawiki-express.png
[NPM2]: https://nodei.co/npm/mediawiki-express/

[1]: https://travis-ci.org/cscott/node-mediawiki-express.png
[2]: https://travis-ci.org/cscott/node-mediawiki-express
[3]: https://david-dm.org/cscott/node-mediawiki-express.png
[4]: https://david-dm.org/cscott/node-mediawiki-express
[5]: https://david-dm.org/cscott/node-mediawiki-express/dev-status.png
[6]: https://david-dm.org/cscott/node-mediawiki-express#info=devDependencies
