import React from 'react';
import './App.css';
import ReadForm from './form/ReadForm';
import QueryResult from './form/QueryResult';
import WriteForm from "./form/WriteForm";
import {ModeSelector} from "./elements/ModeSelector";
import Axios from 'axios';

const writeTemplates = {
	boatPart: { // This is the template for a `boatPart` write request. A switch will swap it out with a sample `part` write request
		Boat: 0, // ID #
		Part: 0, // ID #
		Heading: "",
		Spec_Heading: "",
		Features: [],
		Location: "",
		Manufacturer: "", // Preferred MFG, to be precise
		Quantity: 0,
		Parent: 0,
		Center_Of_Gravity: { "long": 0, "tran": 0, "vert": 0 },
		Moment_Of_Inertia: { "long": 0, "tran": 0, "vert": 0 },
		Material_And_Color: "",
	},
	part: {
		Manufacturer: "", // This needs to be here, I think, but its not preferred MFG. Maybe to distinguish multiple MFGs who make the same part?
		Model: "",
		Hyperlink: "",
		BuilderID: "",
		Category: "",
		Electrical: "",
		Unit_Of_Measurement: "",
		Source: "",
		Weight: 0.0,
		Size: "",
	}
}
class App extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			queryMode: 'read', // read, write
			dbChoice: 'sql',   // sql, mongo, both
			dataType: 'boatParts', // parts, boatParts
			//Read
			read: {
				Boat: null, // Boat ID #
				Part: null, // Part ID #
				Heading: null, // Heading text
				Spec_Heading: null, // Spec_Heading text
				Features: [], // Array of features
				Model: null, // Model text
				Hyperlink: null, // Valid URL
				Source: null, // text
				Manufacturer: null, // text. Corresponds to Preferred MFG in original data
				Location: null, // location on boat, needed for boatPart
				Category: null, // Category, part of Part (i.e. it's innate)
				Material_And_Color: null, // This should probably be "Or" TBH
				Size: null, // text, because mixed units
				Unit_Of_Measurement: null,
				Weight_Per_Unit: { min: null, max: null }, // This is part of why we need the units field
				Quantity: { min: null, max: null }, // This plus weight gives us Weight_Total
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
			},
			//Write
			write: JSON.stringify(writeTemplates.boatPart, null, 2), // Did you know you can force JSON to pretty print? I didn't.
		};
	}
	handleTemplateSwitch = (value) => {
		this.setState({
			dataType: value,
			write: JSON.stringify(writeTemplates[value], null, 2)
		})
	}
	handleReadChange = (source, value) => {
		// `source` is an object whose structure varies based on its `type` property.
		let read = this.state.read;
		switch (source.type) {
			case "string": // text field
			case "number": // number (ID) field which is not a range
				read[source.field] = value;
				break;
			case "range": // Numerical range (i.e. min & max)
				read[source.field][source.bound] = value;
				break;
			case "axes": // One of the two axes
				read[source.axis][source.direction][source.bound] = value;
				break;
			case "features": // For features, need to split value into an array
				read.Features = value.split(/[\s,]+/); // Allows spaces AND commas between features
				break;
			default: // error
				console.log("ERROR: INVALID CHANGE");
				return;
		}
		this.setState({read: read});
	}
	handleWriteChange = (event) => {
		this.setState({write: event.target.value});
	}
	handleSubmit = (event) => {
		event.preventDefault();
		// Two cases. Read => this is a form submit. Write => Send Textarea json
		let query = {
			mode: this.state.queryMode,
			source: this.state.dbChoice,
		};
		if (this.state.queryMode === 'read') { // Read
			query.args = this.state.read;
		} else { // write
			try {
				query.args = JSON.parse(this.state.write);
			} catch (error) {
				alert("Invalid JSON!");
				this.setState({result: error});
				return;
			}
		}
		// Okay, query built. Send it off to our controller!
		// const showResult = (json) => this.setState({result: json});
		Axios.post('/query', query)
			.then(response => {
				// this.setState({result: JSON.stringify(response.data, null, 2)});
				this.setState({result: response.data});
				console.log({...response.data});
			})
			// .error(error => this.setState({result: error}))
		;
	}
	render() {
		let form;
		// Decide which form to display based on Query mode
		if (this.state.queryMode === 'read') {
			form = (
				<ReadForm
					data={this.state.read}
					sourceType={this.state.dataType}
					onChange={this.handleReadChange}
					onSubmit={this.handleSubmit}
					onSourceChange={this.handleTemplateSwitch}
				/>
			);
		} else {
			form = (
				<WriteForm
					input={this.state.write}
					targetType={this.state.dataType}
					onChange={this.handleWriteChange}
					onSubmit={this.handleSubmit}
					onTargetChange={this.handleTemplateSwitch}
				/>
			);
		}
		return (
			<div className="App">
				<header className="App-header">
					<h1>Boat Data Store Query App</h1>
				</header>
				<ModeSelector
					choice={this.state.dbChoice}
					queryMode={this.state.queryMode}
					onChange={(source, value) => this.setState({ [source]: value })}
				/>
				<main>
					{form}
					<QueryResult result={this.state.result} />
				</main>
			</div>
		);
	}
}

export default App;
