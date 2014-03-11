module.exports = {
	"env": "local",
	"server": {
		"port": 8080
	},
	"db": "mongodb://<%= dbServer %>/<%= dbName %>"
};
