import React, { useRef, useState } from "react";
import { API } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { s3Upload } from "../libs/awsLib";
import config from "../config";
import getDbById from "../components/DBid";
import getDbByName from "../components/DBname";
import "./NewDesign.css";

export default function NewProduct(props) {
  const imgUrlLocation = "";
  // const imgLinkLocation = "https://wandaquilts.s3.us-east-2.amazonaws.com/private/us-east-2%3A2f67acc9-e8bd-4aa4-b6cf-074193ad94e4/";
  const file = useRef(null);
  const [name, setName] = useState("");
  const [fileType, setFileType] = useState("");
  const [type, setType] = useState("");
  const [subCat, setSubCat] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [newGraphic, setNewGraphic] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [s3Success, setS3Success] = useState(false);
  const [s3UploadReturn, setS3UploadReturn] = useState(null);

  function validateForm() {
    return name.length > 0 &&
      type.length > 0 &&
      subCat.length > 0;
  }

  function handleFileChange(event) {
    console.log("current file at handleFileChange: ", file);
    file.current = event.target.files[0];
    setName(file.current.name.split(".")[0]);
    setType(file.current.name.substr(0, 3));
    setSubCat(file.current.name.substr(3, 3));
    setFileType(file.current.type);
    // setImgUrl(imgUrlLocation);
  }

  function handleHidden() {
    setHidden(!hidden ? true : false)
  }

  function handleNewGraphic() {
    setNewGraphic(!newGraphic ? true : false)
  }

  async function createDesign(design) {
    const response = await API.post("quilts", "/admin/design", {
      body: design
    });
    return response.key;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
        1000000} MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      const nameUrl = `/design/name/EMBafg1104`
      s3Upload(file.current, setS3UploadReturn)
        .then(s3UploadResults => {
          console.log("s3UploadReturn: ", s3UploadResults);
          if (s3UploadReturn !== undefined) {
            getDbByName(name, nameUrl)
              .then((getDbByNameResults) => {
                console.log("results from getDbByName: ", getDbByNameResults);
                createDesign({ name, type, subCat, imgUrl, newGraphic, hidden });
              })
              .then(createDesignResults => {
                console.log("createDesign results: ", createDesignResults)
                props.history.push("/");
                setIsLoading(false);
                alert("Upload successful");
              })
          } else {
            console.log("error in new design");
            return;
            // handleSubmit(event)
          }
        });
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  }

  // async function handleSubmit(event) {
  //   event.preventDefault();

  //   if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
  //     alert(
  //       `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
  //       1000000} MB.`
  //     );
  //     return;
  //   }

  //   setIsLoading(true);

  //   try {
  //     const nameUrl = `/design/name/EMBafg1104`
  //     await s3Upload(file.current, setS3UploadReturn)
  //       .then(async function (results) {
  //         if (setS3UploadReturn !== null) {
  //           console.log("s3UploadReturn: ", s3UploadReturn);
  //           await getDbByName(name, nameUrl)
  //           await createDesign({ name, type, subCat, imgUrl, newGraphic, hidden });
  //           console.log("name in new design: ", name);
  //           props.history.push("/");
  //           alert("Upload successful");
  //         } else {
  //           console.log("error in new design");
  //           return;
  //           // handleSubmit(event)
  //         }
  //       });
  //   } catch (e) {
  //     alert(e);
  //     setIsLoading(false);
  //   }
  // }


  return (
    <div className="NewDesign">
      <form onSubmit={handleSubmit}>
        <h4>{name}</h4>
        <FormGroup controlId="file">
          <ControlLabel>Attachment</ControlLabel>
          <FormControl onChange={handleFileChange} type="file" />
        </FormGroup>
        <FormGroup controlId="hidden">
          <ControlLabel>Hidden?</ControlLabel>
          <FormControl onChange={handleHidden} type="checkbox" />
        </FormGroup>
        <FormGroup controlId="newGraphic">
          <ControlLabel>New Design?</ControlLabel>
          <FormControl onChange={handleNewGraphic} type="checkbox" />
        </FormGroup>
        {!s3Success &&
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            bsStyle="primary"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Create
          </LoaderButton>
        }
        {s3Success &&
          <h1>YOU UPLOADED YOUR FILE!!!!</h1>
        }
      </form>
    </div>
  );
}
