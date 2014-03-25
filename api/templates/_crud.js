/*
Depends on: Module, Server, Page Model

Subscribes:
	server:routes
*/
var util = require('util');
var express = require('express');

var Module = require('../core/module').Module;

var <%=objectName%> = exports.<%=objectName%> = function(options, events, models) {
	
	options.<%=lowerModel%>Model = models.<%=lowerModel%>;

	//call parent constructor
	Module.call(this, options);
	var self = this;

	var apiOptions = self.options.get('<%=name%>Api');

	events.on('server:configure', function(app){
		app.use(express.bodyParser());
	});

	events.on('server:routes', function(app) { self.route(app); });
};

util.inherits(<%=objectName%>, Module);

<%=objectName%>.prototype.route = function(app){
	var <%=capModel%>Model = this.options.get('<%=lowerModel%>Model');

	//define an unhandled route handler
	app.get('<%=route%>', function(req,res) {
		<%=capModel%>Model.find(function(err, pages) {
			if (err) {
				console.log('api index error', err);
				res.send(404);
				return;
			}
			res.send(pages);
		});
	});
	app.get('<%=route%>/:id', function(req,res) {
		<%=capModel%>Model.findOne({_id: req.params.id}, function(err, page) {
			if (err) {
				console.log('api get error', err);
				res.send(404);
				return;
			}
			res.send(page);
		});
	});

	app.post('<%=route%>/', save);
	app.post('<%=route%>/:id', save);

	function save(req,res) {
		<%=capModel%>Model.findOne({_id: req.params.id}, function(err, page) {
			if (err) {
				console.log('api update error', err);
				return;
			}
			//no page found to update
			if (!page && req.params.id) {
				console.log('not found', req.params.id);
				res.send(404);
				return;
			}

			//create
			if (!page) {
				page = new <%=capModel%>Model();
			}

			//update (or add to created)
			for (var prop in req.body) {
				if (req.body.hasOwnProperty(prop)) {
					page[prop] = req.body[prop];
				}
			}

			page.date = Date.now();

			page.save(function(err){
				if (err) {
					res.send(err);
					return;
				}
				//send it back
				res.send(page);
			}); //we assume this saves
		});
	}

	app.del('<%=route%>/:id', del);

	function del(req,res) {
		if (!req.params.id) {
			res.send(404);
			return;
		}
		<%=capModel%>Model.remove({_id: req.params.id}, function(err) {
			if (err) {
				res.send(500);
				return;
			}
			res.send({
				success: true
			});
		});
	}
};