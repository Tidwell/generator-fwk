'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var fwkUtil = require('../util');


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
      message: 'What is the name of the app?',
      validate: function(name) {
        if (!name) { return 'You must enter a name.'; }
        if (!/^[a-z0-9]+$/i.test(name)) { return 'The name can only contain A-Z a-z and 0-9.'; }
        return true;
      }
    }, {
      name: 'appDescription',
      message: 'What is the description for the app?'
    }, {
      name: 'appAuthor',
      message: 'Who is the author for the app?'
    }, {
      name: 'useDB',
      type: 'confirm',
      message: 'Would you like to set up your mongoDB connection information now?'
    }, {
      name: 'dbServer',
      message: 'What is your mongo database server?',
      default: 'localhost',
      when: function(answers){
        return answers.useDB;
      }
    }, {
      name: 'dbName',
      message: 'What is the name of the database you would like to use?',
      when: function(answers){
        return answers.useDB;
      }
    }];

    this.prompt(prompts, function (props) {
      this.appName = props.appName;
      this.appDescription = props.appDescription;
      this.appAuthor = props.appAuthor;

      this.useDB = props.useDB;
      this.dbServer = props.dbServer;
      this.dbName = props.dbName;

      done();
    }.bind(this));
  },

  app: function () {
    var self = this;

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

    this.copy('server/_app.js', 'server/app.js');
  },

  projectfiles: function () {
    
  },

  updateConfig: function() {
    var self = this;
    if (this.useDB) {
      var configPath = path.join(this.destinationRoot(), '/server/config/local.js');
      var conf = {
        path: configPath, //path to the config file
        key: 'db', //key to add to the config file
        object: 'mongodb://' + this.dbServer + '/' + this.dbName, //object to set the config[key] to
        log: self.log //a logging function for success
      };
      
      fwkUtil.updateConfig(conf);

      conf.path = path.join(this.destinationRoot(), '/server/config/prod.js');
      fwkUtil.updateConfig(conf);
    }
  }
});

module.exports = FwkGenerator;