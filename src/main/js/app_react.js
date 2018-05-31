'use strict';
const React = require('react');
const ReactDOM = require('react-dom');

import BirthdayGuyHome from './BirthdayGuyHome';
import GuestHome from './GuestHome';

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

