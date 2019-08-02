import React, {Fragment} from 'react';
import {AxesFields, LabelledRange} from "../elements/AxesFields";
import { Input, NumberInput } from "../elements/LabelledText";
import { SourceSelector } from "../elements/ModeSelector";
import './ReadForm.css';

export default function ReadForm(props) {
	// Prepare the variants of onChange for the field types
	const onTextChange = (source, value) => {
		props.onChange({type: "string", field: source}, value);
	}
	const onNumberChange = (source, value) => {
		props.onChange({
			type: "number",
			field: source,
		}, value);
	}
	const onRangeChange = (source, bound, value) => {
		props.onChange({
			type: "range",
			field: source,
			bound: bound
		}, value);
	}
	const onAxesChange = (source, direction, bound, value) => {
		props.onChange({
			type: "axes",
			axis: source,
			direction: direction,
			bound: bound,
		}, value);
	}
	const onFeatureChange = (source, value) => {
		props.onChange({
			type: "features",
			field: source,
		}, value);
	}
	const data = props.data;
	// We use props.sourceType to determine what fields are shown
	let fields;
	if (props.sourceType === 'boatParts') { // boatParts
		fields = (
			<Fragment>
				<div className="textFields">
					<NumberInput
						name="Boat"
						label="Boat ID:"
						value={data.Boat}
						onChange={onNumberChange}
					/>
					<NumberInput
						name="Part"
						label="Part ID (skip fields marked with 'Part' if you enter this):"
						value={data.Part}
						onChange={onNumberChange}
					/>
					<NumberInput
						name="Parent"
						label="Parent Part ID:"
						value={data.Part}
						onChange={onNumberChange}
					/>
					<Input
						name="Heading"
						label="Heading:"
						value={data.Heading}
						onChange={onTextChange}
					/>
					<Input
						name="Spec_Heading"
						label="Spec Heading:"
						value={data.Spec_Heading}
						onChange={onTextChange}
					/>
					<Input
						name="Features"
						label="Features (Comma separated):"
						value={data.Features}
						onChange={onFeatureChange}
					/>
					<Input
						name="Location"
						label="Location (on boat):"
						value={data.Location}
						onChange={onTextChange}
					/>
					<Input
						name="Manufacturer"
						label="Preferred Manufacturer (Part):"
						value={data.Manufacturer}
						onChange={onTextChange}
					/>
					<Input
						name="Model"
						label="Model Number (Part):"
						value={data.Model}
						onChange={onTextChange}
					/>
					<Input
						name="Hyperlink"
						label="Hyperlink (Part):"
						value={data.Hyperlink}
						onChange={onTextChange}
					/>
					<Input
						name="BuilderID"
						label="BuilderID (Part):"
						value={data.BuilderID}
						onChange={onTextChange}
					/>
					<Input
						name="Category"
						label="Category (Part):"
						value={data.Category}
						onChange={onTextChange}
					/>
					<Input
						name="Electrical"
						label="Electrical (Part):"
						value={data.Electrical}
						onChange={onTextChange}
					/>
					<Input
						name="Unit_Of_Measurement"
						label="Units of Measurement (Part):"
						value={data.Unit_Of_Measurement}
						onChange={onTextChange}
					/>
					<Input
						name="Source"
						label="Source (Part):"
						value={data.Source}
						onChange={onTextChange}
					/>
					<LabelledRange
						name="Weight_Per_Unit"
						label="Weight Per Unit (Part):"
						value={data.Weight_Per_Unit}
						onChange={onRangeChange}
					/>
					<LabelledRange
						name="Quantity"
						label="Quantity"
						value={data.Quantity}
						onChange={onRangeChange}
					/>
					<Input
						name="Material_And_Color"
						label="Material / Color:"
						value={data.Material_And_Color}
						onChange={onTextChange}
					/>
					<Input
						name="Size"
						label="Size (Part)"
						value={data.Size}
						onChange={onTextChange}
					/>
				</div>
				<AxesFields
					cg={data.Center_Of_Gravity}
					moment={data.Moment_Of_Inertia}
					onChange={onAxesChange}
				/>
			</Fragment>
		);
	} else { // parts
		fields = (
			<Fragment>
				<div className="textFields">
					<NumberInput
						name="Part"
						label="Part ID (This will cause all other fields to be ignored):"
						value={data.Part}
						onChange={onNumberChange}
					/>
					<Input
						name="Manufacturer"
						label="Manufacturer:"
						value={data.Manufacturer}
						onChange={onTextChange}
					/>
					<Input
						name="Model"
						label="Model Number:"
						value={data.Model}
						onChange={onTextChange}
					/>
					<Input
						name="Hyperlink"
						label="Hyperlink:"
						value={data.Hyperlink}
						onChange={onTextChange}
					/>
					<Input
						name="BuilderID"
						label="BuilderID:"
						value={data.BuilderID}
						onChange={onTextChange}
					/>
					<Input
						name="Category"
						label="Category:"
						value={data.Category}
						onChange={onTextChange}
					/>
					<Input
						name="Electrical"
						label="Electrical:"
						value={data.Electrical}
						onChange={onTextChange}
					/>
					<Input
						name="Unit_Of_Measurement"
						label="Units of Measurement:"
						value={data.Unit_Of_Measurement}
						onChange={onTextChange}
					/>
					<Input
						name="Source"
						label="Source:"
						value={data.Source}
						onChange={onTextChange}
					/>
					<LabelledRange
						name="Weight_Per_Unit"
						label="Weight Per Unit:"
						value={data.Weight_Per_Unit}
						onChange={onRangeChange}
					/>
					<Input
						name="Size"
						label="Size:"
						value={data.Size}
						onChange={onTextChange}
					/>
				</div>
			</Fragment>
		);
	}
	return (
		<div className="ReadForm">
			<SourceSelector templateChoice={props.sourceType} onTemplateChange={props.onSourceChange}/>
			<form onSubmit={props.onSubmit}>
				{fields}
				<input type="submit" value="Submit"/>
			</form>
		</div>
	);
}