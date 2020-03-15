import React, { useState } from "react";
import { Nav, NavItem, FormControl, FormGroup, ControlLabel } from "react-bootstrap";
import MediaQuery from "react-responsive";
import "../containers/globalCSS.js";

export default function MainNav (props) {
  const [ navKey, setNavKey ] = useState("");
  const { history, isAuthenticated, startOver, setShowLetterNav } = props.navProps;

  function handleNavSelection (e) {
    history.push(`${e.target.value}`);
  }

  return (
    <React.Fragment>
      {window.location.pathname.includes("/admin") || window.location.pathname.includes("/login") ? null : (
      <MediaQuery minWidth={786}>
        {(matches) =>
          matches
            ? (
            <Nav className="mainNav" bsStyle="pills" stacked pullLeft activeKey={navKey} >
              <NavItem eventKey={1} onClick={() => {startOver(); history.push("/newitems"); setNavKey(1);}}>
                NEW!!
              </NavItem>
              <NavItem eventKey={2} onClick={() => {startOver(); history.push("/embroidery"); setNavKey(2); setShowLetterNav(true);}}>
                Products
              </NavItem>
              <NavItem eventKey={3} onClick={() => {startOver(); history.push("/designs"); setNavKey(3); setShowLetterNav(true);}}>
                Embroidery
              </NavItem>
              <NavItem eventKey={4} onClick={() => {startOver(); history.push("/kitchen"); setNavKey(4);}}>
                Kitchen Items
              </NavItem>
              <NavItem eventKey={5} onClick={() => {startOver(); history.push("/fabrics"); setNavKey(5);}}>
                Fabrics
              </NavItem>
              {/* <NavItem eventKey={3} onClick={() => {history.push("/quilts"); setNavKey(3);}}>
                Quilts
              </NavItem> */}
              <NavItem eventKey={6} onClick={() => { startOver(); history.push("/schedule"); setNavKey(6);}}>
                Show Schedule
              </NavItem>
              {/* <NavItem eventKey={4} onClick={() => {history.push("/newFabrics"); setNavKey(4);}}>
                New Items!!
              </NavItem> */}
              {isAuthenticated ? (
                <NavItem eventKey={7} onClick={() => {startOver(); history.push("/adminLoggedIn"); setNavKey(7);}}>
                  Admin
                </NavItem>
              ) : (
                null
              )
              }
            </Nav>
          )
          : (
            <FormGroup controlId="formControlsSelect">
              <ControlLabel>Page Nav</ControlLabel>
                <FormControl componentClass="select" placeholder="select" onChange={handleNavSelection}>
                  <option value="select">Select</option>
                  <option value="/">Home</option>
                  <option value="embroidery">Embroidery</option>
                  <option value="designs">Designs</option>
                  <option value="/kitchen">Kitchen</option>
                  <option value="/fabrics">Fabrics</option>
                  {/* <option value="quilts">Quilts</option> */}
                  <option value="/schedule">Schedule</option>
                  {isAuthenticated ? (
                    <option value="admin">Admin</option>
                    ) :
                    null
                  }
                </FormControl>
            </FormGroup>
          )
        }
      </MediaQuery>
      )}
    </React.Fragment>
  )
}
