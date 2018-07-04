import React from 'react';


export default class Footer extends React.Component {
    render() {
        var sectionStyle = {
            marginTop: "4em",
            border: ".1px solid #0066cc",
            padding: "2em 4em 2em 4em",
        }
        return(
            <div className="white" style={sectionStyle}>
                <h2 style={{fontSize: "2.5rem"}}>Prezenty</h2>
                <div style={{paddingLeft: "0.5em"}}> Aby wygodnie publikować swoje listy prezentów, już nie musisz szukać dalej</div>
                <div className="text-center" style={{padding: "1em"}}><h5>Znajdz nas na:</h5></div>
                <ServicesIcons/>
            </div>
        )
    }
}
class ServicesIcons extends React.Component{

    render(){
        var sectionStyle={
            padding: "0 1em 0 1em",
        }
        var aStyle = {
            padding: "0.5em",
        }
        return (
            <div className="text-center" style={sectionStyle}>
                <a target="_blank" className="hover-brand" style={aStyle} href="https://www.facebook.com/" ><i className="fa fa-facebook fa-3x" aria-hidden="true"></i></a>
                <a target="_blank" className="hover-brand" style={aStyle} href="https://www.snapchat.com/" ><i className="fa fa-snapchat-ghost fa-3x" aria-hidden="true"></i></a>
                <a target="_blank" className="hover-brand" style={aStyle} href="https://plus.google.com/" ><i className="fa fa-google-plus fa-3x" aria-hidden="true"></i></a>
                <a target="_blank" className="hover-brand" style={aStyle} href="https://pl.pinterest.com/" ><i className="fa fa-pinterest-p fa-3x" aria-hidden="true"></i></a>
                <a target="_blank" className="hover-brand" style={aStyle} href="https://twitter.com/" ><i className="fa fa-twitter fa-3x" aria-hidden="true"></i></a>
            </div>
        )
    }
}