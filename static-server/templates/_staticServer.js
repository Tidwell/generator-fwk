/*
	Depends on: Module, Server

	Subscribes:
		server:routes - adds angular routes to the server
*/
var util = require('util');
var path = require('path');
var fs = require('fs');
var express = require('express');

var Module = require('./core/module').Module;

var <%=objectName%>Server = exports.<%=objectName%>Server = function(options, events) {
	//call parent constructor
	Module.call(this, options);
	var self = this;

	var serverOptions = self.options.get('<%=name%>Server');

	//generate the absolute path from the config
	serverOptions.staticPath = self.generateStaticDirectory('/'+serverOptions.staticDirectory);

	//add the static frontend server
    events.on('server:configure', function(app){
        app.use(express.static(serverOptions.staticPath));
    });
};

util.inherits(<%=objectName%>Server, Module);