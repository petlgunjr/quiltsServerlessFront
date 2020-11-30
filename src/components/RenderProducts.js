import React from "react";
import { Col, Grid, Row, Thumbnail, Button, FormControl, ControlLabel, FormGroup } from "react-bootstrap";
import Modal from "react-modal";

Modal.setAppElement('#root');

export default function RenderProducts(props) {
  const {
    isAuthenticated,
    products,
    handleProductChoice,
    typeToRender,
    handleLargeImage,
    handleColorChoice,
    handleSizeChoice,
    handleDelete,
    handleEdit,
    sizesToDisplay,
    sizesToChoose
  } = props.productProps;
  let renderSizes = false;

  return (
    <Grid fluid>
      <Row>
        {products.map((product, i) => {
          let colors = [];
          let prodWithSize = [];
          if (product.colors && product.colors.length !== 0) {
            colors = product.colors.split(",");
          }
          if (product.type !== "IMG") {
            if (
              product.subCat === "BWL" ||
              product.subCat === "HOO" ||
              product.subCat === "HOZ" ||
              product.subCat === "SWT" ||
              product.subCat === "TLB" ||
              // product.subCat === "TSL" ||
              product.subCat === "TSS" ||
              product.subCat === "VES"
            ) {
              prodWithSize.push(product);
              renderSizes = true;
            } else {
              renderSizes = false;
            }
          }
          if (product.type === typeToRender) {
            return (
              <Col key={i} xs={12} sm={5} md={4} lg={4}>
                <React.Fragment>
                  <Thumbnail className="renderThumb" key={product._id} src={product.imgUrl} alt="Image to be added soon....">
                    <h3>{product.name}</h3>
                    {renderSizes ?
                      (<FormGroup controlId="sizeSelect">
                        <FormControl componentClass="select" placeholder="select" onChange={handleSizeChoice}>
                          <option value="select">Size Choice</option>
                          {sizesToChoose.map((size, l) => {
                            if (prodWithSize[0][size] === undefined) {
                              return null;
                            } else {
                              return (
                                <option key={prodWithSize[0][size].paypalId} value={sizesToDisplay[l] + " " + prodWithSize[0][size].paypalId + " $" + prodWithSize[0][size].price}> {sizesToDisplay[l]} : $ {prodWithSize[0][size].price}</option>
                              )
                            }
                          })}
                        </FormControl>
                      </FormGroup>
                      ) : <h4>{`$${product.price}`}</h4>
                    }
                    {typeToRender === "EMB" &&
                      <FormGroup controlId="colorSelect">
                        <ControlLabel>Choose a color!</ControlLabel>
                        <FormControl componentClass="select" placeholder="select" onChange={handleColorChoice}>
                          <option value="select">Color Choice</option>
                          {colors.map((color, j) => {
                            return (
                              <option key={j} value={color}>{color}</option>
                            )
                          })}
                        </FormControl>
                      </FormGroup>
                    }
                    <Button onClick={() => handleLargeImage(product)}>Enlarge</Button>
                    <Button onClick={() => handleProductChoice(product)}>Choose</Button>
                    {
                      isAuthenticated && (
                        <React.Fragment>
                          <Button onClick={() => handleEdit(product)}>Edit</Button>
                          <Button onClick={() => handleDelete(product)}>Delete</Button>
                        </React.Fragment>
                      )
                    }
                  </Thumbnail>
                </React.Fragment>
              </Col>
            )
          }
        })
        }
      </Row>
    </Grid>
  );
}
