# generator-fwk

> [Yeoman](http://yeoman.io) generator for fwk

## What is FWK (placeholder name)
FWK is a module-based framework for creating a nodejs application server.  It builds on the nodejitsu module structure and provides a core module, an express server instance,  an optional mongo database connection (using mongoose), and a eventListener instance that can be used to talk between modules.

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

The generator will ask you a number of questions to fill out the package.json file for the project, and will then ask you if you want to set up your database server information and the db name.  If you choose not to set up mongo now, you can always enable it by adding the following to your config file (make sure you use valid json or the module generators will fail to parse the config when adding new properties):

```
{
	"db": "mongodb://localhost/db-name"
}
```


## Provided Modules

### app

The application entry point is located in the root directory app.js.  This file loads the appropriate config file based on passed in -env or -e flag.  Defaults to local.  This file also sets up code in production to swallow all error messages.  You probably want to change this to do some type of logging.  After loading the config, the entry point will bootstrap the app, located in server/app.js

Events emitted:
  * ``database:connected`` - When the mongoDB connection has been established, args: mongoose instance
  * ``models:loaded`` - When all models have been loaded from server/app/models
  * ``modules:loaded`` - When all modules have been loaded from server/app/modules


### server

The module that instantiates the express server

Events emitted:
  * ``server:configure`` - When the express app and http server have been created, args: express instance, http.createServer instance
  * ``server:routes`` - when modules should bind their specific routes, args: express instance
  * ``server:genericRoutes`` - when modules should bind their generic catch-all routes (like /*) - this is so they don't conflict with any specific routes in the routing table, args: express instance
  * ``server:ready`` - the http server has been bound to the port and is ready to serve requests

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
