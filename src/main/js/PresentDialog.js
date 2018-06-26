import Modal from 'react-modal';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client_react');
const follow = require('./follow');

import ReactPencil from "react-pencil"
import $ from 'jquery'

export default class PresentDialog extends React.Component{

    constructor(props){
		super(props);

		this.state = {currentImgLink: props.present.imageUrl, showChangeIconBtn: "none", nameErrorMsg: "", canSubmit:true, disabledMode:false}

		this.handleImgLinkChange = this.handleImgLinkChange.bind(this)
		this.changeIcon = this.changeIcon.bind(this)

		this.checkName = this.checkName.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
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
        this.setState({currentImgLink: this.state.tmpImgLink, showChangeIconBtn:"none"})
    }

    checkName(){
        this.setState({nameErrorMsg : this.refs.name.value == "" ? "Pole nazwy nie może być puste" : "", canSubmit: this.refs.name.value != ""})
    }

    handleSubmit(){
        const present = {
            presentId: this.props.present.presentId,
            name: this.refs.name.value,
            description: this.refs.description.value,
            category: this.refs.category.value,
            shopLink: this.refs.shopLink.value,
            imageUrl: this.refs.imgLink.value,
            wishListKey: this.props.listKey
        }
        this.props.handleSubmitPresentDialog(present)
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

                        <div>
                            <div style={{height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                                <h3 style={{marginRight: 5}}>Nazwa prezentu</h3>
                                <input ref="name" id="name" type="text" placeholder="Nazwa prezentu"
                                    style={{width:"100%", textAlign: "center", border: "none", borderBottom: "1px solid grey", wordBreak: "breakWord"}}
                                    defaultValue={this.props.present.name} onChange={this.checkName}/>
                            </div>
                            <div style={{textAlign: "center", fontSize: 18, color: "red", marginLeft: 75}}>
                                {this.state.nameErrorMsg}
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <h3 style={{marginRight: 5}}>Link do strony sklepu</h3>
                            <input ref="shopLink" id="shopLink" type="text" placeholder="Link do sklepu" defaultValue={this.props.present.shopLink} style={{width:"100%", textAlign: "center", border: "none", borderBottom: "1px solid grey"}}/>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <h3 style={{marginRight: 5}}>Opis prezentu</h3>
                            <textArea ref="description" id="description" rows={15} style={{ border: "solid 1px", width:"100%"}} defaultValue={this.props.present.description}/>
                        </div>
                        <div style={{  display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <h3 style={{marginRight: 5}}>Kategoria prezentu</h3>
                            <select ref="category" id="category" style={{width:"100%"}} defaultValue={this.props.present.category}>
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
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <input ref="imgLink" id="imgLink" type="text" placeholder="Link ikonki" onChange={this.handleImgLinkChange} defaultValue={this.state.currentImgLink}
                            style={{width:"75%", height:"auto", textAlign: "center", border: "none", resize: "none", borderBottom: "1px solid grey", overflow:"hidden"}}/>
                        </div>
                        <div style={{ height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <button style={{display: this.state.showChangeIconBtn}} onClick={this.changeIcon}>Zmień ikonkę</button>
                        </div>
                    </div>
                </div>
                <div style={{ height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop:10, marginBottom:20}}>
                    <button ref="submit" onClick={this.handleSubmit} disabled={!this.state.canSubmit || this.state.disabledMode} style={{borderRadius: "12px", width:150, height: 40, background: "#FF8C2F"}}>Zatwierdź</button>
                    <button disabled={this.state.disabledMode} ref="cancel" onClick={this.props.handleClosePresentDialog} style={{marginLeft:5, borderRadius: "12px", width:150, height: 40, background: "#FF8C2F"}}>Anuluj</button>
                </div>
            </div>
        )
    }
}

