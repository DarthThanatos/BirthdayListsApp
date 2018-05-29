'use strict';
import SearchBar from 'material-ui-search-bar'
import GridLayout from 'react-grid-layout'

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client_react');
const follow = require('./follow');


class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {token: " Sending greeting email and loging in, this will take a sec ", ignored: "yolo3"};
		console.log("state: " )
		console.log(this.state)
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
        this.postDefaultPresent(listKey, { name: "Kask", description: "Jako ze poprzedni kask juz mi sie nie podoba, chcialbym dostac nowy, najlepiej w kolorze czarnym, podobnym do tego sprzedawanego w Ikei", category: "Inne", shopLink: "https://allegro.pl/", imageUrl: "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"})
        .then(this.postDefaultPresent(listKey, { name: "Kask", description: "Jako ze poprzedni kask juz mi sie nie podoba, chcialbym dostac nowy, najlepiej w kolorze czarnym, podobnym do tego sprzedawanego w Ikei", category: "Inne", shopLink: "https://allegro.pl/", imageUrl: "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"}))
        .then(this.postDefaultPresent(listKey, { name: "Kask", description: "Jako ze poprzedni kask juz mi sie nie podoba, chcialbym dostac nowy, najlepiej w kolorze czarnym, podobnym do tego sprzedawanego w Ikei", category: "Inne", shopLink: "https://allegro.pl/", imageUrl: "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"}))
        .then(this.postDefaultPresent(listKey, { name: "Kask", description: "Jako ze poprzedni kask juz mi sie nie podoba, chcialbym dostac nowy, najlepiej w kolorze czarnym, podobnym do tego sprzedawanego w Ikei", category: "Inne", shopLink: "https://allegro.pl/", imageUrl: "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"}))
        .then(this.postDefaultPresent(listKey, { name: "Kask", description: "Jako ze poprzedni kask juz mi sie nie podoba, chcialbym dostac nowy, najlepiej w kolorze czarnym, podobnym do tego sprzedawanego w Ikei", category: "Inne", shopLink: "https://allegro.pl/", imageUrl: "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"}))
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

		client({method: 'GET', path: '/api/list/key/' + listKey + '/present',headers: {'Content-Type': 'application/json'}}).done(response => {
		    console.log("got list of presents from existing wishlist: ")
		    console.log(response)
		    this.setState({presents: response.entity})
		});
    }

	componentDidMount() {
	    this.registerMockedUser();
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
		        <Center presents={this.state.presents}/>
		        <Footer/>
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
                <img src="cake.png" style={{marginLeft: "25px"}}/>
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
                    <img src="fb.png" style={{marginLeft:"15px", marginRight:"15px"}}/>
                 </button>

                <img src="service.png" style={{marginLeft:"15px", marginRight:"15px"}}/>
                <img src="google.png" style={{marginLeft:"15px", marginRight:"15px"}}/>
                <img src="pinterest.png" style={{marginLeft:"15px", marginRight:"15px"}}/>
                <img src="twitter.png" style={{marginLeft:"15px", marginRight:"15px"}}/>

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
            backgroundImage: "url(background_transparent.png)",

            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        };
        return(
             <div style={sectionStyle}>
                <ListSquare presents={this.props.presents}/>
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
                <ListSquareHeader/>
                <ListSquareMainBody presents={this.props.presents}/>
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
                <SearchBarComponent/>
                <ListSquareNavigationButtons/>
            </div>
        )
    }
}


class SearchBarComponent extends React.Component{
    render(){
        return(
            <div style={{width: "100%",  display: "flex", justifyContent:"center"}}>
                <div style={{border: ".1px solid #000000", height:"60px", width: "80%", display: "flex", flexDirection: "row", alignItems: "center",}}>
                    <SearchBar
                      onChange={() => console.log('onChange')}
                      onRequestSearch={() => console.log('onRequestSearch')}
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

    all(){
        console.log("Clicked select all presents button")
    }

    reserved(){
        console.log("Clicked select reserved presents button")
    }

    notReserved(){
        console.log("Clicked select not reserved presents button")
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
        return (
            <div style={sectionStyle}>
                <button style={{borderRadius: "12px", height: "75px"}} onClick={this.all}>Wszystkie(15)</button>
                <button style={{borderRadius: "12px", height: "75px"}} onClick={this.notReserved}>Niezarezerwowane(10)</button>
                <button style={{borderRadius: "12px", height: "75px"}} onClick={this.reserved}>Zarezerwowane(5)</button>
            </div>
        )
    }
}

class ListSquareMainBody extends React.Component{
    render(){
        console.log("List sqaure main body rendering presents: " + (typeof this.props.presents != "undefined"))
        console.log(this.props.presents)

        var presentComponents = this.props.presents;
        presentComponents = typeof presentComponents != "undefined" ? presentComponents.map(
            (present, i) => {
                return(
                    <div key={present.presentId} data-grid={{x: (i+1)%3, y: Math.floor((i+1)/3), w:1, h:1, static:true}} style={{border: ".1px solid #0066cc"}}>
                        <PresentComponent present={present}  />
                    </div>)
            }
        ) : [];

        return(
            <GridLayout className="layout" width={800}  rowHeight={250} cols={3} style={{ height: "600px", marginLeft:"100px", marginRight: "100px"}}>
                <div key="sugg" data-grid={{x: 0, y: 0, w:1, h:1, static:true}}>
                    <SuggestComponent />
                </div>
                {presentComponents}
            </GridLayout>
        )
    }
}

class SuggestComponent extends React.Component{

    suggest(){
        console.log("suggest present")
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
        return(
            <div >
                <div style={{background: "#FF8C2F",  width:"100%", height:"30px", display: "flex", flexDirection:"row", alignItems:"center"}}>
                    <div style={{width:"50px", marginLeft:"10px", fontSize:"20px"}}>{this.props.present.name}</div>
                    <button style={{width:"100px", marginLeft:"80px"}}>Rezerwuj</button>
                </div>

                <div style={{width:"100%", height:"160px", display: "flex", flexDirection:"row", alignItems: "center"}}>
                    <img src={this.props.present.imageUrl} alt={this.props.present.imageUrl} style={{width: "100px", marginLeft:"5px"}}/>
                    <div style={{width: "120px", textAlign:"center", fontSize:"13px", marginRight:"5px"}}> {this.props.present.description}</div>
                </div>
                <div style={{width:"100%", height:"30px", display: "flex",  flexDirection:"row", justifyContent: "center"}}>
                    <a href={this.props.present.shopLink}> {this.props.present.shopLink} </a>
                </div>
                <div style={{width:"100%", height:"30px", display: "flex", justifyContent:"center"}}>
                    <button style={{height:"20px", display: "flex",  flexDirection:"row", alignItems: "center"}}> Pokaż więcej </button>
                </div>
            </div>
        )
    }
}

class GuestApp extends React.Component{

	render() {
		return (
             <div>
                <p>Hello Guest</p>
		        <img src="background_transparent.png" alt="birthday party image"/>
             </div>
		 );
    }
}


try{
    ReactDOM.render(
        <App />,
        document.getElementById('react')
    )
}catch(e){ console.log("not found element: react")}

try {

    ReactDOM.render(
        <GuestApp />,
        document.getElementById('react_guest')
    )
}catch(e){console.log("not found element: react_guest")}

