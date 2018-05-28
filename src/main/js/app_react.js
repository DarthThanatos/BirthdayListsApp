'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client_react');
const follow = require('./follow');

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {token: " Sending greeting email and loging in, this will take a sec ", ignored: "yolo2"};
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
          width: "1100px",
          height: "800px",
          backgroundImage: "url(background_transparent.png)",
          align: "center"
        };

		return (
		    <div style={sectionStyle}>
		        <Center/>
		        {this.state.token}
		    </div>

		 )
	}
}

class Center extends React.Component{

    render(){
        console.log("center")
        var sectionStyle = {
          width: "500px",
          height: "500px",
          background: "white"
        };
        return(
             <div style={sectionStyle}>
                <p> Hello </p>
             </div>
        );
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
        <App  />,
        document.getElementById('react')
    )
}catch(e){ console.log("not found element: react")}

try {

    ReactDOM.render(
        <GuestApp />,
        document.getElementById('react_guest')
    )
}catch(e){console.log("not found element: react_guest")}
