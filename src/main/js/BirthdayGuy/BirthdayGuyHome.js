'use strict';
const React = require('react');
import BirthdayNavbar from "./Navbar";
import PreviousEvents from "./PreviousEvents"
import MainPanel from "./MainPanel";
import { Button, Modal as ModalB, ModalBody, ModalFooter } from 'reactstrap';
import PresentDialog from '../PresentDialog';
import Footer from "../Footer"

const client = require('../client_react');

export default class BirthdayGuyHome extends React.Component{

    constructor(props) {
        super(props);
        this.handleClosePresentDialog = this.handleClosePresentDialog.bind(this);
        this.handleSubmitEditPresentDialog = this.handleSubmitEditPresentDialog.bind(this);
        this.state =
            {
                suggestions: [],
                presents: []
            }

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
    componentDidMount() {
        this.registerMockedUser();
    }
    postWishListIfNotExist(token){
        client({method: 'GET', path: '/api/list', headers: {'Authorization': "bearer " + token}}).done(response => {
            console.log(response)
            if(response.entity.length == 0) this.postDefaultWishList(token);
            else{
                this.getSuggestionsFromList(response.entity[0].key)
                this.getPresentsFromList(response.entity[0].key)
            }
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
                this.postDefaultSuggestions(response.entity.key)
            })
    }
    getSuggestionsFromList(listKey) {
        client({method: 'GET', path: '/api/list/key/' + listKey + '/present/suggestions',headers: {'Content-Type': 'application/json'}}).done(response => {
                this.setState({listKey: listKey})
                response.entity.forEach((s) => {s.accepted=false; s.accepting=false})
                this.setState({suggestions: response.entity})
                console.log(this.state.suggestions)
        });
    }
    getPresentsFromList(listKey){
        console.log("getting presents from existing list: " + listKey)

        client({method: 'GET', path: '/api/list/key/' + listKey + '/present/paged?page=0&size=50',headers: {'Content-Type': 'application/json'}}).done(response => {
            console.log("got list of presents from existing wishlist: ")
            console.log(response)
            this.setState({listKey: listKey})
            this.setState({presents: response.entity})
            this.setState({page: response.entity.length < 5 ? 0 : 1})
        });
    }
    postDefaultSuggestions(listKey){
        console.log("posting default segustions to list with the key: " + listKey)
        var premise = null;
        for(var i = 0; i < 4; i++){
            var currentPremise = this.postDefaultSuggestion(
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
        premise.done(response => this.getSuggestionsFromList(listKey))
    }
    postDefaultSuggestion(listKey, suggestion){
        return client({
            method: 'POST',
            path: '/api/list/key/' + listKey + '/present/suggestions',
            entity: suggestion,
            headers: {
                'Content-Type': 'application/json'
            }
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
    handleOpenPresentDialog () {
            let present = {
                "name": "",
                "description": "Opis",
                "category": "Inne",
                "shopLink": "https://www.decathlon.pl/kask-miejski-na-rower-300-dla-dzieci-zielony-id_8173787.html",
                "imageUrl": "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"
            }
        this.setState( {presentToDisplay: present, presentDialogTitle: "Dodaj nowy prezent",showPresentDialog: true});
        }
    handleClosePresentDialog () {
        this.setState({ showPresentDialog: false });
    }
    handleCloseConfirmDialog() {
        this.setState({showConfirmDialog: false});
    }
    handleSubmitEditPresentDialog(present){
        client({method: 'POST', path: 'api/list/key/' + this.state.listKey + '/present',
            entity: present,
            headers: {'Content-Type': 'application/json'}})
            .done( response => {
                var presents = this.state.presents.slice();
                presents.unshift(present);
                this.setState({ showConfirmDialog: true, showPresentDialog: false, presents: presents })
            });
    }
    handleAcceptClick(sId) {
        let suggestions = this.state.suggestions.slice();
        suggestions.find((s) => s.id === sId).accepting = true;
        this.setState({suggestions: suggestions});
        setTimeout(() => {
            client({
                method: 'GET',
                path: '/api/list/key/' + this.state.listKey + '/present/suggestions/' + sId + "/?apply=true",
                headers: {'Content-Type': 'application/json'}
            }).done(response => {
                suggestions.find((s) => s.id === sId).accepted = true;
                suggestions.find((s) => s.id === sId).accepting = false;
                this.setState({suggestions: suggestions});
            });
        },1000);


        this.setState(
            {
                suggestions: suggestions
            }
        );
        console.log(this.state.suggestions)

    }
	render() {
        var styles = {
        background: "url(../img/background_transparent.png) no-repeat center center fixed",
        WebkitBackgroundSize: "cover",
        MozBackgroundSize: "cover",
        OBackgroundSize: "cover",
        };
        var col2 = {
			paddingRight: "2em",
		}
        var col10 = {
        }
        var previousEventsCss = {
        	background: "rgba(247, 247, 247, 0.9)",
			padding: "0.5em",
            border: "1px solid black",
		}
		return (
             <div style={styles}>
                 <BirthdayNavbar />
				 <div className="wrapper" style={{paddingTop:"5vh"}}>
				 <div className="container-fluid">
					 <div className="row">
						 <div className="col-2" style={col2}>
							 <div className="previousEvents" style={previousEventsCss}>
								 <PreviousEvents/>
							 </div>
						 </div>
						 <div className="col-10" style={col10}>
							 <MainPanel onAddPresentClick={()=> {this.handleOpenPresentDialog()}} onClick={(sId) => this.handleAcceptClick(sId)} suggestions={this.state.suggestions} presents={this.state.presents}/>

						 </div>
					 </div>
				 </div>
				 </div>
                 <ModalB size="lg" isOpen={this.state.showPresentDialog}  contentLabel="Present Dialog" >
                     <ModalBody className="text-center">
                     <PresentDialog ref="PresentDialogContent"
                                    handleClosePresentDialog={this.handleClosePresentDialog}
                                    handleSubmitPresentDialog={this.handleSubmitEditPresentDialog}
                                    present={this.state.presentToDisplay}
                                    title={"Dodaj nowy prezent"}
                                    listKey = {this.state.listKey} />
                     </ModalBody>
                 </ModalB>
                 <ModalB style={{position: "relative", top: "20vh"}} isOpen={this.state.showConfirmDialog}>
                     <ModalBody className="text-center">
                         <h4 >Dobra robota!</h4>
                         <p>
                             Prezent został dodany.
                         </p>
                     </ModalBody>
                     <ModalFooter style={{justifyContent: "center"}}>
                         <Button className="text-center" color="primary" onClick={() => {this.handleCloseConfirmDialog()}}>Okej</Button>{' '}
                     </ModalFooter>
                 </ModalB>
             <Footer/>
             </div>
		 );
    }
}
