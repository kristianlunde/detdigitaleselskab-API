var dds = require('./detdigitaleselskab');

module.exports = {
	
	_dds : null,

	init : function(dds) {
		this._dds = dds;
		return this;
	},

	nextEvent : function(callback) {
		this._dds.getAttendantsForNextEvent(function(rows) {
			var data = {
		    	event: undefined,
		   		attendants : []
			};  
			rows.forEach(function(row) {
				if(data.event === undefined) {
					data.event = {
			        	venue : row.venue,
				 		address : row.venue_street,
				        mapUrl : row.map,
				        when : row.when
					};  
				}   
				data.attendants.push({
					name : row.name,
					twitter : row.twitter,
					words : row.desc,
					registered : row.created
				}); 
			});
			return callback(data);
		});
	},

	events : function(url, callback) {
		var baseEndpoint = url + '/event/';
		dds.getEventsByAttendantsCount(function(rows) {
			var data = [];
		  	rows.forEach(function(row) {
				data.push({
		    		when : row.when,
					venue : row.venue,
					address : row.venue_street,
					mapUrl : row.map,
					attendants : row.attendants,
					endpoint : baseEndpoint + row.id
				});              
		    });
			return callback(data);
		});
	},

	eventById : function(id, callback) {
		dds.getEventById(id, function(rows) {
			var data = {
				when : undefined, 
				venue : undefined, 
				address : undefined,
				mapUrl : undefined,
				attendants : []
			};
			rows.forEach(function(row) {
				if(data.when === undefined) {
					data.when = row.when;
					data.venue = row.venue;
					data.address = row.venue_street;
					data.mapUrl = row.map;
				}

				data.attendants.push({
					name : row.name,
					twitter : row.twitter,
					words : row.desc,
					registered : row.created
				});
			});
			return callback(data);
		});
	}
};
