var config = {}

config.database = {
		host : 'localhost',
		user : 'root',
		password : '', 
		database : 'detdigitaleselskab'
};

config.http = { 
		port : 8080
};

config.api = {
		name : 'Det Digitale Selskab API',
		version : '0.2',
		endpoints : [
			{url : '/event/next', method : 'GET', description : 'Get information about the up and coming event'},
			{url : '/events', method : 'GET', description : 'List all events'},
			{url : '/event/<ID>', method : 'GET', description :  'List information about an event, where <ID> is an integer value'},
		]
};   
 module.exports = config;
