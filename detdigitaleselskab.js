var mysql = require('mysql');

module.exports = {

	connection : null, 

	connect : function(config) {
	
		this.connection = mysql.createConnection(config);

	},

	end : function() {
		this.connection.end();
	},

	getAttendantsForNextEvent : function(callback) {
		var query = 'SELECT ' +
			'a.id, a.name, a.desc, a.twitter, a.created, ' +
			'e.id, e.venue, e.venue_street, e.map, e.when, e.created_at ' +
			'FROM attending a ' +
			'JOIN event e ON a.event_id = e.id ' +
			'WHERE e.current = 1 ORDER BY a.id ASC';

		this.connection.query(query, function(err, rows, fields) {
			if(err) throw err;

			return callback(rows);
		});
	},

	getEventById : function(id, callback) {
		var query = 'SELECT e.id, e.when, e.venue, e.venue_street, e.map, ' +
					'a.name, a.twitter, a.desc, a.created ' +
					'FROM event e LEFT JOIN attending a ON e.id = a.event_id WHERE e.id = ' + this.connection.escape(id);
		this.connection.query(query, function(err, rows, fields) {
			if(err) throw err;

			return callback(rows);
		});
	},

	getEventsByAttendantsCount : function(callback) {
		var query = 'SELECT e.id, e.venue, e.when, COUNT(1) AS "attendants" ' +
			'FROM attending a ' +
			'JOIN `event` e ON e.id = a.event_id ' +
			'GROUP BY e.id ' +
			'ORDER BY e.when DESC';

		this.connection.query(query, function(err, rows, fields) {
			if (err) throw err;

			return callback(rows);
		});
	}
};
