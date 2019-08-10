var express = require('express');
var router = express.Router();

const {performance} = require('perf_hooks');
const mysql = require('mysql');
const randomWords = require('random-words');

const randInt = max => Math.floor(Math.random() * Math.floor(max));


const pool = mysql.createPool({
	connectionLimit: process.env.MYSQL_connection_limit,
	host:     process.env.MYSQL_host,
	user:     process.env.MYSQL_user,
	password: process.env.MYSQL_password,
	database: process.env.MYSQL_database,
});

const queryHandler = (req, res) => {
	if (!req.doWrite) { // Keep write count sane
		return;
	}
	/*const headingQuery = "INSERT INTO `headings` (`name`) VALUES (\"AC Systems\"), (\"Anchoring System and Chain Containment\"), (\"Bilge System\"), (\"Black Water System\"), (\"Bonding & Protection\"), (\"Bow Thruster System\"), (\"Cable & Cable Trays\"), (\"Captain's Stateroom & Head\"), (\"Coatings\"), (\"Communication Equipment\")";
	const specHeadingQuery = "INSERT INTO `specHeadings` (`heading`,`name`) VALUES (1,\"AC Distribution\"), (8,\"Main Generators\"), (9,\"Shore Supply #1\"), (3,\"Shore Supply #2\"), (6,\"Anchoring System Primary Components\"), (5,\"Bilge System Forepeak\"), (7,\"Bilge System Lazarette\"), (9,\"Bilge System, Bilge Aft\"), (8,\"Bilge System, Bilge Forward\"), (6,\"Bilge System, Engineroom\"), (7,\"Bilge System, Mid Bilge\"), (9,\"Black Water System Tanks\"), (4,\"Blackwater  System Piping & Hose\"), (5,\"Blackwater  System Through Hulls\"), (9,\"Blackwater  System Valves\"), (1,\"Blackwater Miscellaneous Fittings\"), (8,\"Blackwater Piping\"), (4,\"Blackwater System Filters & Strainers\"), (5,\"Blackwater System Gauges & Monitoring\"), (7,\"Blackwater System Primary Features & Components\"), (6,\"Bonding & Protection Features & Components\"), (4,\"Zinc Assembly, Lazarette\"), (2,\"Bow Thruster System Primary Features and Components\"), (1,\"Cables, Cable Trays Features & Components\"), (7,\"Floor & Wall Coverings\"), (1,\"Furniture Assemblies\"), (3,\"Headliner System\"), (4,\"Lighting\"), (6,\"Miscellaneous Electronics & Accessories\"), (8,\"Miscellaneous Finish Joinerwork Casings / Trim etc\"), (7,\"Plumbing Fixtures\"), (1,\"SHOWER ASSEMBLY, CAPTAINS\"), (7,\"Shower Finish Assembly\"), (4,\"Hot Tub Surround FRP Parts\"), (3,\"(empty)\"), (3,\"Communication Equipment Features & Components Specification\"), (2,\"Deck Drain System, Attic\"), (8,\"Deck Drain System, Control Room\"), (1,\"Deck Drain System, Engine Room Rough In\"), (5,\"Deck Drain System, Equipment Room\"), (7,\"Deck Drain System, Guest Port Aft\"), (1,\"Deck Drain System, Guest Port Forward\"), (5,\"Deck Drain System, Guest Starboard Aft\"), (1,\"Deck Drain System, Guest Starboard Forward\"), (10,\"Deck Drain System, Lazarette\"), (8,\"Deck Drain System, Main Deck Aft\"), (9,\"Deck Drain System, Master Bathroom\"), (5,\"Deck Drain System, Salon\"), (3,\"Deck Drain System, Side Main Deck,  Port\"), (6,\"Deck Drain System, Side Main Deck,  Stbd\"), (7,\"Deck Drain System, Utility Room\"), (6,\"Dive Bottle Assembly\"), (9,\"Dive Compressor Piping, Control Room\"), (4,\"Dive Compressor System (Engine Room)\"), (9,\"Compressed Air Quick Connect Stations\"), (1,\"Compressed Air Stations Reel Station\"), (5,\"Compressed Air System Primary Features & Components\"), (8,\"Miscellaneous Piping, Hose & Fittings\"), (10,\"Valves\"), (9,\"Control Room, Finish\"), (10,\"Foundations & Fabrications\"), (4,\"Floor & Wall Coverings\"), (5,\"Furniture Assemblies\"), (5,\"Headliner System\"), (1,\"Lighting\"), (6,\"Miscellaneous Finish Joinerwork Casings / Trim etc\"), (1,\"Plumbing Fixtures\"), (9,\"Shower Assembly, Crew Port Forward\"), (1,\"Shower Finish Assembly\"), (3,\"Floor & Wall Coverings\"), (3,\"Furniture Assemblies\"), (1,\"Headliner System\"), (8,\"Lighting\"), (3,\"Miscellaneous Finish Joinerwork Casings / Trim etc\"), (2,\"Plumbing Fixtures\"), (8,\"Shower Assembly, Crew Head Starboard Forward\"), (10,\"Shower Finish Assembly\"), (6,\"Appliances\"), (10,\"Floor & Wall Coverings\"), (4,\"Furniture Assemblies\"), (10,\"Headliner System\"), (10,\"Lighting\"), (3,\"Miscellaneous Electronics & Accessories\"), (2,\"Miscellaneous Finish Joinerwork Casings / Trim etc\"), (9,\"Crew Stair Finish\"), (2,\"Floor & Wall Coverings\"), (9,\"Furniture Assemblies\"), (3,\"Headliner System\"), (8,\"Lighting\")";
	const materialsQuery = "INSERT INTO `materials` (`name`) VALUES (\"Aluminum\"), (\"Black\"), (\"Bronze\"), (\"Bronze / CuNi\"), (\"Bronze with SS Lever\"), (\"Brushed S.S.\"), (\"Ceramic\"), (\"Chrome\"), (\"Corecell\"), (\"CPVC\"), (\"Fiberglass\"), (\"FRP\"), (\"Hose\"), (\"Marble\"), (\"Nickel Silver\"), (\"PEX\"), (\"Polished Chrome\"), (\"Polished Nickel, Frosted Glass\"), (\"Polished SS\"), (\"Polished Stainless Steel\"), (\"Polyfoam\"), (\"Polyurethane\"), (\"PVC\"), (\"SS\"), (\"SS 304\"), (\"SS 316\"), (\"SS, Satin Finish\"), (\"Stainless Steel\"), (\"Steel\"), (\"TBD\"), (\"Unknown\")";*/
	// Generate base rows
	/*let query = "INSERT INTO `parts` (specHeading, model, link, source, weight, material_and_color, size) VALUES ";
	let values = []
	for (let i = 0; i < 1000; i++) {
		values.push(mysql.format(
			"(?, ?, ?, ?, ?, ?, ?)",
			randInt(250),
			randomWords(),
			randomWords(),
			randomWords(),
			Math.random() * 500,
			randInt(10),
			randomWords()
		));
	}
	query += values.join(", ");
	t0 = performance.now();*/
	// console.log(req.sql);
	pool.getConnection((err, connection) => {
		const t1 = performance.now() - t0;
		/*connection.query(headingQuery, (err, rows, fields) => {
			if (err) throw err;
			connection.query(specHeadingQuery, (err, rows, fields) => {
				if (err) throw err;
				connection.query(materialsQuery, (err, rows, fields) => {
					if(err) throw err;
					connection.release();
					res.json({success: true});
				})
			});
		})*/
		const query = "INSERT INTO `parts` (`specHeading`, `model`, `link`, `source`, `weight`, `material_and_color`, `size`) VALUE (?, ?, ?, ?, ?, ?, ?)";
		connection.query({
			sql: query,
			values: [
				randInt(90),
				randomWords(),
				randomWords(),
				randomWords(),
				Math.random() * 500,
				randInt(33),
				randomWords()
			],
		}, (err, rows, fields) => {
			if (err) {
				res.json({
					success: false,
					error: err,
				})
			};
			if (req.timeOnly) {
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
	});
}
router.get('/', (req, res, next) => {
	queryHandler(req.query, res);
});
router.post('/', (req, res, next) => {
	queryHandler(req.body, res);
});
module.exports = router;