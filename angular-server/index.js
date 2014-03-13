'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var fs = require('fs');

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
		},{
			name: 'folder',
			message: 'What is the folder for this angular app?',
			default: this.name
		}];

		this.prompt(prompts, function(props) {
			this.folder = props.folder;
			this.uri = props.uri;
			this.objectName = this.name.charAt(0).toUpperCase() + this.name.slice(1)

			done();
		}.bind(this));
	},

	files: function() {
		var self = this;
		if (this.folder) {
			this.mkdir('public/' + this.folder);
		}
		var configPath = path.join(this.destinationRoot(), '/server/config/local.js');

		var configString = this.readFileAsString(configPath);
		var prepend = 'module.exports = ';
		var append = ';';
		configString = configString.replace(prepend, '').replace(append, '');

		try {
			var configObj = JSON.parse(configString);
		} catch(e) {
			throw 'There was a problem parsing your local config file.  Please verify that your config is valid JSON';
		}
		var resolvedFolder = this.folder ? this.folder + '/' : ''; //add the trailing slash if they specified a folder
		var resolvedUri = this.uri[0] === '/' ? this.uri : '/'+this.uri; //add the leading slash

		configObj[this.name+'Server'] = {
			staticDirectory: '/public/' + resolvedFolder + 'app',
			uriPath: resolvedUri
		};
		fs.unlink(configPath, function(err) {
			if (err) {
				throw err;
			}
			fs.writeFile(configPath, prepend + JSON.stringify(configObj, null, 4) + append, function(err) {
				if (err) { throw err; }
				self.log('Local config.js updated');
			})
		});

		this.copy('_angularServer.js', 'server/app/modules/'+this.name+'Server.js');


		this.log('You\'re ready to cd to public/' + resolvedFolder + ' and run yo angular');
	}
});

module.exports = AngularServerGenerator;