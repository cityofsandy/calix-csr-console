import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { global } from '../../config';
import { UserContext } from '../context/global';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: {},
      headerTitle: global.header.siteTitle,
    };
  }

  render() {
    const {
      userData,
      headerTitle,
    } = this.state;

    return (
      <div className="wrapper">
        <UserContext.Provider value={userData}>
          <React.Fragment>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
              <LinkContainer to="/">
                <Navbar.Brand>
                  {headerTitle}
                </Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                  <LinkContainer to="/cpe">
                    <Nav.Link>CPE</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/serviceProvider">
                    <Nav.Link>Service Provider</Nav.Link>
                  </LinkContainer>
                  <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                    <LinkContainer to="/systems">
                      <NavDropdown.Item>Systems Management</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
                <Nav>
                  <Nav.Link href="#deets">More deets</Nav.Link>
                  <Nav.Link eventKey={2} href="#memes">
                    Dank memes
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
            <div id="page-wrapper" className="content-wrapper" onClick={this.clickContentWrapper}>
              {this.props.children}
            </div>
          </React.Fragment>

        </UserContext.Provider>
      </div>
    );
  }
}

export { App };
