import React from 'react';
import Radio from "./Radio";
import './ModeSelector.css';

function DBRadio(props) {
	return (
		<div className="DBRadio">
			<Radio
				value="sql"
				label="MySQL"
				checked={props.choice === "sql"}
				onChange={e => props.onChange(e)}
			/>
			<Radio
				value="mongo"
				label="MongoDB"
				checked={props.choice === "mongo"}
				onChange={e => props.onChange(e)}
			/>
			<Radio
				value="both"
				label="Both (Performance Comparison)"
				checked={props.choice === "both"}
				onChange={e => props.onChange(e)}
			/>
		</div>
	);
}

function ReadWriteRadio(props) {
	return (
		<div className="ReadWriteRadio">
			<Radio
				value="read"
				label="Read"
				checked={props.choice === "read"}
				onChange={e => props.onChange(e)}
			/>
			<Radio
				value="write"
				label="Write"
				checked={props.choice === "write"}
				onChange={e => props.onChange(e)}
			/>
		</div>
	);
}

function ModeSelector(props) {
	const handleChange = source => e => props.onChange(source, e.target.value);
	return (
		<div className="ModeSelector">
			<DBRadio
				choice={props.choice}
				onChange={handleChange("dbChoice")}
			/>
			<ReadWriteRadio
				choice={props.queryMode}
				onChange={handleChange("queryMode")}
			/>
		</div>
	);
}
/**
 * Inputs: template
 * @param {*} props 
 */
function SourceSelector(props) {
	return (
		<div className="SourceSelector">
			<h3>Replace contents with template JSON:</h3>
			<div>
				<Radio
					name="template-select"
					value="parts"
					label="New Part"
					checked={props.templateChoice === "parts"}
					onChange={e => props.onTemplateChange("parts")}
				/>
				<Radio
					name="template-select"
					value="boatParts"
					label="New BoatPart"
					checked={props.templateChoice === "boatParts"}
					onChange={e => props.onTemplateChange("boatParts")}
				/>
			</div>
		</div>
	);
}
export {
	ModeSelector,
	SourceSelector
};