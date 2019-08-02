import React from 'react';
import {TextArea} from "../elements/LabelledText";
import { SourceSelector } from "../elements/ModeSelector";
import './WriteForm.css';

const WriteForm = (props) => {
	return(
		<div className="WriteForm">
			<form onSubmit={props.onSubmit}>
				<TextArea
					name="input-json"
					label="Insert JSON of data to be written."
					value={props.input}
					onChange={props.onChange}
				/>
				<input type="submit" value="Submit"/>
			</form>
			<SourceSelector templateChoice={props.targetType} onTemplateChange={props.onTargetChange}/>
		</div>
	);
}
export default WriteForm;