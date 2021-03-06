import React from "react";
import { Col, Grid, Row, Thumbnail, Button } from "react-bootstrap";
import Modal from "react-modal";
import imgBreakDown from "./ImgBreakDown";

Modal.setAppElement('#root');

export default function RenderGraphics(props) {
  const {
    isAuthenticated,
    graphicView,
    handleGraphicChoice,
    handleEdit,
    handleDelete,
    graphicCategories,
    graphics,
    handleLargeImage,
  } = props.graphicProps;


  function renderCategoryGraphics() {
    console.log("graphic view at render: ", graphicView);
    return (
      <React.Fragment>
        <Row>
          <Col className="graphicHeader" xs={12} sm={5} md={4} lg={4}>
            <h2 style={{ textDecoration: "underline" }}><strong>{imgBreakDown.subCat[graphicView]}</strong></h2>
          </Col>
        </Row>
        <Row>
          {graphics.map((graphic, i) => {
            if (graphic.subCat === graphicView) {
              console.log("graphic subcat at cat render", graphic.subCat);
              return (
                <Col key={i} xs={12} sm={5} md={3} lg={4}>
                  <Thumbnail className="renderThumb" key={graphic._id} src={graphic.imgUrl} alt="Image to be added soon....">
                    <h3>{graphic.name}</h3>
                    <Button onClick={() => handleLargeImage(graphic)}>Enlarge</Button>
                    <Button onClick={() => handleGraphicChoice(graphic)}>Choose</Button>
                    {
                      isAuthenticated && (
                        <React.Fragment>
                          <Button onClick={() => handleEdit(graphic)}>Edit</Button>
                          <Button onClick={() => handleDelete(graphic)}>Delete</Button>
                        </React.Fragment>
                      )
                    }
                  </Thumbnail>
                </Col>
              )
            }
          })}
        </Row>
      </React.Fragment>
    )
  }

  function renderAllGraphics() {
    return (
      <React.Fragment>
        {graphicCategories.map((category, i) => {
          return (
            <React.Fragment key={i}>
              <Row key={category}>
                <h2 style={{ textDecoration: "underline" }}><strong>{imgBreakDown.subCat[category]}</strong></h2>
              </Row>
              <Row>
                {graphics.map((graphic, i) => {
                  if (graphic.subCat === category) {
                    return (
                      <Col key={category + i} xs={12} sm={5} md={4} lg={4}>
                        <Thumbnail className="renderThumb" key={graphic._id} src={graphic.imgUrl} alt="Image to be added soon....">
                          <h3>{graphic.name}</h3>
                          <Button onClick={() => handleLargeImage(graphic)}>Enlarge</Button>
                          <Button onClick={() => handleGraphicChoice(graphic)}>Choose</Button>
                          {
                            isAuthenticated && (
                              <React.Fragment>
                                <Button onClick={() => handleEdit(graphic)}>Edit</Button>
                                <Button onClick={() => handleDelete(graphic)}>Delete</Button>
                              </React.Fragment>
                            )
                          }

                        </Thumbnail>
                      </Col>
                    )
                  }
                })}
              </Row>
              <Row>
                <hr />
              </Row>
            </React.Fragment>
          )
        })}
      </React.Fragment>
    )
  }

  return (
    <Grid fluid>
      {graphicView === "all" ? renderAllGraphics() : <h2>Please choose from the dropdown above!!</h2>}
      {graphicView !== "all" ? renderCategoryGraphics() : <h2>Please choose from the dropdown above!!</h2>}
    </Grid>
  );
}
