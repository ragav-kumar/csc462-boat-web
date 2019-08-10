var express = require('express');
var router = express.Router();

const {performance} = require('perf_hooks');
const mysql = require('mysql');
const connection = mysql.createConnection({
	host:     process.env.MYSQL_host,
	user:     process.env.MYSQL_user,
	password: process.env.MYSQL_password,
	database: process.env.MYSQL_database,
});
const dbSQL = require('../dbSQL');

const queryHandler = (req, res, next) => {
	connection.connect();
	t0 = performance.now();
	connection.query(req.sql, (err, rows, fields) => {
		if (err) throw err;

		res.json({
			requestTime: performance.now() - t0,
			...rows,
		});
	})
	connection.end();
}
router.get('/', queryHandler);
router.post('/', queryHandler);
module.exports = router;