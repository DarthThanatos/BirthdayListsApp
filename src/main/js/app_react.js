// 'use strict';
const React = require('react');
const ReactDOM = require('react-dom');

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import './main.css'
import BirthdayGuyHome from './BirthdayGuy/BirthdayGuyHome';
import GuestHome from './GuestHome/GuestHome';


try{
    ReactDOM.render(
        <BirthdayGuyHome />,
        document.getElementById('react')
    )
}catch(e){}

try {

    ReactDOM.render(
        <GuestHome />,
        document.getElementById('react_guest')
    )
}catch(e){}

