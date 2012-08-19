var http = require('http');

module.exports = {
	
	_data : null,
	_responseObject : null,
	_statusCode : 200,

	data : function(data) {
		this._data = data;
		return this;
	},

	responseObject : function(responseObject) {
		this._responseObject = responseObject;
		return this;
	},

	statusCode : function(code) {
		this._statusCode = code;
		return this;
	},

	respond : function() {
		this._responseObject.writeHeader(this._statusCode, {'Content-Type' : 'application/json'});
		this._responseObject.write(JSON.stringify(this._data));
		this._responseObject.end();
	}
};
