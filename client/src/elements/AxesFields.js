import React from 'react'
import './AxesFields.css';

function AxesFields(props) {
	/*
	Center_Of_Gravity: {  // Most visually coherent approach is this way
		"long": { min: null, max: null },
		"tran": { min: null, max: null },
		"vert": { min: null, max: null },
	},
	Moment_Of_Inertia: {
		"long": { min: null, max: null },
		"tran": { min: null, max: null },
		"vert": { min: null, max: null },
	},
	*/
	// Need to send up source, direction, bound, value
	const handleChange = (axis, direction) => (name, bound, value) => {
		props.onChange(axis, direction, bound, value);
	}
	// I would rather write a ton of looping code than do this bit of repetition manually.
	// This was a terrible idea.
	const axes = [
		{
			label: "Center of Gravity",
			name: "Center_Of_Gravity",
			field: "cg",
		}, {
			label: "Moment of Inertia",
			name: "Moment_Of_Inertia",
			field: "moment",
		}
	];
	const directions = ["long", "tran", "vert"];
	let fields = {cg: [], moment: []};
	let key = 0;
	axes.forEach(a => {
		fields[a.field].push(<th key={key++}>{a.label}</th>);
		directions.forEach(d => {
			fields[a.field].push(
				<Range
					key={key++}
					wrapper="td"
					name={"axis-" + a.field + "-" + d}
					min={props[a.field][d].min}
					max={props[a.field][d].max}
					onChange={handleChange(a.field, d)}
				/>
			);
		});
	});
	return (
		<table className="axes-fields">
			<thead>
				<tr>
					<th></th>
					<th>Longitudinal</th>
					<th>Transverse</th>
					<th>Vertical</th>
				</tr>
			</thead>
			<tbody className="axis-fields">
				<tr>
					{fields.cg}
				</tr>
				<tr>
					{fields.moment}
				</tr>
			</tbody>
		</table>
	);
}
function Range(props) {
	const WrapperTag = (props.wrapper ? props.wrapper : "div");
	const name = props.name;
	return (
		<WrapperTag className="Range">
			<input
				type="number"
				name={name + "-min"}
				id={name + "-min"}
				value={props.min || ""}
				onChange={e => props.onChange(name, "min", e.target.value)}
			/>
			&nbsp;to&nbsp;
			<input
				type="number"
				name={name + "-max"}
				id={name + "-max"}
				value={props.max || ""}
				onChange={e => props.onChange(name, "max", e.target.value)}
			/>
		</WrapperTag>
	);
}
function LabelledRange(props) {
	const htmlFor = props.name + "-range";

	return(
		<div className="LabelledRange">
			<label htmlFor={htmlFor}>
				{props.label}
			</label>
			<Range
				name={props.name}
				min={props.min}
				max={props.max}
				onChange={props.onChange}
			/>
		</div>
	);
}
export {
	AxesFields,
	Range,
	LabelledRange
};