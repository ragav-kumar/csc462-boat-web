const common = require('./common');

const mysql = require('mysql');
const connection = mysql.createConnection({
	host:     process.env.MYSQL_host,
	user:     process.env.MYSQL_user,
	password: process.env.MYSQL_password,
	database: process.env.MYSQL_database,
});
/*
SQL CSV Columns:
Heading
Spec_Heading
Features
GCMNA Point Person
Builder  ID Number
Location
Category
Electrical
Preferred MFG
Model
Hyperlink
Weight Per Unit (LBS)
Quantity
LCG
TCG
VCG
Longitudinal Moment
Transverse Moment (Port is Neg.)
Vertical Moment
Material_And_Color
Size
*/

/*
Heading: '',
Spec_Heading: '',
Sorting_Nature_of_Info_Produced: "",
Features: "",
Model: "",
Hyperlink: "",
Source: "",
Material_And_Color: "",
Size: {min: -1, max: -1},
Weight_Per_Unit: {min: -1, max: -1},
Quantity: {min: -1, max: -1},
axes: {
	lcg: {min: -1, max: -1},
	tcg: {min: -1, max: -1},
	vcg: {min: -1, max: -1},
	lm: {min: -1, max: -1},
	tm: {min: -1, max: -1},
	vm: {min: -1, max: -1},
}
req.mode can be "read" or "write"
req.source can be "parts" or "boats". Former is for generic parts DB, latter for boatParts.
*/
const nameTables = [ // Just name and ID
	{ table: "headings", heading: "Heading" },
	{ table: "personnel", heading: "GCMNA_Point_Person" },
	{ table: "locations", heading: "Location" },
	{ table: "categories", heading: "Category" },
	{ table: "materials", heading: "Material_And_Color" },
	{ table: "manufacturers", heading: "Preferred_MFG" },
];
let tableData = { // We fill up this object during CSV read
	headings: new Map(),
	specHeadings: new Map(),
	personnel: new Map(),
	materials: new Map(),
	manufacturers: new Map(),
	locations: new Map(),
	features: new Map(),
	categories: new Map(),
	parts: new Map(),
	boats: new Map(),
	boatParts: new Map(),
	boatPartMeta: new Map(),
	boatPartFeatures: new Map(),
};
/** -----NEEDS TO BE REVISITED-----
 * Insert row(s) into the minor tables
 * @param {string} table Table to write to
 * @param {array} values Array of values to write to
 */
const insert = function (table, values) {
	if (table === 'features') return;

	let fields;
	if (table === 'specHeadings') {
		return;
		fields = "heading, name";
	} else {
		fields = "name";
	}

	let sql = `INSERT INTO ${table} (${fields}) VALUES `;
	values.forEach(row => {
		if (table === 'specHeadings') {
			sql += mysql.format("(?, ?), ", [row.heading, row.name]);
		} else {
			sql += mysql.format("(?), ", [row.name]);
		}
	});
	sql = sql.slice(0, -2);
	connection.query(sql, (err, res, fields) => {
		// console.log(`Attempt write to ${table}`);
		// console.log(sql);
		if (err) throw err;
		console.log(`Wrote to table \`${table}\``);
	});

};
/** -----NEEDS TO BE REVISITED-----
 * SpecHeadings are a supreme pain in the reare, because I need to test
 * heading before inserting specheading (Specheading are unique to a heading)
 */
const insertSpecHeadings = async() => {
	// connection.connect();

	let sql = `INSERT INTO \`specHeadings\` (\`heading\`, \`name\`) VALUES `;
	await tableData.specHeadings.forEach(e => {
		// Get heading index from text
		// quick query to get id from text
		try {
			connection.query({
				sql: "SELECT * FROM headings WHERE name=?",
				values: [e.headingRaw]
			}, (err, results, fields) => {
				if (err) throw err;

				sql += mysql.format("(?, ?), ", [results[0].id, e.name]);
			});
		} catch (error) {
			throw error;
		}
		
	});
	// Now that we've got both heading and name, we can run insert
	// sql = sql.slice(0, -2);
	connection.query(sql.slice(0, -2), (err, res, fields) => {
		// console.log(`Attempt write to ${table}`);
		console.log(sql.slice(0, -2));
		if (err) throw err;
		console.log(`Wrote to table \`specHeadings\``);
	});

	// connection.end();
	return JSON.stringify(tableData.specHeadings);
};
/** -----NEEDS TO BE REVISITED-----
 * Incomplete, IIRC. Runs a full DB Insert
 */
const runInsert = async () => {
	// 2. For specHeading
	tableData.specHeadings.forEach(e => {
		e.heading = tableData.headings.findIndex(x => x.name === e.headingRaw);
	});
	// connection.connect();
	// 3. Connect to DB and insert
	for (var t in tableData){
		if (tableData.hasOwnProperty(t)) {
			try {
				// console.log(t, tableData[t]);
				await insert(t, tableData[t]);
			} catch (error) {
				console.log(error)
			}
		}
	}
	// connection.end();
	return JSON.stringify(tableData);
}
/**
 * Get ID from name for certain fields
 * Probably avoidable with clever SQL
 * @param {string} table Table Name
 * @param {string} name Field value
 */
const getFieldRef = async(table, name) => {
	connection.query({
		sql: "SELECT * FROM " + table + " WHERE name=?",
		values: [name]
	}, (err, rows, fields) => {

		if (err) throw err;
		if (rows.length > 0) {
			return rows[0].id;
		}
	});
}
/**
 * Test value validity. i.e. Not null or empty string
 * @param {*} value Hopefully integer, but can be string
 */
function valueIsValid (value) {
	// Either it's truthy, or it's a number whose value is zero.
	return value || (!isNaN(value) && parseInt(value) === 0)
}

/**
 * Primary handler for front end requests.
 * @param {object} req Input object. JSON data is in req.body
 * @param {object} res Output. Make sure to write any output into res.json
 */
const handle_req = (req, res) => {
	connection.connect(); // Stay connected for duration of request
	const json = req.body;
	if (json.mode == "read") {
		//TODO: read
		// If a field is present and has a valid value (not empty for strings and >=0 for ints) then its used to filter output
		// Output:
		/*
		0: Heading
		1: Spec_Heading
		2: Sorting_Nature_of_Info_Produced
		3: Features
		4: Model
		5: Hyperlink
		6: Source
		7: Weight_Per_Unit
		8: Quantity
		9: LCG
		10: TCG
		11: VCG
		12: Longitudinal_Moment
		13: Transverse_Moment
		14: Vertical_Moment
		15: Material_And_Color
		16: Size
		*/
		let query; // This will contain our query!
		let inputObj;
		// READ:
		// Check fields. This might require multiple reads.
		if (json.dataType === "parts") {
			inputObj = common.Part(...{
				PartID: null,
				HeadingRef: getFieldRef("heading", json.Heading),
				Spec_HeadingRef: getFieldRef("specHeading", json.Spec_Heading),
				Features: json.Features,
				Model: json.Model,
				Hyperlink: json.Hyperlink,
				Source: json.Source,
				Weight: json.Weight, // This is a min-max range
				Material_And_Color: json.Material_And_Color,
				Size: json.Size,
			});
		} else { // boatParts
			inputObj = common.BoatPart(...{
				BoatPartID: null,
				BoatRef: json.Boat,
				PartRef: json.Part,
				ParentBoatPartRef: json.Parent,
				LocationRef: getFieldRead("locations", json.Location),
				Quantity: json.Quantity, // range
				lcg: json.Center_Of_Gravity.long, // range
				tcg: json.Center_Of_Gravity.tran, // range
				vcg: json.Center_Of_Gravity.vert, // range
				lm:  json.Moment_Of_Inertia.long, // range
				tm:  json.Moment_Of_Inertia.tran, // range
				vm:  json.Moment_Of_Inertia.vert, // range
			});
		}
		// Construct where
		let where = [];
		for (const key in inputObj) {
			if (inputObj.hasOwnProperty(key)) {
				const value = inputObj[key];
				if (key === 'Features') {
					continue;
				}
				if (typeof value === 'object') {// for ranges
					if (valueIsValid(value.min)) {
						where.push(key + ">=" + value.min);
					}
					if (valueIsValid(value.max)) {
						where.push(key + ">=" + value.max);
					}
				} else if (valueIsValid(value)) { // truthy or Zero are valid
					where.push(key + "=" + value);
				}
			}
		}
		// where now contains array of where clauses. Join them with ANDs
		query = "SELECT * FROM `" + json.dataType + "` WHERE " + where.join(' AND ');

		const t0 = performance.now();
		connection.query(query, (err, rows, fields) => {

			if (err) throw err;

			res.json({
				"success": true,
				"requestTime": performance.now() - t0,
				...rows
			});
		});
	} else if (json.mode == "write") {
		if (json.dataType == "parts") { // parts
			//
		} else { // boatParts
			//
		}
	} else {
		res.json({
			success: false,
			error: "Invalid mode",
		});
	}
	connection.end();
	// res.json({ ...req.body });
};

module.exports = {
	handle_req
}