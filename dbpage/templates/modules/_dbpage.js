/*
Depends on: Module, Server, Page Model

Subscribes:
	server:configure
	server:before-start
*/
var util = require('util');

var Module = require('./core/module').Module;

var PageModel = require('../models/page');

var mustacheExpress = require('mustache-express');

var <%=objectName%>DbPage = exports.<%=objectName%>DbPage = function(options, events, models) {
	//call parent constructor
	options.pageModel = models.page;
	Module.call(this, options);
	var self = this;

	var pagesOptions = self.options.get('<%=name%>DbPage');
	events.on('server:configure', function(app){
		// Register '.html' extension with The Mustache Express
		app.engine('html', mustacheExpress(self.generateStaticDirectory('/'+pagesOptions.viewsDirectory), '.html'));

		app.set('view engine', 'mustache');
		app.set('views', self.generateStaticDirectory(pagesOptions.viewsDirectory));
	});
	events.on('server:genericRoutes', function(app){
		//define an unhandled route handler
		app.get('*', function(req,res){
			//see if we have it in the database
			self.options.get('pageModel').findOne({
				'url': req.url
			}, function(err, page) {
				if (err) {
					pagesOptions.error(err);
					return;
				}
				if (page) {
					res.render('page.html', page);
					return;
				}
				//otherwise we cant find it, so 404
				res.send(404);
			});
		});
	});

};

util.inherits(<%=objectName%>DbPage, Module);