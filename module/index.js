'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var fwkUtil = require('../util');

var ModuleGenerator = yeoman.generators.NamedBase.extend({
	init: function() {
		console.log('Scaffolding a new module called ' + this.name + '.');
		this.capName = fwkUtil.capName(this.name);
		this.lowerName = fwkUtil.lowerName(this.name);
	},
	files: function() {
		var self = this;

		this.copy('_module.js', 'server/app/modules/' + this.name + '.js');

		var conf = {
			path: path.join(this.destinationRoot(), '/server/config/local.js'), //path to the config file
			key: self.name, //key to add to the config file
			object: {}, //object to set the config[key] to
			log: self.log //a logging function for success
		};
		fwkUtil.updateConfig(conf);

		//update prod config
		conf.path = path.join(this.destinationRoot(), '/server/config/prod.js');
		fwkUtil.updateConfig(conf);
	}
});

module.exports = ModuleGenerator;