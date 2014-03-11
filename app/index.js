'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var FwkGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('You\'re using the fantastic Fwk generator.'));

    var prompts = [{
      name: 'appName',
      message: 'What is the name of the app?'
    }, {
      name: 'appDescription',
      message: 'What is the description for the app?'
    }, {
      name: 'appAuthor',
      message: 'Who is the author for the app?'
    }, {
      name: 'dbServer',
      message: 'What is your mongo database server?',
      default: 'localhost'
    }, {
      name: 'dbName',
      message: 'What is the name of the database you would like to use?'
    }];

    this.prompt(prompts, function (props) {
      this.appName = props.appName;
      this.appDescription = props.appDescription;
      this.appAuthor = props.appAuthor;
      this.dbServer = props.dbServer;
      this.dbName = props.dbName;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('server');
    this.mkdir('server/app');
    this.mkdir('server/app/models');
    this.mkdir('server/app/modules');
    this.mkdir('server/app/modules/core');
    this.mkdir('server/config');
    this.mkdir('server/scripts');
    this.mkdir('public');

    this.template('_package.json', 'package.json');
    this.template('_README.md', 'README.md');
    this.copy('_build.sh', 'build.sh');
    this.copy('_app.js', 'app.js');

    this.template('server/_package.json', 'server/package.json');
    this.copy('server/app/modules/core/_module.js', 'server/app/modules/core/module.js');
    this.copy('server/app/modules/core/_server.js', 'server/app/modules/core/server.js');
    this.template('server/config/_local.js', 'server/config/local.js');
    this.template('server/config/_local.js', 'server/config/prod.js');

    this.copy('server/_app.js', 'server/app.js')

  },

  projectfiles: function () {
    
  }
});

module.exports = FwkGenerator;