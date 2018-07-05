'use strict';
const React = require('react');
import PresentTile from "./PresentTile";
import {Row, Col, Button } from 'reactstrap';



export default class MainPanel extends React.Component{


    constructor(props) {
        super(props)
        this.state = {
            toShow: 5
        }
    }
    renderTiles(){
        var suggestions = this.props.suggestions.map(
            (s) => <Col sm="4" style={{marginBottom: "2em"}}><PresentTile onClick={(sId) => this.props.onClick(sId)} category={s.category} shopLink={s.shopLink} accepted={s.accepted} accepting={s.accepting} title={s.name} description={s.description} icon={s.imageUrl} sId={s.id}/></Col>);
        var presents = this.props.presents.map(
            (s) => <Col sm="4" style={{marginBottom: "2em"}}><PresentTile onClick={(sId) => this.props.onClick(sId)} category={s.category} shopLink={s.shopLink} accepted={true} title={s.name} description={s.description} icon={s.imageUrl} sId={s.id}/></Col>);

        var all = suggestions.concat(presents)
        return all;
    }
    render() {
        var styles = {
            backgroundColor: "rgba(247, 247, 247, 0.9)",
            padding: "0 4em",
        };
        var addPresentButtonStyles = {
            height: "100%",
        };
        var tiles = this.renderTiles();
        var showMoreButton = <div className="text-center" style={{margin: "2em"}}><Button color="secondary" onClick={() =>  {let toShow = this.state.toShow + 6;this.setState({toShow: toShow})}}>Pokaż więcej prezentów</Button></div>
        return (
          <div style={styles}>
                  <Row>
                      <Col style={{padding: "2em 2em 4em 2em"}} sm="5" className="offset-3">
                          <div id="header" className="text-center">
                              <h1>19 urodzinki</h1>
                              <h4>20 maja 2018 (za 5 dni)</h4>
                          </div>
                      </Col>
                  </Row>
                  <Row>
                      <Col sm="4" style={{marginBottom: "2em"}}>
                          <Button color="primary"   onClick={()=>{this.props.onAddPresentClick()}}style={addPresentButtonStyles} className="orange fontColor btn-block"><h1>Dodaj</h1><h1>Prezent</h1></Button>
                      </Col>
                      {tiles.slice(0,this.state.toShow)}
                  </Row>
              {tiles.length <= this.state.toShow ? null: showMoreButton}
          </div>
        );
    }
}