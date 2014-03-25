'use strict';
var fs = require('fs');

module.exports = {
	updateConfig: updateConfig,
	capName: capName,
	lowerName: lowerName
};

/* Expects an object containing
{
	path: '' //path to the config file
	key: '' //key to add to the config file
	object: {} //object to set the config[key] to
	env: 'local' //the string env for error messages
	log: function() {} //a logging function for success
}

*/
function updateConfig(opt) {
	var configPath = opt.path;
	var objectKey = opt.key;
	var object = opt.object;
	var env = opt.env;
	var log = opt.log;

	var configString = fs.readFileSync(configPath, 'utf8');
	var prepend = 'module.exports = ';
	var append = ';';
	
	configString = configString.replace(prepend, '').replace(append, '');

	var configObj;

	try {
		configObj = JSON.parse(configString);
	} catch(e) {
		throw 'There was a problem parsing ' + configPath + '  Please verify that your config is valid JSON';
	}
	if (configObj[objectKey]) {
		console.log('There is already a config option for ' + objectKey + ' please choose a different name or delete the existing config entry');
	}

	configObj[objectKey] = object;
	fs.unlink(configPath, function(err) {
		if (err) {
			throw err;
		}
		fs.writeFile(configPath, prepend + JSON.stringify(configObj, null, 4) + append, function(err) {
			if (err) { throw err; }
			log('Your config file at ' + configPath + ' has been updated.');
		});
	});
}

function capName(str) {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

function lowerName(str) {
	return str.toLowerCase();
}

