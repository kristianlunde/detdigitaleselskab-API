var dds = require('./detdigitaleselskab'),
	api = require('./api'),
	http = require('http'),
	url = require('url'),
	jsonHttpResponse = require('./JsonHttpResponse');

var config = {
	database : {
		host : 'localhost',
		user : 'root',
		password : '', 
		database : 'detdigitaleselskab'
	},
	http : {
		port : 8080
	},
	api : {
		name : 'Det Digitale Selskab API',
		version : '0.2',
		endpoints : [
			{url : '/event/next', method : 'GET', description : 'Get information about the up and coming event'},
			{url : '/events', method : 'GET', description : 'List all events'},
			{url : '/event/<ID>', method : 'GET', description :  'List information about an event, where <ID> is an integer value'},
		]
	}
};

dds.connect(config.database);

api.init(dds);

http.createServer(function(request, response) {
	response.writeHeader(200, {"Content-Type": "application/json"});  
	var uri = url.parse(request.url);
	var path = uri.pathname;
	var eventPattern = new RegExp(/^\/event\/[0-9]+$/)
	var intPattern = new RegExp(/[0-9]+$/);

	jsonHttpResponse.responseObject(response);

	//Log request
	var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
	dds.log(path, request.method, ip, request.headers);

	if(request.method !== 'GET') {
		return jsonHttpResponse.data({error : 'Method error! This api only accept GET requests'})
							.respond();
	}

	if(path === '/') {
		config.api.endpoints.forEach(function(endpoint) {
			endpoint.url = 'http://' + request.headers.host + endpoint.url;
		});
		
		jsonHttpResponse.data(config.api)
						.respond();

	} else if(path === '/event/next') {
		api.nextEvent(function(data) {
			jsonHttpResponse.data(data).respond();	
		});
	} else if(path === '/events') {
		api.events('http://' + request.headers.host, function(data) {
			jsonHttpResponse.data(data).respond();
		});
	} else if(eventPattern.test(path) && intPattern.exec(path) !== null) {
		var id = intPattern.exec(path);
		api.eventById(id[0], function(data) {
			if(data.when === undefined) {
				jsonHttpResponse.data({'error' : 'event not found'}).respond();
			} else {
				jsonHttpResponse.data(data).respond();
			}
		});
	} else {
		jsonHttpResponse.data('unknown endpoint')
						.statusCode(404)
						.respond();
	}
})
.listen(config.http.port);
