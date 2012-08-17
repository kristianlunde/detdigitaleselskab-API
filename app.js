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
		port : 8888
	},
	api : {
		version : '0.1',
		endpoints : {
			'/event/next' : 'Get information about the up and coming event',
			'/events' : 'List all events',
			'/event/<ID>' : 'List information about an event',
			'/locations' : 'List all locations',
			'/location/<ID>' : 'List information about events held on a location',  
		}
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
})
.listen(config.http.port)
.on('connection', function(stream) {
});
