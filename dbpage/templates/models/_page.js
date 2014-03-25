/*
	Depends on: Model

*/

var Page = exports.Page = function(options, mongoose) {
	var self = this;
	var Schema = mongoose.Schema;

	var pageSchema = new Schema({
		title: String,
		url: String,
		body: String,
		date: {
			type: Date,
			default: Date.now
		},
	});

	var PageModel = mongoose.model('Pages', pageSchema);

	return PageModel;
};