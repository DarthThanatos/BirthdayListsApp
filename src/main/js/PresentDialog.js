import Modal from 'react-modal';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client_react');
const follow = require('./follow');


export default class PresentDialog extends React.Component{

    render(){
        var sectionStyle = {
            width: 700,
            height: 550,
            background: "#666666"
        }

        return (
            <div ref="PresentDialogDiv" style={sectionStyle}>
                <div style={{ width:700, height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    <input id="name" type="text" placeholder="Nazwa prezentu" value={this.props.present.name}/>
                </div>
                <div style={{ width:700, height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    <button onClick={this.props.handleClosePresentDialog}>Zamknij</button>
                </div>
            </div>
        )
    }
}
