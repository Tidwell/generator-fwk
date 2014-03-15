'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var fs = require('fs');
var fwkUtil = require('../util');

var AngularServerGenerator = yeoman.generators.NamedBase.extend({
	init: function() {},
	askFor: function() {
		var self = this;
		var done = this.async();

		this.log('Generating angularServer');

		var prompts = [{
			name: 'uri',
			message: 'What is the uri for this angular app (for the entire domain eg. example.com/ use / )?',
			default: this.name
		}, {
			name: 'folder',
			message: 'What is the folder for this angular app?',
			default: this.name
		}];

		this.prompt(prompts, function(props) {
			this.folder = props.folder;
			this.uri = props.uri;
			this.objectName = fwkUtil.capName(this.name);

			done();
		}.bind(this));
	},

	files: function() {
		var self = this;
		
		//make the folders and copy the files
		if (this.folder) {
			this.mkdir('public/' + this.folder);
		}
		this.copy('_angularServer.js', 'server/app/modules/'+this.name+'Server.js');

		var configPath = path.join(this.destinationRoot(), '/server/config/local.js');
		
		//add the trailing slash if they specified a folder
		var resolvedFolder = this.folder ? this.folder + '/' : '';
		//add the leading slash
		var resolvedUri = this.uri[0] === '/' ? this.uri : '/'+this.uri;

		var conf = {
			path: configPath, //path to the config file
			key: self.name+'Server', //key to add to the config file
			object: {
				staticDirectory: '/public/' + resolvedFolder + 'app',
				uriPath: resolvedUri
			}, //object to set the config[key] to
			log: self.log //a logging function for success
		};
		fwkUtil.updateConfig(conf);

		//update prod config
		conf.path = path.join(this.destinationRoot(), '/server/config/prod.js');
		fwkUtil.updateConfig(conf);

		this.log('You\'re ready to cd to public/' + resolvedFolder + ' and run yo angular');
		this.log('After you initialize your angular app, make sure you add <base href="'+resolvedUri+'/"> to the HEAD of your index.html');
	}
});

module.exports = AngularServerGenerator;