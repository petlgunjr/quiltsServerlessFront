import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { ThemeProvider } from "styled-components";
import Routes from "./Routes";
import { API } from "aws-amplify";
import MainNav from "./components/MainNav";
import Modal from "react-modal";
import { pinkTheme, conventionalTheme } from "./containers/theme";
import { GlobalStyles } from "./containers/globalCSS";

function App(props) {

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [theme, setTheme] = useState('pinkTheme');
  const [isLoading, setIsLoading] = useState(true);
  const [price, setPrice] = useState("");
  const { history } = props;
  const [schedule, setSchedule] = useState([]);
  const [graphicChoice, setGraphicChoice] = useState([]);
  const [graphicChosen, setGraphicChosen] = useState(false);
  const [productChoice, setProductChoice] = useState([]);
  const [productChosen, setProductChosen] = useState(false);
  const [productTypeChosen, setProductTypeChosen] = useState("");
  const [graphicView, setGraphicView] = useState("select");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [isLargeImage, setIsLargeImage] = useState(false);
  const [currentLargeImg, setCurrentLargeImg] = useState([]);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      const schedule = await API.get("quilts", "/schedule");
      setSchedule(schedule);
      const products = await API.get("quilts", "/products");
      setProducts(products);
      const designs = await API.get("quilts", "/design");
      setDesigns(designs);
      const fabrics = await API.get("quilts", "/fabric");
      setFabrics(fabrics);
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        onLoad();
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

  function toggleTheme () {
    if(theme === 'pinkTheme') {
      setTheme('conventionalTheme');
    } else {
      setTheme("pinkTheme");
    }
  }

  function LargerImage () {
    console.log(currentLargeImg);
    const customStyles = {
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        maxHeight             : "90%"
      }
    };
    return (
      <Modal
        isOpen={isLargeImage}
        // onRequestClose={handleLargeImage}
        style={customStyles}
        contentLabel={currentLargeImg.name}
      >
        <img alt="Large showing" src={currentLargeImg.imgUrl} />
        <br />
        <Button onClick={() => handleLargeImage()}>Close</Button>
      </Modal>
    )
  }

  function handleProductChoice(product) {
    setProductChoice(product);
    setProductTypeChosen(product.subCat.toUpperCase());
    setProductChosen(true);
    setPrice(product.price);
    setPurchasePrice(Number(product.price));
    setIsLargeImage(false);
    // setQuantity(1);
  }

  async function handleLargeImage(product) {
    await setCurrentLargeImg(product);
    if (currentLargeImg.length !== 0) {
      setIsLargeImage(!isLargeImage ? true : false);
    }
  }

  function handleGraphicChoice(graphic) {
    setGraphicChoice(graphic);
    setGraphicChosen(true);
    setIsLargeImage(false);
  }

  function handleGraphicView(e) {
    setGraphicView(e.target.value);
    setIsLargeImage(false);
  }

  return (
    !isAuthenticating && (
      <ThemeProvider theme={theme === 'pinkTheme' ? pinkTheme : conventionalTheme}>
        <div className="App container">
          <Navbar className="appNav" fluid collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/"><img className="NavHeaderBarLogo" src="https://wandaquilts.s3.us-east-2.amazonaws.com/private/us-east-2%3A2f67acc9-e8bd-4aa4-b6cf-074193ad94e4/top.ht2-trans.gif" alt="Embroidery by Wanda" /></Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav pullRight>
                <GlobalStyles />
                <NavItem className="adminLink" onClick={toggleTheme}>Color Scheme</NavItem>
                {isAuthenticated ? (
                  <>
                    <LinkContainer to="/admin">
                      <NavItem><span className="adminLink">Admin</span></NavItem>
                    </LinkContainer>
                    <NavItem onClick={handleLogout}><span className="logoutLink">Logout</span></NavItem>
                  </>
                  ) : (
                  <>
                    <LinkContainer to="/login">
                      <NavItem><span className="adminLink">Admin</span></NavItem>
                    </LinkContainer>
                  </>
                  )
                }
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <MainNav history={history} auth={isAuthenticated} />
          <div style={{display: 'flex'}}>
            {!isLoading ?
              <Routes appProps={
                {
                  isAuthenticated,
                  userHasAuthenticated,
                  schedule,
                  isLoading,
                  products,
                  designs,
                  fabrics,
                  handleProductChoice,
                  handleLargeImage,
                  handleGraphicView,
                  handleGraphicChoice,
                  graphicChoice,
                  graphicChosen,
                  productChoice,
                  productChosen,
                  productTypeChosen,
                  setGraphicView,
                  graphicView,
                  setGraphicChosen,
                  setGraphicChoice,
                  purchasePrice,
                  setProductChosen,
                  setProductChoice,
                  currentLargeImg,
                  setCurrentLargeImg,
                  LargerImage
                }
              } />
              :
              <h3>Loading, please be patient... Still working on speeding up load times!!</h3>
            }
          </div>
        </div>
      </ThemeProvider>
    )
  );
}
export default withRouter(App);