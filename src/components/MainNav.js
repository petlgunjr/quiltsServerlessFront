import React, { useState } from "react";
import { Nav, NavItem, FormControl, FormGroup, ControlLabel } from "react-bootstrap";
import MediaQuery from "react-responsive";
import "../containers/globalCSS.js";

export default function MainNav (props) {
  const [ navKey, setNavKey ] = useState("");
  const { history, auth } = props;

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
            <Nav className="Home KitchenHomeNav Schedule" bsStyle="pills" fixed="false" stacked pullLeft activeKey={navKey} >
              <NavItem eventKey={1} onClick={() => {history.push("/embroidery"); setNavKey(1);}}>
                Embroidery
              </NavItem>
              <NavItem eventKey={2} onClick={() => {history.push("/designs"); setNavKey(2);}}>
                Designs
              </NavItem>
              <NavItem eventKey={3} onClick={() => {history.push("/kitchen"); setNavKey(3);}}>
                Kitchen Items
              </NavItem>
              <NavItem eventKey={4} onClick={() => {history.push("/fabrics"); setNavKey(4);}}>
                Fabrics
              </NavItem>
              {/* <NavItem eventKey={3} onClick={() => {history.push("/quilts"); setNavKey(3);}}>
                Quilts
              </NavItem> */}
              <NavItem eventKey={5} onClick={() => {history.push("/schedule"); setNavKey(5);}}>
                Show Schedule
              </NavItem>
              {/* <NavItem eventKey={4} onClick={() => {history.push("/newFabrics"); setNavKey(4);}}>
                New Items!!
              </NavItem> */}
              {auth ? (
                <NavItem eventKey={5} onClick={() => {history.push("/admin"); setNavKey(5);}}>
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
                  {auth ? (
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
