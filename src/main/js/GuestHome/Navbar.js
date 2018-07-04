import React from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';

export default class BirthdayNavbar extends React.Component {

    render() {
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="#">
                        <i className="fa fa-birthday-cake" aria-hidden="true"></i>  Prezenty
                    </NavbarBrand>
                    <Nav navbar>
                        <NavItem>
                            <NavLink href="#">Rezerwacje</NavLink>
                        </NavItem>
                   </Nav>

                </Navbar>
            </div>
        );
    }
}