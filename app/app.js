var dds = require('./detdigitaleselskab'),
	api = require('./api'),
	http = require('http'),
	url = require('url'),
	jsonHttpResponse = require('./JsonHttpResponse'),
	config = require('./config');

api.init(dds);

http.createServer(function(request, response) {
	response.writeHeader(200, {"Content-Type": "application/json"});  
	var uri = url.parse(request.url);
	var path = uri.pathname;
	var eventPattern = new RegExp(/^\/event\/[0-9]+$/)
	var intPattern = new RegExp(/[0-9]+$/);

	if(path === '/favicon.ico') {
		response.writeHeader(200, {'Content-Type' : 'image/x-icon'});
		response.end();
		return false;
	}

	jsonHttpResponse.responseObject(response);

	dds.connect(config.database);
	
	
	//Log request
	var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
	if(path !== '/favicon.ico') {
		dds.log(path, request.method, ip, request.headers);
	}
	//abort if the request method is something different than GET
	if(request.method !== 'GET') {
		return jsonHttpResponse.data({error : 'Method error! This api only accept GET requests'})
							.respond();
	}

	if(path === '/') {
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
	dds.disconnect();
})
.listen(config.http.port, config.http.vhost, function(){
	console.log('server running on ' + config.http.vhost + ':' + config.http.port);
})
.on('error', function(exception) {
	console.log(exception);
});
