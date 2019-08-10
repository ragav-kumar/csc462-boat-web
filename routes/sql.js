var express = require('express');
var router = express.Router();

const {performance} = require('perf_hooks');
const mysql = require('mysql');
/*const connection = mysql.createConnection({
	host:     process.env.MYSQL_host,
	user:     process.env.MYSQL_user,
	password: process.env.MYSQL_password,
	database: process.env.MYSQL_database,
});*/
const dbSQL = require('../dbSQL');
const common = require('../common');

const pool = mysql.createPool({
	connectionLimit: process.env.MYSQL_connection_limit,
	host:     process.env.MYSQL_host,
	user:     process.env.MYSQL_user,
	password: process.env.MYSQL_password,
	database: process.env.MYSQL_database,
});

const queryHandler = (req, res, next) => {
	//connection.connect();
	t0 = performance.now();
	console.log(req.sql);
	pool.getConnection((err, connection) => {
		if (err) {
			res.json({
				success: false,
				error: err,
			});
			connection.release();
		} else {
			const t1 = performance.now() - t0;
			connection.query(req.sql, (err, rows, fields) => {
				if (err) {
					res.json({
						success: false,
						error: err,
					})
					connection.release();
				} else if (req.timeOnly) {
					res.json({
						requestTime: performance.now() - t0,
						queueTime: t1,
					});
				} else {
					res.json({
						requestTime: performance.now() - t0,
						queueTime: t1,
						data: rows,
					});
				}
				connection.release();
			})
		}
	});
	//connection.end();
}
router.get('/', (req, res) => {
	queryHandler(req.query, res, null);
});
router.post('/', (req, res) => {
	queryHandler(req.body, res, null);
});
module.exports = router;