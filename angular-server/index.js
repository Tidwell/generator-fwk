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
			message: 'What is the uri for this angular app (defaults to the entire domain eg. example.com/ )?',
			default: '/'
		}];

		this.prompt(prompts, function(props) {
			this.folder = props.name;
			this.uri = props.uri;

			done();
		}.bind(this));
	},

	files: function() {
		var self = this;
		if (this.folder) {
			this.mkdir('public/' + this.folder);
		}
		this.copy('_angularServer.js', 'server/app/modules/angularServer.js');
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
		var resolvedFolder = this.folder ? this.folder + '/' : '';

		configObj.angularServer = {
			staticDirectory: '/public/' + resolvedFolder + 'app',
			uriPath: this.uri
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


		this.log('You\'re ready to cd to public/' + (this.folder ? this.folder : '') + ' and run yo angular');
	}
});

module.exports = AngularServerGenerator;