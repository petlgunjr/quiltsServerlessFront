import React from "react";
import { Row, Col, Thumbnail, Button } from "react-bootstrap";
import imgBreakDown from "./ImgBreakDown";


export default function RenderLetterGraphics(props) {
  const {
    letterView,
    graphics,
    handleLargeImage,
    handleGraphicChoice
  } = props.letterProps;

  const letterArr = graphics.filter(graphic =>
    // let nameToCheck = imgBreakDown.subCat[graphic.subCat];
    // if(nameToCheck === undefined) {
    //   console.log(graphic.name);
    // }
    // console.log(nameToCheck);
    imgBreakDown.subCat[graphic.subCat].substr(0,1).toUpperCase() === letterView
  ).sort((a, b) => {
    let name1 = imgBreakDown.subCat[a.subCat];
    let name2 = imgBreakDown.subCat[b.subCat];
    if(name1>name2){return 1}
    if(name1<name2){return -1}
    if(name1===name2){return 0}
  });


  const singleList = [...new Map(letterArr.map(item => [item.subCat, item])).values()];

  function headerCreator() {
    return (
      <React.Fragment>
        {singleList.map((toBeOrdered, i) => {
          return (
            <React.Fragment key={i}>
              <Row key={toBeOrdered.subCat}>
                <h2 style={{textDecoration: "underline"}}><strong>{imgBreakDown.subCat[toBeOrdered.subCat]}</strong></h2>
              </Row>
              <Row>
                {graphics.map((graphic, j) => {
                  if(graphic.subCat === toBeOrdered.subCat){
                    return (
                      <Col key={graphic + j} xs={12} sm={5} md={4} lg={4}>
                        <Thumbnail className="renderThumb" key={graphic._id} src={graphic.imgUrl} alt="Image to be added soon....">
                          <h3>{graphic.name}</h3>
                          <Button onClick={() => handleLargeImage(graphic)}>Enlarge</Button>
                          <Button onClick={() => handleGraphicChoice(graphic)}>Choose</Button>
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
    <React.Fragment>
      <Row>
        <Col className="graphicHeader" xs={12} sm={5} md={4} lg={4}>
          <h1 style={{textDecoration:"underline"}}><strong>{letterView}</strong></h1>
        </Col>
      </Row>
      {headerCreator()}
    </React.Fragment>
  )
}