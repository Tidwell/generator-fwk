'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var fwkUtil = require('../util');

var DbpageGenerator = yeoman.generators.NamedBase.extend({
	init: function() {
		var done = this.async();
		this.log('Generating dbPage');

		var prompts = [{
			name: 'folder',
			message: 'What is the folder to store the templates in?',
			default: 'server/app/templates'
		}];

		this.prompt(prompts, function(props) {
			this.folder = props.folder;
			this.objectName = fwkUtil.capName(this.name);

			done();
		}.bind(this));
	},

	files: function() {
		var self = this;
		var configPath = path.join(this.destinationRoot(), '/server/config/local.js');
		
		//add the trailing slash if they specified a folder
		var resolvedFolder = this.folder ? this.folder + '/' : '';

		var conf = {
			path: configPath, //path to the config file
			key: self.name+'DbPage', //key to add to the config file
			object: {
				viewsDirectory: '/'+resolvedFolder
			}, //object to set the config[key] to
			log: self.log //a logging function for success
		};
		fwkUtil.updateConfig(conf);

		//update prod config
		conf.path = path.join(this.destinationRoot(), '/server/config/prod.js');
		fwkUtil.updateConfig(conf);

		console.log(resolvedFolder)
		this.mkdir(resolvedFolder);
		this.template('modules/_dbpage.js', 'server/app/modules/'+this.name+'DbPage.js');
		this.copy('models/_page.js', 'server/app/models/page.js');
		this.copy('templates/_page.html', resolvedFolder+'page.html');

		var exec = require('child_process').exec
	    var child;

		child = exec('cd server && npm install mustache-express --save && cd ../', function(error, stdout, stderr) {
			if (error !== null) {
				console.log('error installing mustache-express.  Please install manually from the server/ directory: ' + error);
			}
		});
	}
});

module.exports = DbpageGenerator;