'use strict';

import SearchBar from 'material-ui-search-bar'
import GridLayout from 'react-grid-layout'
import Modal from 'react-modal';
import PresentDialog from './PresentDialog'

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client_react');
const follow = require('./follow');

import { Scrollbars } from 'react-custom-scrollbars';

const ALL = "all"
const RESERVED = "reserved"
const NOT_RESERVED = "not_reserved"

export default class GuestHome extends React.Component {

	constructor(props) {
		super(props);
		this.state = {token: " Sending greeting email and loging in, this will take a sec ", ignored: "yolo3", showMailModal: false, showPresentDialog:false, mode:ALL, email: ""};
		this.loadNewPage = this.loadNewPage.bind(this)

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
        this.postDefaultPresent(listKey, { name: "Kask1", description: "Jako ze poprzedni kask juz mi sie nie podoba, chcialbym dostac nowy, najlepiej w kolorze czarnym, podobnym do tego sprzedawanego w Ikei", category: "Inne", shopLink: "https://allegro.pl/", imageUrl: "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"})
        .then(this.postDefaultPresent(listKey, { name: "Kask2", description: "Jako ze poprzedni kask juz mi sie nie podoba, chcialbym dostac nowy, najlepiej w kolorze czarnym, podobnym do tego sprzedawanego w Ikei", category: "Inne", shopLink: "https://allegro.pl/", imageUrl: "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"}))
        .then(this.postDefaultPresent(listKey, { name: "Kask3", description: "Jako ze poprzedni kask juz mi sie nie podoba, chcialbym dostac nowy, najlepiej w kolorze czarnym, podobnym do tego sprzedawanego w Ikei", category: "Inne", shopLink: "https://allegro.pl/", imageUrl: "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"}))
        .then(this.postDefaultPresent(listKey, { name: "Kask4", description: "Jako ze poprzedni kask juz mi sie nie podoba, chcialbym dostac nowy, najlepiej w kolorze czarnym, podobnym do tego sprzedawanego w Ikei", category: "Inne", shopLink: "https://allegro.pl/", imageUrl: "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"}))
        .then(this.postDefaultPresent(listKey, { name: "Kask5", description: "Jako ze poprzedni kask juz mi sie nie podoba, chcialbym dostac nowy, najlepiej w kolorze czarnym, podobnym do tego sprzedawanego w Ikei", category: "Inne", shopLink: "https://allegro.pl/", imageUrl: "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"}))
        .then(this.postDefaultPresent(listKey, { name: "Kask6", description: "Jako ze poprzedni kask juz mi sie nie podoba, chcialbym dostac nowy, najlepiej w kolorze czarnym, podobnym do tego sprzedawanego w Ikei", category: "Inne", shopLink: "https://allegro.pl/", imageUrl: "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"}))
        .then(this.postDefaultPresent(listKey, { name: "Kask7", description: "Jako ze poprzedni kask juz mi sie nie podoba, chcialbym dostac nowy, najlepiej w kolorze czarnym, podobnym do tego sprzedawanego w Ikei", category: "Inne", shopLink: "https://allegro.pl/", imageUrl: "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"}))
        .done(response => this.getPresentsFromList(listKey))

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


     handleOpenMailModal (present) {
        this.setState({presentToReserve: present})
        this.setState({ showMailModal: true });
     }

     handleReservation(present, email){
        document.getElementById("emailCancel").hidden = true
        document.getElementById("emailSubmit").hidden = true
        document.getElementById("emailInput").hidden = true
        document.getElementById("emailInfo").innerHTML = ""
        document.getElementById("emailWaitInfo").innerHTML = "Czekaj, rezerwacja w trakcie ..."

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
        document.getElementById("emailCancel").hidden = false
        document.getElementById("emailSubmit").hidden = false
        document.getElementById("emailInput").hidden = false
        document.getElementById("emailWaitInfo").innerHTML = ""
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
    }

    changeMode(mode){
        this.setState({mode: mode})
    }


	render() {
		var sectionStyle = {
          width: "85%",
          height: "100%",
          marginLeft: "auto",
          marginRight: "auto",

        }

		return (
		    <div style={sectionStyle}>
		        <Header/>
		        <Center presents={this.state.presents} loadNewPage={this.loadNewPage}
		            handleOpenMailModal={this.handleOpenMailModal}
		            handleOpenPresentDialog={this.handleOpenPresentDialog}
		            handleSubmitEditPresentDialog={this.handleSubmitEditPresentDialog}
		            handleSubmitSuggestPresentDialog={this.handleSubmitSuggestPresentDialog}
		            mode={this.state.mode} changeMode={this.changeMode} listKey={this.state.listKey}/>

		        <Footer/>

                <Modal ref="MailModal" style={{content : {top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)'}}}
                       isOpen={this.state.showMailModal} onAfterOpen={this.afterMailModalOpen} contentLabel="Type your mail">
                    <MailModal ref="MailModalContent" handleReservation={this.handleReservation} handleCloseMailModal={this.handleCloseMailModal} presentToReserve={this.state.presentToReserve}/>
                </Modal>

                <Modal ref="PresentDialog" style={{content : {top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', border: "solid 2px"}}}
                       isOpen={this.state.showPresentDialog}  contentLabel="Present Dialog" >
                    <PresentDialog ref="PresentDialogContent"
                        handleClosePresentDialog={this.handleClosePresentDialog}
                        handleSubmitPresentDialog={this.state.presentDialogSubmitFun}
                        present={this.state.presentToDisplay}
                        title={this.state.presentDialogTitle}
                        listKey = {this.state.listKey} />
                </Modal>
		    </div>
		)
	}

}

class MailModal extends React.Component{

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

        return (
            <div ref="MailModalDiv" style={sectionStyle}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", color:"#FFFFFF" }}><br/>{presentName}<br/></div>
                <div id="emailInfo" ref="MailInfo" style={{ width:300, height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", color:"#FFFFFF"}}>{infoText}</div>

                <div style={{ width:300, height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    <input id="emailInput" type="text" placeholder="imie.nazwisko@domena"/>
                </div>
                <div id="emailWaitInfo" ref="MailWaitInfo" style={{ width:300, height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", color:"#FFFFFF"}}></div>
                <div style={{ width:300, height:30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    <button id="emailSubmit" style={{ width:100, height:20}} onClick={() => this.props.handleReservation(this.props.presentToReserve, document.getElementById("emailInput").value)}>Potwierdź</button>
                    <button id="emailCancel" style={{ width:100, height:20, marginLeft:10}} onClick={this.props.handleCloseMailModal}>Anuluj</button>
                </div>
            </div>
        )
    }
}

class Header extends React.Component{
    render(){
        var sectionStyle={
             width: "1200px",
             border: ".1px solid #0066cc",
             height: "50px",

            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        }
        return (
            <div style={sectionStyle}>
                <img src="img/cake.png" style={{marginLeft: "25px"}}/>
                <div style={{marginLeft:"25px", fontWeight: "bold", fontFamily: 'Cochin', fontSize:"22px"}}>Prezenty</div>
                <div style={{marginLeft:"25px", fontFamily: 'Cochin', fontSize:"17px"}}>Rezerwacje</div>
                <div style={{fontFamily: 'Cochin', fontSize:"17px", border: ".1px solid #0066cc", marginLeft:"800px"}}>Wyloguj</div>

            </div>
        )
    }
}

class Footer extends React.Component{
    render(){
		var sectionStyle = {
             width: "1200px",
             border: ".1px solid #0066cc",
             height: "200px"
        }
        return(
            <div style={sectionStyle}>
                <br/>
                <div style={{marginLeft:"15px", height: "25px", width: "1200px", textAlign:"left", fontWeight: "bold", fontSize:"25px"}}>Prezenty</div>
                <br/>
                <div style={{marginLeft:"15px", height: "25px", width: "1200px", textAlign:"left", fontSize:"17px"}}> Aby wygodnie publikować swoje listy prezentów, już nie musisz szukać dalej</div>
                <br/>
                <div style={{height: "25px", width: "1200px", textAlign:"center", fontSize:"17px", fontWeight: "bold"}}>Znajdz nas na:</div>
                <ServicesIcons/>
            </div>
        )
    }
}

class ServicesIcons extends React.Component{

    fbClicked(){
        console.log("Fb was clicked")
    }

    render(){
        var sectionStyle={
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        }
        return (
            <div style={sectionStyle}>

                <button style={{borderRadius: "12px", display: "flex", flexDirection: "row", alignItems: "center", height: "75px"}} onClick={this.fbClicked}>
                    <img src="img/fb.png" style={{marginLeft:"15px", marginRight:"15px"}}/>
                 </button>

                <img src="img/service.png" style={{marginLeft:"15px", marginRight:"15px"}}/>
                <img src="img/google.png" style={{marginLeft:"15px", marginRight:"15px"}}/>
                <img src="img/pinterest.png" style={{marginLeft:"15px", marginRight:"15px"}}/>
                <img src="img/twitter.png" style={{marginLeft:"15px", marginRight:"15px"}}/>

            </div>
        )
    }
}

class Center extends React.Component{

    render(){
        var sectionStyle = {
            position:"relative",
            width: "1200px",
            height: "950px",
            backgroundImage: "url(img/background_transparent.png)",

            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        };
        return(
             <div style={sectionStyle}>
                <ListSquare presents={this.props.presents} loadNewPage={this.props.loadNewPage}
                    handleOpenMailModal={this.props.handleOpenMailModal}
                    handleOpenPresentDialog={this.props.handleOpenPresentDialog}
		            handleSubmitEditPresentDialog={this.props.handleSubmitEditPresentDialog}
		            handleSubmitSuggestPresentDialog={this.props.handleSubmitSuggestPresentDialog}
                    mode={this.props.mode} changeMode={this.props.changeMode} listKey={this.props.listKey}/>

             </div>
        );
    }

}

class ListSquare extends React.Component{
    render(){
        var sectionStyle = {
            width: "1000px",
            height: "800px",
            background: "white",
            opacity: 0.9
         }
        return (
            <div style={sectionStyle}>
                <ListSquareHeader mode={this.props.mode} listKey={this.props.listKey} changeMode={this.props.changeMode}/>
                <ListSquareMainBody presents={this.props.presents} mode={this.props.mode} loadNewPage={this.props.loadNewPage}
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
             width: "1000px",
             border: ".1px solid #0066cc",
             height: "200px"
        }
        return(
            <div style={sectionStyle}>
                <br/>
                <div style={{height: "25px", width: "1000px", textAlign:"center", fontWeight: "bold", fontSize:"25px"}}> 19 urodzinki</div>
                <div style={{height: "25px", width: "1000px", textAlign:"center", fontSize:"17px"}}> 20 maja 2018 (za 5 dni)</div>
                <SearchBarComponent listKey={this.props.listKey}/>
                <ListSquareNavigationButtons mode={this.props.mode} changeMode={this.props.changeMode}/>
            </div>
        )
    }
}


class SearchBarComponent extends React.Component{

    constructor(props){
        super(props)
        this.search = this.search.bind(this)
    }

    search(){

        var query = this.refs.searchbar.state.value
		client({method: 'GET', path: '/api/list/key/' + this.props.listKey + '/present/paged/search?query=' + query,headers: {'Content-Type': 'application/json'}}).done(response => {
		    console.log("got list of presents from existing wishlist: ")
		    console.log(response)
		});
    }

    render(){
        return(
            <div style={{width: "100%",  display: "flex", justifyContent:"center"}}>
                <div style={{border: ".1px solid #000000", height:"60px", width: "80%", display: "flex", flexDirection: "row", alignItems: "center",}}>
                    <SearchBar
                      ref="searchbar"
                      onChange={() => console.log('onChange')}
                      onRequestSearch={this.search}
                      style={{
                        margin: '0 auto',
                        backgroundColor: 'rgb(255,240,240)',
                        width: "98%"
                      }}
                    />
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

        var reserved_color = this.props.mode == RESERVED ? "#FF8C2F" : "#666666"
        var not_reserved_color = this.props.mode == NOT_RESERVED ? "#FF8C2F" : "#666666"
        var all_color = this.props.mode == ALL ? "#FF8C2F" : "#666666"

        return (
            <div style={sectionStyle}>
                <button style={{borderRadius: "12px", height: "75px", background: all_color}} onClick={this.all}>Wszystkie(15)</button>
                <button style={{borderRadius: "12px", height: "75px", background: not_reserved_color }} onClick={this.notReserved}>Niezarezerwowane(10)</button>
                <button style={{borderRadius: "12px", height: "75px", background: reserved_color}} onClick={this.reserved}>Zarezerwowane(5)</button>
            </div>
        )
    }
}

class ListSquareMainBody extends React.Component{

    shouldShowPresent(present){
        var mode = this.props.mode
        if(mode == ALL) return true;
        if(mode == RESERVED) return present.boughtOrReserved
        return !present.boughtOrReserved
    }

    render(){

        var layout = []
        var presentComponents = this.props.presents;
        var filteredPresents = typeof presentComponents != "undefined" ? presentComponents.filter(present => this.shouldShowPresent(present)) : []

        presentComponents = filteredPresents.map(
            (present, i) => {
                layout.push({i: present.presentId.toString(), x: (i+1)%3, y: Math.floor((i+1)/3), w:1, h:1, static:true})
                return(
                    <div id={"present" + present.presentId} key={present.presentId} data-grid={{x: (i+1)%3, y: Math.floor((i+1)/3), w:1, h:1, static:true}} style={{border: ".1px solid #0066cc"}}>
                        <PresentComponent present={present}
                            handleOpenMailModal={this.props.handleOpenMailModal}
                            handleSubmitEditPresentDialog={this.props.handleSubmitEditPresentDialog}
                            handleOpenPresentDialog={this.props.handleOpenPresentDialog}/>
                    </div>)
            }
        );
        return(
            <Scrollbars style={{ width: 1000, height: 600 }}>
                <GridLayout layout={layout} className="layout" width={800}  rowHeight={250} cols={3} style={{ marginLeft:"100px", marginRight: "100px"}}>
                    <div key="sugg" data-grid={{x: 0, y: 0, w:1, h:1, static:true}}>
                        <SuggestComponent
                            handleOpenPresentDialog={this.props.handleOpenPresentDialog}
                            handleSubmitSuggestPresentDialog={this.props.handleSubmitSuggestPresentDialog}/>
                    </div>
                    {presentComponents}
                </GridLayout>
                <ShowMorePagesButton presents={filteredPresents} loadNewPage={this.props.loadNewPage} />
            </Scrollbars>
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
            <div style={{marginLeft: marginLeft, width: 1000, height:50, display: "flex",  flexDirection:"row", justifyContent: justifyContent}}>
                <button style={{height:30}} onClick={this.moreItems}>Pokaż więcej</button>
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
            width:"100%", height: "100%",
            border: ".1px solid #0066cc",
            background: "#00DBFF",
            fontSize: "35px"
        }
        return(
            <button style={sectionStyle} onClick={this.suggest}> Zaproponuj </button>
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
        presentDescription = presentDescription.length > 135 ? presentDescription.substring(0, 135) + ("\n(...)") : presentDescription
        presentName = presentName.length > 10 ? presentName.substring(0,10).replace(/\s/g, '_') + "(...)" : presentName
        shopLink = shopLink.length > 35 ? "" : shopLink

        return(
            <div >
                <div style={{background: "#FF8C2F",  height:"30px", display: "flex", flexDirection:"row", alignItems:"center"}}>
                    <div style={{marginLeft:"10px", fontSize:"20px"}}>{presentName}</div>
                    <div style={{ width:"100%", display: "flex", flexDirection:"row", alignItems:"center", justifyContent:"flex-end"}}><button hidden={reserveButtonHidden} style={{width:"100px", marginRight:2}} onClick={() => this.props.handleOpenMailModal(this.props.present)}>Rezerwuj</button></div>
                </div>

                <div style={{ fontSize:"20px", width:"100%", height:"30px", display: "flex",  flexDirection:"row", alignItems:"center", justifyContent: "center"}}>
                    Kategoria: {this.props.present.category}
                </div>

                <div style={{width:"100%", display: "flex", flexDirection:"row", alignItems: "center"}}>
                    <img src={this.props.present.imageUrl} alt={this.props.present.imageUrl} style={{width: "100px", height:"130px", marginLeft:"5px"}} onError={(e)=>{e.target.src="img/default_present_img.png"}}/>
                    <div style={{width: "120px", textAlign:"center", fontSize:"13px", marginRight:"5px"}}> {presentDescription}</div>
                </div>
                <div style={{width:"100%", height:"30px", display: "flex",  flexDirection:"row", justifyContent: "center", marginTop:5}}>
                    <a href={this.props.present.shopLink}> {shopLink} </a>
                </div>
                <div style={{width:"100%", height:"30px", display: "flex", justifyContent:"center"}}>
                    <button style={{height:"20px", display: "flex",  flexDirection:"row", alignItems: "center"}} onClick={() => this.props.handleOpenPresentDialog(this.props.present, "Szczegóły prezentu", this.props.handleSubmitEditPresentDialog)}> Pokaż więcej </button>
                </div>
            </div>
        )
    }
}


try{
    Modal.setAppElement('#react_guest');
}catch(e){}

