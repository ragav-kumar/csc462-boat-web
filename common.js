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
function BoatPart(BoatPartID, BoatRef, PartRef, ParentBoatPartRef, LocationRef, Quantity, lcg, tcg, vcg, lm, tm, vm ) {
	return {
		BoatPartID: BoatPartID,
		BoatRef: BoatRef,
		PartRef: PartRef,
		ParentBoatPartRef: ParentBoatPartRef,
		LocationRef: LocationRef,
		Quantity: Quantity,
		lcg: lcg,
		tcg: tcg,
		vcg: vcg,
		lm: lm,
		tm: tm,
		vm: vm,
	}
}
function BoatPartFeature(BoatPartRef, FeatureRef) {
	return {
		BoatPartRef: BoatPartRef,
		FeatureRef: FeatureRef,
	}
}
module.exports = {
	Boat,
	Part,
	BoatPart,
	BoatPartFeature,
	Spec_Heading,
}