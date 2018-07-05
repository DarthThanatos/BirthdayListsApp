'use strict';

import SearchBar from 'material-ui-search-bar'
import GridLayout from 'react-grid-layout'
import Modal from 'react-modal';
import PresentDialog from '../PresentDialog'
import Footer from "../Footer";
import Navbar from "./Navbar"
import '../loader.css'
import '../main.css'

import { Row, Col, Button, Modal as ModalB, ModalBody, ModalFooter,
    TabContent, TabPane, CardBody,Nav, NavItem, NavLink, Card, CardTitle, CardText,Form, FormGroup, Label,Input,UncontrolledTooltip
} from 'reactstrap';
import classnames from 'classnames';
const React = require('react');
const ReactDOM = require('react-dom');
const client = require('../client_react');
const follow = require('../follow');

import { Scrollbars } from 'react-custom-scrollbars';

const ALL = "all"
const RESERVED = "reserved"
const NOT_RESERVED = "not_reserved"

export default class GuestHome extends React.Component {

	constructor(props) {
		super(props);
		this.state = {token: "", showMailModal: false, showPresentDialog:false, mode:ALL, email: "", paginationOn: true};
		this.loadNewPage = this.loadNewPage.bind(this)
        console.log(classnames({ active: this.state.mode === ALL }))
        console.log(this.state.mode)
        classnames.bind(this)
        this.handleOpenMailModal = this.handleOpenMailModal.bind(this);
        this.handleCloseMailModal = this.handleCloseMailModal.bind(this);
        this.handleReservation = this.handleReservation.bind(this);
        this.changeMode = this.changeMode.bind(this);
        this.synchPresentsStates = this.synchPresentsStates.bind(this)
        this.onAfterSynch = this.onAfterSynch.bind(this);
        this.afterMailModalOpen = this.afterMailModalOpen.bind(this)
        this.handleOpenPresentDialog = this.handleOpenPresentDialog.bind(this)
        this.handleClosePresentDialog = this.handleClosePresentDialog.bind(this)
        this.handleSubmitEditPresentDialog = this.handleSubmitEditPresentDialog.bind(this)
        this.handleSubmitSuggestPresentDialog = this.handleSubmitSuggestPresentDialog.bind(this)

        this.onAfterPresentUpdateSubmitted = this.onAfterPresentUpdateSubmitted.bind(this)
        this.onAfterPresentSuggestionSubmitted = this.onAfterPresentSuggestionSubmitted.bind(this)
        this.setPagination = this.setPagination.bind(this)
        this.search = this.search.bind(this)
        this.getPresentsFromList = this.getPresentsFromList.bind(this)
	}


    registerMockedUser() {
		client({method: 'POST', path: '/auth/register', entity: {email: "bielas.robert95@gmail.com", password: 'user'},headers: {'Content-Type': 'application/json'}}).done(
            response => {
                console.log(response);
                this.login();
            },
            response => {
                console.log("invalid registering of mocked user")
                this.login(); //we are going to log in anyway
            }
		);
	}

    login(){
		client({method: 'POST', path: '/auth/login', entity: {email: "bielas.robert95@gmail.com", password: 'user'},headers: {'Content-Type': 'application/json'}}).done(response => {
		    console.log("login:" + response)
			this.setState({token: response.entity.token});
			this.postWishListIfNotExist(response.entity.token)
		});
    }

    postWishListIfNotExist(token){
		client({method: 'GET', path: '/api/list', headers: {'Authorization': "bearer " + token}}).done(response => {
		    console.log(response)
		    if(response.entity.length == 0) this.postDefaultWishList(token);
		    else this.getPresentsFromList(response.entity[0].key)
		})

    }

    postDefaultWishList(token){
		client({
		    method: 'POST',
		    path: '/api/list',
		    entity: {
		        listName: "19 urodzinki",
		        suggestions: true,
		        inform: false,
		        color: 'red'
		     },
		    headers: {
		    'Content-Type': 'application/json',
		    'Authorization':  "bearer " + token
		    }
		 })
		.done(response => {
		    console.log("posting default wishlist")
            this.postDefaultPresents(response.entity.key)
		})
    }

    postDefaultPresents(listKey){
        console.log("posting default presents as birthday guy to list with the key: " + listKey)
        var premise = null;
        for(var i = 0; i < 17; i++){
            var currentPremise = this.postDefaultPresent(
                listKey,
                {
                    name: "Kask" + (i + 1),
                    description: "Jako ze poprzedni kask juz mi sie nie podoba, chcialbym dostac nowy, najlepiej w kolorze czarnym, podobnym do tego sprzedawanego w Ikei",
                    category: "Inne",
                    shopLink: "https://allegro.pl/",
                    imageUrl: "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"
                }
            )
            premise = premise == null ? currentPremise : premise.then(currentPremise);
        }
        premise.done(response => this.getPresentsFromList(listKey))
    }

    postDefaultPresent(listKey, present){
		return client({
		    method: 'POST',
		    path: '/api/list/key/' + listKey + '/present/add',
		    entity: present,
		    headers: {
		        'Content-Type': 'application/json'
		    }
		 })
    }

    getPresentsFromList(listKey){
        console.log("getting presents from existing list: " + listKey)

		client({method: 'GET', path: '/api/list/key/' + listKey + '/present/paged?page=0&size=5',headers: {'Content-Type': 'application/json'}}).done(response => {
		    console.log("got list of presents from existing wishlist: ")
		    console.log(response)
		    this.setState({listKey: listKey})
		    this.setState({presents: response.entity})
		    this.setState({page: response.entity.length < 5 ? 0 : 1})
		});
    }

	componentDidMount() {
	    this.registerMockedUser();
	}

    loadNewPage(){
        console.log("Loading new page")

        const listKey=this.state.listKey
        const page = this.state.page
		client({method: 'GET', path: '/api/list/key/' + listKey + '/present/paged?page=' + page + '&size=5',headers: {'Content-Type': 'application/json'}}).done(
		    response => {this.onPageLoaded(response)}
		);
    }

    onPageLoaded(response){
        const page = this.state.page
        var presents = this.state.presents
        const uniquePresents = this.mergeToFirstById(presents, response.entity)
        this.setState({presents: uniquePresents})
        this.setState({page: response.entity.length < 5 ? page : page + 1})
        this.synchPresentsStates(() => {this.forceUpdate()})
    }

    mergeToFirstById(arrayOne, arrayTwo){
        var res = arrayOne.slice()
        for(var i = 0; i < arrayTwo.length; i++){
            var notPresentAlready = true
            for(var j = 0; j < arrayOne.length; j++){
                if(arrayTwo[i].presentId == arrayOne[j].presentId){
                    notPresentAlready = false;
                    break;
                }
            }
            if(notPresentAlready){
                res.push(arrayTwo[i])
            }
        }
        return res
    }


    showConfirmReservation() {
	    this.setState({showConfirmReservationModal: true})
    }
    confirmReservation() {
        this.setState({showConfirmReservationModal: true})
    }

     handleOpenMailModal (present) {
        this.setState({presentToReserve: present})
        this.setState({ showMailModal: true });
        this.afterMailModalOpen();
     }

     handleReservation(present, email){
        document.getElementById("emailInput").disabled = true
        document.getElementById("emailCancel").disabled = true
        document.getElementById("emailSubmit").disabled = true
        document.getElementById("emailWaitInfo").hidden = false

		client({
		    method: 'POST',
		    path: '/api/reservation',
		    entity: {
		        buyerName: "anonim",
		        buyerEmail: email,
		        presentId: present.presentId
		    },
		    headers: {'Content-Type': 'application/json'}
        })
        .done(response => {

            if(response.entity != "")
                this.setState({email: email})
            this.synchPresentsStates( () => {this.turnOffMailModal ()} )
            this.setState({showReservationConfirmedDialog: true})
		})

     }

     synchPresentsStates(atEnd){
        const listKey=this.state.listKey
        const entity= {ids: this.state.presents.map(present_ => present_.presentId)}
        client({method: 'POST', path: '/api/list/key/' + listKey + '/present/havingId', entity: entity, headers: {'Content-Type': 'application/json'}}).done(
            response => {
                for(var i = 0; i < this.state.presents.length; i++){
                    this.state.presents[i] = response.entity[i];
                }
                this.setState({})
                this.onAfterSynch(atEnd)
            }
        );
     }

    onAfterSynch(atEnd){
        atEnd()
    }

	afterMailModalOpen(){
        if(this.state.email != ""){
            this.handleReservation(this.state.presentToReserve, this.state.email)
        }
	}

    turnOffMailModal(){
        document.getElementById("emailInput").disabled = false
        document.getElementById("emailCancel").disabled = false
        document.getElementById("emailSubmit").disabled = false
        document.getElementById("emailWaitInfo").hidden = true
        this.setState({ showMailModal: false });
    }

     handleCloseMailModal () {
        this.setState({ showMailModal: false });
     }

     handleOpenPresentDialog (present, title, submitFun) {
        if(present == null){
            present = {
                "name": "Nowy prezent",
                "description": "Opis",
                "category": "Inne",
                "shopLink": "https://allegro.pl/",
                "imageUrl": "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"
             }
        }
        this.setState( {presentToDisplay: present, presentDialogTitle: title, presentDialogSubmitFun: submitFun});
        this.setState({ showPresentDialog: true });

     }

     handleClosePresentDialog () {
        this.setState({ showPresentDialog: false });
     }

    handleSubmitEditPresentDialog(present){
        this.refs.PresentDialogContent.setState({disabledMode:true})
		client({method: 'POST', path: 'api/list/key/' + this.state.listKey + '/present',
		        entity: present,
		        headers: {'Content-Type': 'application/json'}})
		   .done(this.onAfterPresentUpdateSubmitted);
    }

    onAfterPresentUpdateSubmitted(response){
        console.log("updated present:" )
        console.log(response)
//        this.synchPresentsStates(() => {this.forceUpdate()})
        this.refs.PresentDialogContent.setState({disabledMode:false})
        this.setState({ showPresentDialog: false });
        window.location.reload()
    }

    handleSubmitSuggestPresentDialog(present){
        this.refs.PresentDialogContent.setState({disabledMode:true})
		client({method: 'POST', path: 'api/list/key/' + this.state.listKey + '/present/suggestions',
		        entity: present,
		        headers: {'Content-Type': 'application/json'}})
		   .done(this.onAfterPresentSuggestionSubmitted);

    }

    onAfterPresentSuggestionSubmitted(response){
        this.refs.PresentDialogContent.setState({disabledMode:false})
        this.setState({ showPresentDialog: false });
        this.setState({ showSuggestionConfirmedDialog: true})
    }

    changeMode(mode){
        this.setState({mode: mode})
    }

    setPagination(paginationFlag){
        this.setState({paginationOn: paginationFlag})
    }

    search(query){
		client({method: 'GET', path: '/api/list/key/' + this.state.listKey + '/present/search?query=' + query,headers: {'Content-Type': 'application/json'}}).done(response => {
		    console.log("got list of presents from existing wishlist: ")
		    console.log(response)
		    this.setState({presents: response.entity})
		});
    }
    handleCloseReservationConfirmedDialog() {
        this.setState({showReservationConfirmedDialog: false});
    }
    handleCloseSuggestionConfirmDialog() {
        this.setState({showSuggestionConfirmedDialog: false});
    }

	render() {
        var styles = {
            background: "url(../img/background_transparent.png) no-repeat center center fixed",
            WebkitBackgroundSize: "cover",
            MozBackgroundSize: "cover",
            OBackgroundSize: "cover",
        };
		return (
		    <div style={styles}>
		        <Navbar/>
                <Row className="justify-content-center" style={{paddingTop:"5vh"}}>
                    <Col sm={{ size: 8}}>
                        <Center presents={this.state.presents} loadNewPage={this.loadNewPage}
                            handleOpenMailModal={this.handleOpenMailModal}
                            handleOpenPresentDialog={this.handleOpenPresentDialog}
                            handleSubmitEditPresentDialog={this.handleSubmitEditPresentDialog}
                            handleSubmitSuggestPresentDialog={this.handleSubmitSuggestPresentDialog}
                            setPagination={this.setPagination} paginationOn={this.state.paginationOn}
                            search={this.search}
                            mode={this.state.mode} changeMode={this.changeMode} listKey={this.state.listKey} getPresentsFromList={this.getPresentsFromList}/>
                    </Col>
                </Row>
		        <Footer/>
                <ModalB isOpen={this.state.showMailModal} contentLabel="Type your mail">
                    <ModalBody>
                        <MailModal ref="MailModalContent" handleReservation={this.handleReservation} handleCloseMailModal={this.handleCloseMailModal} presentToReserve={this.state.presentToReserve}/>
                    </ModalBody>
                </ModalB>
                <ModalB size="lg" ref="PresentDialog" isOpen={this.state.showPresentDialog}  contentLabel="Present Dialog" >
                    <ModalBody className="text-center">
                    <PresentDialog ref="PresentDialogContent"
                        handleClosePresentDialog={this.handleClosePresentDialog}
                        handleSubmitPresentDialog={this.state.presentDialogSubmitFun}
                        present={this.state.presentToDisplay}
                        title={this.state.presentDialogTitle}
                        listKey = {this.state.listKey} />
                    </ModalBody>
                </ModalB>
                <ModalB style={{position: "relative", top: "20vh"}} isOpen={this.state.showReservationConfirmedDialog}>
                    <ModalBody className="text-center">
                        <h4 >Wspaniale !</h4>
                        <p>
                            Wybrany prezent został zarezerwowany.
                        </p>
                    </ModalBody>
                    <ModalFooter style={{justifyContent: "center"}}>
                        <Button className="text-center" color="primary" onClick={() => {this.handleCloseReservationConfirmedDialog()}}>Okej</Button>{' '}
                    </ModalFooter>
                </ModalB>
                <ModalB isOpen={this.state.showSuggestionConfirmedDialog}>
                    <ModalBody className="text-center">
                        <h4>Dobra robota!</h4>
                        <p>
                            Propozycja prezentu została dodana.
                        </p>
                    </ModalBody>
                    <ModalFooter style={{justifyContent: "center"}}>
                        <Button className="text-center" color="primary" onClick={() => {this.handleCloseSuggestionConfirmDialog()}}>Okej</Button>{' '}
                    </ModalFooter>
                </ModalB>
		    </div>
		)
	}

}

class MailModal extends React.Component{

    constructor(props) {
        super(props)
        this.showConfirmDialog = this.showConfirmDialog.bind(this)
        this.handleCloseConfirmDialog = this.handleCloseConfirmDialog.bind(this)
        this.state = {};
    }

    showConfirmDialog() {
        this.setState({showConfirmDialog: true});
    }

    handleCloseConfirmDialog() {
        this.setState({showConfirmDialog: false});
    }

    render(){
        var sectionStyle = {
            width: 300,
            height: 200,
            background: "#666666"
        }

        var infoText = typeof this.props.presentToReserve != "undefined"
            ? "Podaj swój mail by zarezerwować"
            : "Podaj swój mail"
        var presentName = this.props.presentToReserve.name
        presentName = presentName.length > 35 ? presentName.substring(0,35) + "(...)" : presentName
        var thumbnailStyles = {
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "5px",
            width: "150px",
            display:"inline-block",
        };
        return (
            <div>
                <Form>
                    <h2 style={{padding: "0.4em"}} className="text-center">Rezerwacja</h2>
                    <FormGroup row>
                        <Label for="email" sm={2}>Email</Label>
                        <Col sm={9}>
                            <Input type="email" name="email" id="emailInput" placeholder="jan.kowalski@domena.pl"/>
                        </Col>
                    </FormGroup>
                    <div className="text-center">
                        <div style={thumbnailStyles}>
                            <div className="text-center">
                                {this.props.presentToReserve.name}
                            </div>
                            <img style={{width:"80%", height: "80%"}} src={this.props.presentToReserve.imageUrl} alt="Zdjęcie prezentu do zarezerwowania" />
                        </div>
                    </div>
                    <Row id="emailWaitInfo" hidden><Col sm="1"><div style={{position: "relative", top: "5px", left: "10px", borderTop: "0.5em solid rgba(255, 140, 47, 0.2)",borderRight: "0.5em solid rgba(255, 140, 47, 0.2)",
                        borderBottom: "0.5em solid rgba(255, 140, 47, 0.2)", borderLeft: "0.5em solid rgba(255, 140, 47, 1)"}} className="loader" /></Col><Col><div style={{padding: "1em"}}>Rezerwacja w trakcie...</div></Col></Row>
                    <div className="text-center" style={{padding: "1em"}}>
                        <Button id="emailSubmit" style={{marginRight:"0.5em"}} color="primary" ref="submit" onClick={this.showConfirmDialog}>Zatwierdź</Button>
                        <Button id="emailCancel" style={{marginLeft:"0.5em"}} color="secondary"ref="cancel" onClick={this.props.handleCloseMailModal}>Anuluj</Button>
                    </div>
                </Form>
                <ModalB style={{position: "relative", top: "20vh"}}  isOpen={this.state.showConfirmDialog}>
                    <ModalBody className="text-center">
                        <h4 >Jesteś pewien ?</h4>
                    </ModalBody>
                    <ModalFooter style={{justifyContent: "center"}}>
                        <Button className="text-center" color="primary" onClick={() => {this.handleCloseConfirmDialog(); this.props.handleReservation(this.props.presentToReserve, document.getElementById("emailInput").value)}}>Tak</Button>{' '}
                        <Button className="text-center" color="secondary" onClick={() => {this.handleCloseConfirmDialog()}}>Nie</Button>{' '}
                    </ModalFooter>
                </ModalB>
            </div>

        )
    }
}

class Center extends React.Component{

    render(){
        var sectionStyle = {
        };
        return(
             <div style={sectionStyle}>
                <ListSquare presents={this.props.presents} loadNewPage={this.props.loadNewPage}
                    handleOpenMailModal={this.props.handleOpenMailModal}
                    handleOpenPresentDialog={this.props.handleOpenPresentDialog}
		            handleSubmitEditPresentDialog={this.props.handleSubmitEditPresentDialog}
		            handleSubmitSuggestPresentDialog={this.props.handleSubmitSuggestPresentDialog}
		            setPagination={this.props.setPagination} paginationOn={this.props.paginationOn}
		            search = {this.props.search}
                    mode={this.props.mode} changeMode={this.props.changeMode} listKey={this.props.listKey} getPresentsFromList={this.props.getPresentsFromList}/>

             </div>
        );
    }

}

class ListSquare extends React.Component{
    render(){
        var sectionStyle = {
            backgroundColor: "rgba(247, 247, 247, 0.9)",
         }
        return (
            <div style={sectionStyle}>
                <ListSquareHeader mode={this.props.mode} listKey={this.props.listKey} setPagination={this.props.setPagination} paginationOn={this.props.paginationOn} search={this.props.search} getPresentsFromList={this.props.getPresentsFromList} changeMode={this.props.changeMode}/>
                <ListSquareMainBody presents={this.props.presents} paginationOn={this.props.paginationOn}  mode={this.props.mode} loadNewPage={this.props.loadNewPage}
                    handleOpenMailModal={this.props.handleOpenMailModal}
		            handleSubmitEditPresentDialog={this.props.handleSubmitEditPresentDialog}
		            handleSubmitSuggestPresentDialog={this.props.handleSubmitSuggestPresentDialog}
                    handleOpenPresentDialog={this.props.handleOpenPresentDialog}/>
            </div>
        )
    }
}

class ListSquareHeader extends React.Component{
    render(){
        var sectionStyle = {

        }
        return(
            <div style={sectionStyle}>
                <div  style={{padding: "2em 2em 4em 2em"}} id="header" className="text-center">
                    <h1>19 urodzinki</h1>
                    <h4>20 maja 2018 (za 5 dni)</h4>
                </div>
                <SearchBarComponent listKey={this.props.listKey} setPagination={this.props.setPagination} search={this.props.search}  getPresentsFromList={this.props.getPresentsFromList}/>
                <ListSquareNavigationButtons mode={this.props.mode} changeMode={this.props.changeMode}/>
            </div>
        )
    }
}

class SearchBarComponent extends React.Component{

    constructor(props){
        super(props)
        this.search = this.search.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    search(query){
        // var query = this.refs.searchbar.state.value
        if(query != "") {
            this.props.setPagination(false)
            this.props.search(query)
        }
    }

    onChange(val){
        if (val == ""){
            this.props.setPagination(true)
            this.props.getPresentsFromList(this.props.listKey)
        }
    }

    render(){
        return(
            <div style={{paddingBottom: "1em", width: "100%",  display: "flex", justifyContent:"center"}}>
                <div style={{height:"60px", width: "80%", display: "flex", flexDirection: "row", alignItems: "center",}}>
                    <SearchBar
                      hintText="Znajdź Prezent"
                      ref="searchbar"
                      onChange={this.onChange}
                      onRequestSearch={this.search}
                      style={{ margin: '0 auto', backgroundColor: 'rgb(247, 247, 247)', width: "98%" }} />
                </div>
            </div>
        )
    }

}

class ListSquareNavigationButtons extends React.Component{

    constructor(props){
        super(props)
        this.all = this.all.bind(this)
        this.reserved = this.reserved.bind(this)
        this.notReserved = this.notReserved.bind(this)
    }

    all(){
        console.log("Clicked select all presents button, changing from: " + this.props.mode)
        this.props.changeMode(ALL)

    }

    reserved(){
        console.log("Clicked select reserved presents button" + this.props.mode)
        this.props.changeMode(RESERVED)
    }

    notReserved(){
        console.log("Clicked select not reserved presents button" + this.props.mode)
        this.props.changeMode(NOT_RESERVED )
    }

    render(){
        var sectionStyle={
            width:"100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: 'flex-start',
            marginLeft:"10%"
        }
        var tabStyles = {
            cursor: "pointer",
            borderBottomColor: "rgba(255, 140, 47, 1)",
        }

        var reserved_color = this.props.mode == RESERVED ? "#FF8C2F" : "#666666"
        var not_reserved_color = this.props.mode == NOT_RESERVED ? "#FF8C2F" : "#666666"
        var all_color = this.props.mode == ALL ? "#FF8C2F" : "#666666"

        return (
            <div>
            <Nav tabs>
                <NavItem style={tabStyles}>
                    <NavLink
                        className={classnames(
                            { active: this.props.mode === ALL },
                            { activeTabBorder: this.props.mode === ALL},
                            { tabBorder: this.props.mode !== ALL},
                        )
                        }
                        onClick={this.all}
                    >
                        Wszystkie(15)
                    </NavLink>
                </NavItem>
                <NavItem style={{pointerEvents: "none",cursor: "not-allowed",}} className="disabled">
                    <NavLink
                        className={classnames(
                            { active: this.props.mode === RESERVED },
                            { activeTabBorder: this.props.mode === RESERVED},
                            { tabBorder: this.props.mode !== RESERVED},
                            "disabled")
                        }
                        onClick={this.reserved}
                    >
                        Zarezerwowane(0)
                    </NavLink>
                </NavItem>
                <NavItem style={tabStyles}>
                    <NavLink
                        className={classnames(
                            {active: this.props.mode === NOT_RESERVED },
                            {activeTabBorder: this.props.mode === NOT_RESERVED},
                            {tabBorder: this.props.mode !== NOT_RESERVED},
                            )
                        }
                        onClick={this.notReserved}
                    >
                        Niezarezerwowane(15)
                    </NavLink>
                </NavItem>
            </Nav>
            </div>
        )
    }
}

class ListSquareMainBody extends React.Component{

    constructor(props){
        super(props)
        this.handleScrollStop = this.handleScrollStop.bind(this)
    }

    shouldShowPresent(present){
        var mode = this.props.mode
        if(mode == ALL) return true;
        if(mode == RESERVED) return present.boughtOrReserved
        return !present.boughtOrReserved
    }

    handleScrollStop(){
        var scrollHeight = this.refs.scroll.getScrollHeight()
        var clientEndPos = this.refs.scroll.viewScrollTop + this.refs.scroll.getClientHeight()
        if( (clientEndPos - 1 <= scrollHeight && clientEndPos + 1 >= scrollHeight) && this.props.paginationOn){
            this.props.loadNewPage()
        }
    }

    render(){

        var layout = []
        var presentComponents = this.props.presents;
        var filteredPresents = typeof presentComponents != "undefined" ? presentComponents.filter(present => this.shouldShowPresent(present)) : []
        var styles = {
            backgroundColor: "rgba(247, 247, 247, 0.9)",
            padding: "0 4em",
        };

        presentComponents = filteredPresents.map(
            (present, i) => {
                layout.push({i: present.presentId.toString(), x: (i+1)%3, y: Math.floor((i+1)/3), w:1, h:1, static:true})
                return(
                    <Col style={{marginBottom: "2em"}} sm="4" id={"present" + present.presentId} key={present.presentId}>
                        <PresentComponent present={present}
                            handleOpenMailModal={this.props.handleOpenMailModal}
                            handleSubmitEditPresentDialog={this.props.handleSubmitEditPresentDialog}
                            handleOpenPresentDialog={this.props.handleOpenPresentDialog}/>
                    </Col>)
            }
        );

        return(
                <div style={styles} className="container-fluid">
                    <Row>
                        <Col style={{marginBottom: "2em"}} sm="4">
                            <SuggestComponent
                                handleOpenPresentDialog={this.props.handleOpenPresentDialog}
                                handleSubmitSuggestPresentDialog={this.props.handleSubmitSuggestPresentDialog}/>
                        </Col>
                        {presentComponents}
                    </Row>
                    <ShowMorePagesButton presents={filteredPresents} loadNewPage={this.props.loadNewPage} />
                </div>
        )
    }
}

class ShowMorePagesButton extends React.Component{

    constructor(props){
        super(props)
        this.moreItems = this.moreItems.bind(this)

    }

    moreItems(){
        this.props.loadNewPage()
    }

    render(){
        var justifyContent = this.props.presents.length == 0 ? "flex-start" : "center"
        var marginLeft = this.props.presents.length == 0 ? "190px" : "0px"
        return(
            <div style={{padding: "2em", display: "flex",  flexDirection:"row", justifyContent: justifyContent}}>
                <Button color="secondary" onClick={this.moreItems}>Pokaż więcej</Button>
            </div>
        )
    }
}

class SuggestComponent extends React.Component{

    constructor(props){
        super(props);
        this.suggest = this.suggest.bind(this);
    }

    suggest(){
        console.log("suggest present")
        this.props.handleOpenPresentDialog(null, "Zaproponuj prezent", this.props.handleSubmitSuggestPresentDialog)
    }

    render(){
        var sectionStyle = {
            height: "100%",
            border: ".1px solid #0066cc",
        }
        return(
            <Button className="btn-block" color="primary" style={sectionStyle} onClick={this.suggest}><h1 style={{fontSize: "2.5rem"}}>Zaproponuj</h1></Button>
        )
    }
}

class PresentComponent extends React.Component{

    viewDetails(){
        console.log("view details")
    }

    render(){
        var reserveButtonHidden = this.props.present.boughtOrReserved
        var presentDescription = this.props.present.description
        var presentName = this.props.present.name
        var shopLink = this.props.present.shopLink
        var presentDescription = presentDescription.length > 135 ? presentDescription.substring(0, 135) + ("\n(...)") : presentDescription
        presentName = presentName.length > 10 ? presentName.substring(0,10).replace(/\s/g, '_') + "(...)" : presentName
        shopLink = shopLink.length > 35 ? "" : shopLink
        let id = this.props.present.presentId;
        let cardStyle = {
            height: "100%",
            backgroundColor: "rgba(247, 247, 247, 1)"

        };
        let buttonStyles = {
            borderRadius: "8px"
        };
        let headingStyles = {
            borderRadius: "2px",
            padding: "0.7em 1em",
            marginBottom: "1em",
        };
        let imgStyles = {
            width: "100%",
            margin: "0 0 2em 0.4em",
            border: "1px solid #ddd",
            borderRadius: "4px",
        }
        let iconStyles = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingRight: "0",
        };
        return(
            <Card style={cardStyle}>
                <CardBody style={headingStyles} className="blue">
                    <CardTitle>
                        {presentName}<Button id = {"reserve-" + id} onClick={() => this.props.handleOpenMailModal(this.props.present)} hidden={reserveButtonHidden} style={buttonStyles} className="float-right btn-sm">Zarezerwuj</Button>
                        <UncontrolledTooltip style={{border: "1px solid black", backgroundColor: "white", color:"black"}} placement="top"  target={"reserve-" + id}>
                            Naciśnij, aby zarezerwować prezent.
                        </UncontrolledTooltip>
                    </CardTitle>
                </CardBody>
                <h6 className="text-center">Kategoria: {this.props.present.category}</h6>
                <Row style={{height: "100%"}}>
                    <Col style={iconStyles} sm="4"><img style={imgStyles} src={this.props.present.imageUrl} alt="Present icon" /></Col>
                    <Col sm="8">
                        <CardBody style={{padding: "0px 2em 2em 0px"}}>
                            <CardText>{presentDescription}</CardText>
                            <CardText><a style={{margin: "1em"}} target="_blank"  href={this.props.present.shopLink}>Link do Sklepu</a></CardText>
                        </CardBody>
                    </Col>
                </Row>
                {/*<div className="text-center">*/}
                    {/*<Button className="btn btn-secondary" style={{margin: "1em"}} target="_blank"   onClick={() => this.props.handleOpenPresentDialog(this.props.present, "Szczegóły prezentu", this.props.handleSubmitEditPresentDialog)}>Edytuj</Button>*/}
                {/*</div>*/}
            </Card>
        )
    }
}



try{
    Modal.setAppElement('#react_guest');
}catch(e){}

