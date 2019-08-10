//Object Constructors
function Boat(BoatID, Name) {
	return {
		BoatID: BoatID,
		Name: Name,
	}
}
function Spec_Heading(name, heading) {
	return {
		name: name,
		heading: heading,
	}
}
function Part(id, specHeading, Features, model, link, source, weight, material_and_color, size) {
	return {
		id: id,
		specHeading: specHeading,
		Features: Features,
		model: model,
		link: link,
		source: source,
		weight: weight,
		material_and_color: material_and_color,
		size: size,
	}
}
function BoatPart(id, boatID, partID, parent, location, quantity, lcg, tcg, vcg, lm, tm, vm ) {
	return {
		id: id,
		boatID: boatID,
		partID: partID,
		parent: parent,
		location: location,
		quantity: quantity,
		lcg: lcg,
		tcg: tcg,
		vcg: vcg,
		lm: lm,
		tm: tm,
		vm: vm,
	}
}
function PartFeature(part, feature) {
	return {
		part: part,
		feature: feature,
	}
}

var pool = mysql.createPool({
	connectionLimit: 10,
	host:     process.env.MYSQL_host,
	user:     process.env.MYSQL_user,
	password: process.env.MYSQL_password,
	database: process.env.MYSQL_database,
});

const connection = {
    query: function () {
        var queryArgs = Array.prototype.slice.call(arguments),
            events = [],
            eventNameIndex = {};

        pool.getConnection(function (err, conn) {
            if (err) {
                if (eventNameIndex.error) {
                    eventNameIndex.error();
                }
            }
            if (conn) { 
                var q = conn.query.apply(conn, queryArgs);
                q.on('end', function () {
                    conn.release();
                });

                events.forEach(function (args) {
                    q.on.apply(q, args);
                });
            }
        });

        return {
            on: function (eventName, callback) {
                events.push(Array.prototype.slice.call(arguments));
                eventNameIndex[eventName] = callback;
                return this;
            }
        };
    }
};

module.exports = {
	Boat,
	Part,
	BoatPart,
	PartFeature,
	Spec_Heading,
	connection,
}