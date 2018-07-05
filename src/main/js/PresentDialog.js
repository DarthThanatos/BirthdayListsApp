import Modal from 'react-modal';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client_react');
const follow = require('./follow');
import { Col,Row, Button, Form, FormGroup, Label, Input, FormText,Modal as ModalB, ModalBody, ModalFooter }  from 'reactstrap';
import ReactPencil from "react-pencil"
import $ from 'jquery'

export default class PresentDialog extends React.Component{

    constructor(props){
		super(props);
		this.state = {
		    currentImgLink: props.present.imageUrl,
            showChangeIconBtn: "none",
            nameErrorMsg: "",
            canSubmit:true,
            disabledMode:false,
            name: props.present.name,
            description: props.present.description,
            category:  props.present.category,
            shopLink:  props.present.shopLink,
            imageUrl:  props.present.imageUrl,
		};
		this.handleImgLinkChange = this.handleImgLinkChange.bind(this)
		this.changeIcon = this.changeIcon.bind(this)

		this.checkName = this.checkName.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
        this.showConfirmDialog = this.showConfirmDialog.bind(this)
        this.handleCloseConfirmDialog = this.handleCloseConfirmDialog.bind(this)
    }



    handleImgLinkChange(event){
        this.setState(
            {
                showChangeIconBtn : event.target.value != this.state.currentImgLink ? "flex" : "none",
                tmpImgLink : event.target.value
            }
        )
    }
    handleCloseConfirmDialog() {
        this.setState({showConfirmDialog: false});
    }

    changeIcon(){
        this.setState({currentImgLink: this.state.tmpImgLink, showChangeIconBtn:"none"})
    }

    checkName(){
        this.setState({nameErrorMsg : this.refs.name.value == "" ? "Pole nazwy nie może być puste" : "", canSubmit: this.refs.name.value != ""})
    }
    handleChange(event) {
        this.setState({[event.target.id]: event.target.value});
    }

    showConfirmDialog() {
        this.setState({showConfirmDialog: true});
    }

    handleSubmit(){
        this.setState({showConfirmDialog: false})
        const present = {
            presentId: this.props.present.presentId,
            name: this.state.name,
            description: this.state.description,
            category: this.state.category,
            shopLink: this.state.shopLink,
            imageUrl: this.state.imageUrl,
            wishListKey: this.props.listKey
        }
        console.log(present)
        this.props.handleSubmitPresentDialog(present)
    }

    render(){
        var width = 750, height = 550

        var sectionStyle = {
            width: width,
            height: height
        }

        return (

        <Form>
            <h1 style={{padding: "0.4em"}} className="text-center">{this.props.title}</h1>
            <Row>
                <Col sm="6">
                    <FormGroup row>
                        <Label for="nazwa" sm={3}>Nazwa</Label>
                        <Col sm={9}>
                            <Input value={this.state.name} onChange={this.handleChange.bind(this)} type="text" ref="name" id="name" placeholder="Nazwa prezentu" />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="stronaSklepu" sm={3}>Strona sklepu</Label>
                        <Col sm={9}>
                            <Input value={this.state.shopLink} onChange={this.handleChange.bind(this)} ref="shopLink" type="url" name="stronaSklepu" id="shopLink" placeholder="Link do produktu w sklepie" />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="kategoria" sm={3}>Kategoria</Label>
                        <Col sm={9}>
                            <Input value={this.state.category} onChange={this.handleChange.bind(this)} ref="category" type="select" name="kategoria" id="category">
                                <option value="Inne">Inne</option>
                                <option value="Gry">Gry</option>
                                <option value="Książki">Książki</option>
                                <option value="Filmy">Filmy</option>

                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="opis" sm={3}>Opis</Label>
                        <Col sm={9}>
                            <Input onChange={this.handleChange.bind(this)} ref="description" style={{resize:"none"}} rows="8" type="textarea" name="opis" id="description" />
                        </Col>
                    </FormGroup>

                </Col>
                <Col sm="6">
                    <img style={{ width: "50%", height:"50%"}} src={this.state.currentImgLink} onError={(e)=>{e.target.src="img/default_present_img.png"}}></img>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", fontWeight: "bold", fontSize:22}}>
                        Link ikonki prezentu
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                        <input onChange={this.handleChange.bind(this)} ref="imageUrl" id="imageUrl" type="text" placeholder="Link ikonki" defaultValue={this.state.currentImgLink}
                               style={{width:"75%", height:"auto", textAlign: "center", border: "none", resize: "none", borderBottom: "1px solid grey", overflow:"hidden"}}/>
                    </div>
                    <div style={{  display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop:10}}>
                        <Button color="secondary" style={{display: this.state.showChangeIconBtn, flexDirection: "row", justifyContent: "center", alignItems: "center"}} onClick={this.changeIcon}>Zmień ikonkę</Button>
                    </div>
                </Col>
            </Row>
            <div className="text-center" style={{padding: "1em"}}>
                <Button style={{marginRight:"0.5em"}} color="primary" ref="submit" onClick={this.showConfirmDialog} disabled={!this.state.canSubmit || this.state.disabledMode}>Zatwierdź</Button>
                <Button style={{marginLeft:"0.5em"}} color="secondary" disabled={this.state.disabledMode} ref="cancel" onClick={this.props.handleClosePresentDialog}>Anuluj</Button>
            </div>
            <ModalB style={{position: "relative", top: "20vh"}}  isOpen={this.state.showConfirmDialog}>
                <ModalBody className="text-center">
                    <h4 >Jesteś pewien ?</h4>
                </ModalBody>
                <ModalFooter style={{justifyContent: "center"}}>
                    <Button className="text-center" color="primary" onClick={() => {this.handleSubmit()}}>Tak</Button>{' '}
                    <Button className="text-center" color="secondary" onClick={() => {this.handleCloseConfirmDialog()}}>Nie</Button>{' '}
                </ModalFooter>
            </ModalB>
        </Form>
        )
    }
}

