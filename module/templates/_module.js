/*
	Depends on: Module, Server

	SERVER EVENTS
	Emits:
		
	Subscribes:
		server:routes - binds route for <%=lowerName%>
*/
var util = require('util');
var Module = require('./core/module').Module;

var <%=capName%> = exports.<%=capName%> = function(options, events) {
	//call parent constructor
	Module.call(this, options);
	var self = this;
	//cache the even emitter so we can access it later
	self.events = events;

	//get the options from the config file, and store them as <%=lowerName%>Options for access later
	var <%=lowerName%>Options = self.options.get('<%=lowerName%>');
	self.<%=lowerName%>Options = <%=lowerName%>Options;

	events.on('server:routes', function(expressApp){
		//add any routes - example route binds to /<%=lowerName%> and sends a {okay: true} json response
		expressApp.get('/<%=lowerName%>', function(req,res){
			res.json({okay: true});
		});
	});

	//bind to other events from core or from other modules
};

util.inherits(<%=capName%>, Module);

/*
 Add additional methods on the prototype below, so you can create methods for handling routes
 or anything else this module needs to do
*/
<%=capName%>.prototype.myMethod = function() {
	
};