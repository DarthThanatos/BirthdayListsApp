import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

export default class PreviousEvents extends React.Component {
    render() {
        var numberCircleCss={
        borderRadius: "0.8em",
        MozBorderRadius: "0.8em",
        WebkitBorderRadius: "0.8em",
        border: "2px solid #666",
        display: "inline-block",
        fontWeight: "bold",
        lineHeight: "1.6em",
        textAlign: "center",
        width: "1.6em",
    }
    var listGroupItemCss = {
            padding: "0.75rem 0rem",
            backgroundColor: "rgba(247, 247, 247, 0)"
    }
    var customPadding={
            padding: "0"
    }
    var hrStyle={
            height: "12px",
            border: "0",
            margin: "1em 0 0 0",
            borderTop: "1px solid rgba(0, 0, 0, 0.4)"
    }
        return (
                <div>
                    <h5 style={{padding: " 0.2em 0.2em 1em 0.2em"}} className="text-center"><strong>Poprzednie wydarzenia</strong></h5>
                    <ListGroup>
                        <ListGroupItem style={listGroupItemCss}>
                            <div style={{paddingRight:"1em"}} className="container-fluid">
                                <div  style={customPadding} className="row">
                                    <div   style={customPadding} className={"col-2 text-center"}>
                                        <div style={{fontSize: "250%"}}>&#9312;</div>
                                    </div>
                                   <div className="col-9">
                                       <span>Osiemnastka</span>
                                       <br/>
                                       <span className="text-muted">rok temu</span>
                                       <hr style={hrStyle}/>
                                   </div>
                                </div>
                            </div>
                        </ListGroupItem>
                        <ListGroupItem style={listGroupItemCss}>
                            <div style={{paddingRight:"1em"}} className="container-fluid">
                                <div  style={customPadding} className="row">
                                    <div   style={customPadding} className={"col-2 text-center"}>
                                        <div style={{fontSize: "250%"}}>&#9313;</div>
                                    </div>
                                    <div className="col-9">
                                        <span>Siedemnaste urodziny :)</span>
                                        <br/>
                                        <span className="text-muted">2 lata temu</span>
                                        <hr style={hrStyle}/>
                                    </div>
                                </div>
                            </div>
                        </ListGroupItem>
                        <ListGroupItem style={listGroupItemCss}>
                            <div style={{paddingRight:"1em"}} className="container-fluid">
                                <div  style={customPadding} className="row">
                                    <div   style={customPadding} className={"col-2 text-center"}>
                                        <div style={{fontSize: "250%"}}>&#9314;</div>
                                    </div>
                                    <div className="col-9">
                                        <span>16 xD</span>
                                        <br/>
                                        <span className="text-muted">3 lata temu</span>
                                        <hr style={hrStyle}/>
                                    </div>
                                </div>
                            </div>
                        </ListGroupItem>
                        <ListGroupItem style={listGroupItemCss}>
                            <div style={{paddingRight:"1em"}} className="container-fluid">
                                <div  style={customPadding} className="row">
                                    <div   style={customPadding} className={"col-2 text-center"}>
                                        <div style={{fontSize: "250%"}}>&#9315;</div>
                                    </div>
                                    <div className="col-9">
                                        <span>15 u babci</span>
                                        <br/>
                                        <span className="text-muted">4 lata temu</span>
                                        <hr style={hrStyle}/>
                                    </div>
                                </div>
                            </div>
                        </ListGroupItem>
                    </ListGroup>
                </div>

        );
    }
}