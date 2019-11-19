import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import { API } from "aws-amplify";
import "./App.css";
import MainNav from "./components/MainNav";
import EmbroideryNav from "./components/EmbroideryNav";
import KitchenNav from "./kitchen/KitchenNav";

function App(props) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
    !isAuthenticating && (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/"><span className="NavHeaderBar">Embroidery by Wanda</span></Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {isAuthenticated ? (
                <>
                  <LinkContainer to="/admin">
                    <NavItem><span className="NavHeaderBar">Admin</span></NavItem>
                  </LinkContainer>
                  <NavItem onClick={handleLogout}><span style={{color: 'white'}}>Logout</span></NavItem>
                </>
                ) : (
                <>

                  <LinkContainer to="/login">
                    <NavItem><span className="NavHeaderBar">Admin</span></NavItem>
                  </LinkContainer>
                </>
                )
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <MainNav history={history} auth={isAuthenticated} />
        {/* {window.location.pathname.includes("/kitchen/") ? <KitchenNav history={history} auth={isAuthenticated} /> : null} */}
        {window.location.pathname.includes("/embroidery") ? <EmbroideryNav history={history} auth={isAuthenticated} />:null}
        <div style={{display: 'flex'}}>
          <Routes appProps={{ isAuthenticated, userHasAuthenticated, products, isLoading }} />
        </div>
      </div>
    )
  );
}
export default withRouter(App);