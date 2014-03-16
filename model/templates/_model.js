/*
	<%=capName%> Model
*/

var <%=capName%> = exports.<%=capName%> = function(options, mongoose) {
	var self = this;
	var Schema = mongoose.Schema;

	var <%=lowerName%>Schema = new Schema({
		//model properties go here
	});

	var <%=capName%>Model = mongoose.model('<%=capName%>', <%=lowerName%>Schema);

	return <%=capName%>Model;
};