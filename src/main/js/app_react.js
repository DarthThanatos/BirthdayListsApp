'use strict';

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
                this.printToken();
            },
            response => {
                console.log("invalid registering of mocked user")
                this.printToken(); //we are going to log in anyway
            }
		);
	}

    printToken(){
		client({method: 'POST', path: '/auth/login', entity: {email: "bielas.robert95@gmail.com", password: 'user'},headers: {'Content-Type': 'application/json'}}).done(response => {
		    console.log(response)
			this.setState({token: response.entity.token});
			this.postWishList(response.entity.token)
		});
    }

    postWishList(token){
        console.log("token: " + token)
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
            console.log(response)
            this.getAllLists(token)
		})
    }

    getAllLists(token){
		client({method: 'GET', path: '/api/list', headers: {'Authorization': "bearer " + token}}).done(response => {
		    console.log(response)
		})

    }

	componentDidMount() {
	    this.registerMockedUser();
	}

	render() {
		console.log(this.state)

		var sectionStyle = {
          width: "85%",
          height: "100%",
          marginLeft: "auto",
          marginRight: "auto",

        }

		return (
		    <div style={sectionStyle}>
		        <Header/>
		        <Center/>
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

    fbClicked(){
        console.log("Fb was clicked")
    }

    render(){
        var sectionStyle={
             width: "1200px",
             border: ".1px solid #0066cc",
             height: "150px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        }
        return (
            <div style={sectionStyle}>
                <button style={{borderRadius: "12px", display: "flex", flexDirection: "row", alignItems: "center", height: "75px"}} onClick={this.fbClicked}> <img src="fb.png" style={{marginLeft:"15px", marginRight:"15px"}}/> </button>
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
                <ListSquare/>
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
            opacity: 0.7
         }
        return (
            <div style={sectionStyle}>
                <p> Hello </p>
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
