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
module.exports = {
	Boat,
	Part,
	BoatPart,
	PartFeature,
	Spec_Heading,
}