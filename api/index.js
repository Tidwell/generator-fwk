'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var fwkUtil = require('../util');


var ApiGenerator = yeoman.generators.NamedBase.extend({
	init: function() {},
	askFor: function() {
		var self = this;
		var done = this.async();

		this.log('Generating API');

		var prompts = [{
			name: 'model',
			message: 'What is the model?',
			required: true
		}, {
			name: 'route',
			message: 'What is the route?',
			default: 'api/'+this.name
		}];

		this.prompt(prompts, function(props) {
			this.model = props.model;
			this.capModel = fwkUtil.capName(this.model);
			this.lowerModel = fwkUtil.lowerName(this.model);
			this.route = '/'+props.route;
			this.objectName = fwkUtil.capName(this.name);

			this.configKey = this.name+'Api';

			done();
		}.bind(this));
	},


	files: function() {
		var self = this;
		this.mkdir('server/app/modules/api');
		this.template('_crud.js', 'server/app/modules/api/'+this.name+'.js');

		var configPath = path.join(this.destinationRoot(), '/server/config/local.js');
		var conf = {
			path: configPath, //path to the config file
			key: self.configKey, //key to add to the config file
			object: {}, //object to set the config[key] to
			log: self.log //a logging function for success
		};
		fwkUtil.updateConfig(conf);

		//update prod config
		conf.path = path.join(this.destinationRoot(), '/server/config/prod.js');
		fwkUtil.updateConfig(conf);
	}
});

module.exports = ApiGenerator;