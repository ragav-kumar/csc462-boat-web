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
function Part(PartID, HeadingRef, Spec_HeadingRef, Features, Model, Hyperlink, Source, Weight, Material_And_Color, Size) {
	return {
		PartID: PartID,
		HeadingRef: HeadingRef,
		Spec_HeadingRef: Spec_HeadingRef,
		Features: Features,
		Model: Model,
		Hyperlink: Hyperlink,
		Source: Source,
		Weight: Weight,
		Material_And_Color: Material_And_Color,
		Size: Size,
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