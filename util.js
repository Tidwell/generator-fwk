'use strict';
var fs = require('fs');

module.exports = {
	updateConfig: updateConfig
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
		throw 'There is already a module defined as ' + objectKey + ' please choose a different name or delete the existing module';
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