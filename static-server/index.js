'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var fs = require('fs');
var fwkUtil = require('../util');

var StaticServerGenerator = yeoman.generators.NamedBase.extend({
	init: function() {
		if (!fwkUtil.isRoot()) {
			throw 'Not in project root!';
		}
	},
	askFor: function() {
		var self = this;
		var done = this.async();

		this.log('Generating Static Server');

		var prompts = [{
			name: 'folder',
			message: 'What is the folder for the static files?',
			default: 'public/'
		}];

		this.prompt(prompts, function(props) {
			this.folder = props.folder;
			this.objectName = fwkUtil.capName(this.name);

			done();
		}.bind(this));
	},

	files: function() {
		var self = this;
		
		//make the folders and copy the files
		if (this.folder) {
			this.mkdir(this.folder);
		}
		this.copy('_StaticServer.js', 'server/app/modules/'+this.name+'Server.js');

		var configPath = path.join(this.destinationRoot(), '/server/config/local.js');
		
		//add the trailing slash if they specified a folder
		var resolvedFolder = this.folder[this.folder.length] !== '/' ? this.folder + '/' : this.folder;

		var conf = {
			path: configPath, //path to the config file
			key: self.name+'Server', //key to add to the config file
			object: {
				staticDirectory: resolvedFolder
			}, //object to set the config[key] to
			log: self.log //a logging function for success
		};
		fwkUtil.updateConfig(conf);

		//update prod config
		conf.path = path.join(this.destinationRoot(), '/server/config/prod.js');
		fwkUtil.updateConfig(conf);

		this.log('All done!');
	}
});

module.exports = StaticServerGenerator;