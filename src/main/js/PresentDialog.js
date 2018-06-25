import Modal from 'react-modal';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client_react');
const follow = require('./follow');

import $ from 'jquery'

export default class PresentDialog extends React.Component{

    constructor(props){
		super(props);
		this.state = {currentImgLink: props.present.imageUrl, showChangeIconBtn: "none"}
		this.handleImgLinkChange = this.handleImgLinkChange.bind(this)
		this.changeIcon = this.changeIcon.bind(this)
		this.onIconCorrect = this.onIconCorrect.bind(this)
		this.onIconIncorrect = this.onIconIncorrect.bind(this)
    }

    handleImgLinkChange(event){
        this.setState(
            {
                showChangeIconBtn : event.target.value != this.state.currentImgLink ? "flex" : "none",
                tmpImgLink : event.target.value
            }
        )
    }

    changeIcon(){
        $.get(this.state.tmpImgLink)
            .done(this.onIconCorrect)
            .fail(this.onIconIncorrect)
    }

    onIconCorrect(){
        this.setState({currentImgLink: this.state.tmpImgLink, showChangeIconBtn:"none"})
    }

    onIconIncorrect(){
        console.log("failed to load image: " + this.state.tmpImgLink + "; last correct img link still on board")
    }

    render(){
        var width = 750, height = 550

        var sectionStyle = {
            width: width,
            height: height
        }

        return (
            <div ref="PresentDialogDiv" style={sectionStyle}>

                <div style={{ height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 50}}>
                    <h1>{this.props.title}</h1>
                </div>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <div style={{width:(width/2), height: height}}>
                        <div style={{ height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <input id="name" type="text" placeholder="Nazwa prezentu" value={this.props.present.name}/>
                        </div>
                        <div style={{ height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <input id="description" type="text" placeholder="Opis prezentu" value={this.props.present.description}/>
                        </div>
                        <div style={{ height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <input id="shopLink" type="text" placeholder="Link do sklepu" value={this.props.present.shopLink}/>
                        </div>
                        <div style={{ height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <input id="category" type="text" placeholder="Kategoria prezentu" value={this.props.present.category}/>
                        </div>
                        <div style={{ height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <button onClick={this.props.handleClosePresentDialog}>Zamknij</button>
                        </div>
                    </div>
                    <div style={{width:(width/2)}}>
                        <div style={{ height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                           Wybierz ikonkę od prezentu
                        </div>
                        <img style={{ width: (width/2), height:200, border: "solid 1px"}} src={this.state.currentImgLink} onError={(e)=>{e.target.src="img/default_present_img.png"}}></img>
                        <div style={{ height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <input id="imgLink" type="text" placeholder="Link ikonki" onChange={this.handleImgLinkChange}/>
                            <button style={{display: this.state.showChangeIconBtn}} onClick={this.changeIcon}>Zmień ikonkę</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
