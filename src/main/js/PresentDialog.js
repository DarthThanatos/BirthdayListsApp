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
                    <div style={{width:(width/2)}}>
                        <div style={{height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <h3 style={{marginRight: 5}}>Nazwa prezentu</h3>
                            <input id="name" type="text" placeholder="Nazwa prezentu" style={{width:"100%", textAlign: "center", border: "none", borderBottom: "1px solid grey", wordBreak: "breakWord"}}  defaultValue={this.props.present.name}/>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <h3 style={{marginRight: 5}}>Link do strony sklepu</h3>
                            <input id="shopLink" type="text" placeholder="Link do sklepu" defaultValue={this.props.present.shopLink} style={{width:"100%", textAlign: "center", border: "none", borderBottom: "1px solid grey"}}/>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <h3 style={{marginRight: 5}}>Opis prezentu</h3>
                            <textArea id="description" rows={15} style={{ border: "solid 1px", width:"100%"}} >
                                {this.props.present.description}
                            </textArea>
                        </div>
                        <div style={{  display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <h3 style={{marginRight: 5}}>Kategoria prezentu</h3>
                            <select id="category" style={{width:"100%"}}>
                              <option value="Inne">Inne</option>
                              <option value="Gry">Gry</option>
                              <option value="Książki">Książki</option>
                              <option value="Filmy">Filmy</option>
                            </select>
                        </div>
                    </div>
                    <div style={{width:(width/2)}}>
                        <div style={{ height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", fontWeight: "bold", fontSize:22}}>
                           Wybierz ikonkę od prezentu
                        </div>

                        <div style={{ width: (width/2), height:200,  marginLeft: 5, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <img style={{border: "solid 1px", width: "50%", height:"90%"}} src={this.state.currentImgLink} onError={(e)=>{e.target.src="img/default_present_img.png"}}></img>
                        </div>

                        <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", fontWeight: "bold", fontSize:22}}>
                            Link ikonki prezentu
                        </div>
                        <div style={{ height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <input id="imgLink" type="text" placeholder="Link ikonki" onChange={this.handleImgLinkChange} defaultValue={this.state.currentImgLink} style={{width:"75%", textAlign: "center", border: "none", borderBottom: "1px solid grey"}}/>
                        </div>
                        <div style={{ height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <button style={{display: this.state.showChangeIconBtn}} onClick={this.changeIcon}>Zmień ikonkę</button>
                        </div>
                    </div>
                </div>
                <div style={{ height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop:10, marginBottom:20}}>
                    <button onClick={this.props.handleClosePresentDialog} style={{borderRadius: "12px", width:150, height: 40, background: "#FF8C2F"}}>Zatwierdź</button>
                    <button onClick={this.props.handleClosePresentDialog} style={{marginLeft:5, borderRadius: "12px", width:150, height: 40, background: "#FF8C2F"}}>Anuluj</button>
                </div>
            </div>
        )
    }
}
