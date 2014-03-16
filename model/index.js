'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var fwkUtil = require('../util');

var ModelGenerator = yeoman.generators.NamedBase.extend({
  init: function () {
    console.log('Scaffolding a new model called ' + this.name + '.');
    this.capName = fwkUtil.capName(this.name);
	this.lowerName = fwkUtil.lowerName(this.name);
  },

  files: function () {
    var self = this;

		this.copy('_model.js', 'server/app/models/' + this.name + '.js');
  }
});

module.exports = ModelGenerator;