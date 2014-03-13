# generator-fwk

> [Yeoman](http://yeoman.io) generator for fwk

## What is FWK (placeholder name)
FWK is a module-based framework for creating a nodejs application server.  It builds on the nodejitsu module structure and provides a core module, an express server instance,  a mongo database connection (using mongoose), and a eventListener instance that can be used to talk between modules.

Prebuilt modules can be added to the server to do a variety of tasks, such as serving angular apps, serving static files, communicating over websockets, or serving dynamic routes.  This generator provides the necessary scaffolding tools for using prebuilt modules or creating your own modules.

## Getting Started

```
$ npm install -g yo
```
```
$ npm install -g generator-fwk
```

Scaffold a new project:

```
$ yo fwk
```

The generator will ask you a number of questions to fill out the package.json file for the project, and will then ask you for your local database server information and what database you would like to use for this application.


## Provided Modules

### angularServer

Provides a static file server and serves the index.html file for all unmatched routes (so your angular app can handle routing).

```
$ yo fwk:angular-server serverName
```

This generator will request:
  * A folder to serve (located in public/)
  * A URI for the angular app (for root, enter /)
  * Both will default to the serverName

This will generate a serverNameServer.js file in the server/modules/ directory and a config entry in server/config/local.js

After running the generator, you can cd to public/serverName and run ```yo angular``` to scaffold a new angular app.

If not using the domain's root, be sure to modify your index.html to provide the proper base URL:
```
<base href="/URI/" />
```

## License
MIT
