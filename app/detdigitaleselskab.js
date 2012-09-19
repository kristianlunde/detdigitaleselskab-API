var mysql = require('mysql');

module.exports = {

	connection : null, 

	connect : function(config) {
	
		this.connection = mysql.createConnection(config);
		this.handleDisconnect(this.connection);
		this.connection.on('error', function() {
		});

	},

	handleDisconnect : function(connection) {
		var me = this;
		connection.on('error', function(err) {
	    	if (!err.fatal) {
		    	return;
			}

			if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
				throw err;
			}

			console.log('Re-connecting lost connection: ' + err.stack);

			connection = mysql.createConnection(connection.config);
			me.handleDisconnect(connection);
			connection.connect();
		});
	},
												
	disconnect : function() {
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
	},

	log : function(url, method, ip, headers,  callback) {
		var query = 'INSERT INTO api_log (`url`, `ip`, `method`, `headers`) VALUES ( ' +
					this.connection.escape(url) + ', ' +
					this.connection.escape(ip) + ', ' +
					this.connection.escape(method) + ', ' +
					this.connection.escape(JSON.stringify(headers)) + ');';
	
		this.connection.query(query, function(err, rows, fields) {
			if(err) throw err;
		});

		if(callback !== undefined) {
			return callback();
		}
	}
};
