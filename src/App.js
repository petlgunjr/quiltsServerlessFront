import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem, FormControl, ControlLabel, FormGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import { API } from "aws-amplify";
import "./App.css";
import MainNav from "./components/MainNav";
import { register } from "./serviceWorker";
import { MediaQuery } from "react-responsive";

function App(props) {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  // const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [isAuthenticated, userHasAuthenticated] = useState(false);

  const [ navKey, setNavKey ] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  // let currentAdminComponent;
  const { history } = props;

  const [products, setProducts] = useState([]);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      const products = await API.get("quilts", "/products");
      setProducts(products);
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
    setIsLoading(false);
    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);

    props.history.push("/login");
  }

  return (
    // !isAuthenticating && (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Embroidery by Wanda</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {isAuthenticated ? (
                <>
                  <LinkContainer to="/admin">
                    <NavItem>Admin</NavItem>
                  </LinkContainer>
                  <NavItem onClick={handleLogout}>Logout</NavItem>
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
     
        <MainNav history={history} />
        <Routes appProps={{ isAuthenticated, userHasAuthenticated, products, isLoading }} />
      </div>
    )
  // );
}
// register();
export default withRouter(App);