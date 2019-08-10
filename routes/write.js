var express = require('express');
var router = express.Router();

const {performance} = require('perf_hooks');
const mysql = require('mysql');
const randomWords = require('random-words');

const queryHandler = (req, res) => {
	if (!req.doWrite) { // Keep write count sane
		return;
	}
	// Headings. We make 50 of these.
	const headings = randomWords({
		exactly: 50,
		wordsPerString: 2,
	});
	const materials = randomWords({
		exactly: 10,
	})
	let specHeadings = [];
	// Generate 5 specHeadings per Heading
	headings.forEach(h => {
		specHeadings.push({
			// heading: 
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