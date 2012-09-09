var config = {}

config.database = {
		host : 'localhost',
		user : 'root',
		password : '', 
		database : 'detdigitaleselskab',
		insecureAuth : true
};

config.http = { 
		port : 8080,
		vhost : '127.0.0.1'
};

config.api = {
		name : 'Det Digitale Selskab API',
		version : '0.3',
		endpoints : [
			{url : '/event/next', method : 'GET', description : 'Get information about the up and coming event'},
			{url : '/events', method : 'GET', description : 'List all events'},
			{url : '/event/<ID>', method : 'GET', description :  'List information about an event, where <ID> is an integer value'},
		]
};   
 module.exports = config;
