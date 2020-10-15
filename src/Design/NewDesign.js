import React, { useRef, useState } from "react";
import { API } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { s3Upload } from "../libs/awsLib";
import config from "../config";
import * as aws from 'aws-sdk';
import axios from "axios";
import "./NewDesign.css";

const s3instance = new aws.S3();

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

  function sign_s3(req, res) {
    console.log("config at sign_s3: ", config);
    setFileType(file.current.type);

    const s3Params = {
      Bucket: config.s3.BUCKET,
      Key: name,
      Expires: 500,
      contentType: fileType,
      ACL: 'public-read'
    }

    s3instance.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        console.log("error at get signed url: ", err);
        res.json({ success: false, error: err })
      }
      const returnData = {
        signedRequest: data,
        url: `https://${s3Params.Bucket}.s3.amazonaws.com/${name}`
      }
      res.json({ success: true, data: { returnData } });
    });
  }

  async function createDesign(design) {
    const response = await API.post("quilts", "/admin/design", {
      body: design
    });
    return response.key;
  }

  async function handleSubmit(event) {
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
      await s3Upload(file.current);
      const postUrl = config.apiGateway.URL;
      console.log("post url for axios: ", postUrl);
      axios.post(postUrl, {
        fileName: name,
        fileType: fileType
      })
        .then(response => {
          console.log("response at axios post: ", response);
          let returnData = response.data.data.returnData;
          let signedRequest = returnData.signedRequest;
          let url = returnData.url;
          setImgUrl(url);
          console.log("recieved a signed request: ", signedRequest);

          let options = {
            headers: {
              'Content-Type': fileType
            }
          };
          axios.put(signedRequest, file, options)
            .then(result => {
              console.log("Response from s3: ", result);
              setS3Success(true);
            })
            .catch(error => {
              console.log("ERROR at axios put: ", error);
            })
        })
        .catch(error => {
          console.log("ERROR at axios post: ", error);
        })

      await createDesign({ name, type, subCat, imgUrl, newGraphic, hidden });
      props.history.push("/");
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  }

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
