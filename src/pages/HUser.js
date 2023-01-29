import React, { useState, useEffect } from "react";
import Logo from "../assets/Logo.png";
import Poli from "../assets/Poli.png";
import "./Home.css";
import InputLabel from "@mui/material/InputLabel";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import defaultImage from "../assets/defaultService.png";
import { Button, CardActionArea, CardActions } from "@mui/material";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "../firebase1";
import { v4 } from "uuid";

// Pa saber si estoy conectado:
// https://github.com/barocapital/DomainsFrontEnd/tree/main/src
let connectedMetamask = true;
let plazo = 1;

const HUser = () => {
  const [price, setPrice] = useState("10");
  const [activateERC20, setActivateERC20] = useState(0);
  const [textBoxes, setTextBoxes] = useState([]);
  const [imageUpload, setImageUpload] = useState(null);

  const handleChange = (e, index) => {
    const values = [...textBoxes];
    if (e.target.name === "num") {
      values[index].num = e.target.value;
    }
    setTextBoxes(values);
  };

  //  Firebase loading data
  const [data, setData] = useState([]);
  let listData = [];

  const datax = async () => {
    let array = [];
    const dataFirestore = await firebase
      .firestore()
      .collection("register")
      .get();
    dataFirestore.forEach((doc) => {
      array.push(doc.data());
      // get:  name, details, cost, email, date, category, image
      addInput();
    });
    setTextBoxes(array);
    setData(listData);
  };
  useEffect(() => {
    datax();
    console.log("List data: ", listData);
  }, []);

  // Columns:
  const [colName, setColName] = useState("");
  const [colDetails, setColDetails] = useState("");
  const [colHours, setColHours] = useState([]);
  const [colBidderEmail, setColBidderEmail] = useState("");

  // Una función para agregar un nuevo input al array
  const addInput = () => {
    setColHours([...colHours, { value: "" }]);
  };
  // Una función para actualizar el valor de un input específico
  const updateInput = (index, value) => {
    const newInputs = [...colHours];
    newInputs[index].value = value;
    setColHours(newInputs);
  };

  // Firebase Register
  const handleSubmit = (e) => {
    if (imageUpload == null) {
      setImageUpload([]);
    } else {
      const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        console.log(snapshot.metadata.fullPath);
        getDownloadURL(snapshot.ref).then((url) => {
          const data = {
            name: colName,
            details: colDetails,
            hours: colHours,
            UserHours: textBoxes.reduce(
              (obj, value, index) => ({
                ...obj,
                [`textboxes ${index}`]: value,
              }),
              {}
            ),
            bidderEmail: textBoxes[e.target.id].email,
            image: textBoxes[e.target.id].image,
          };
          console.log(data);
          const db = firebase.firestore();
          db.collection("reserves")
            .add(data)
            .then(function (docRef) {
              console.log("Document written with ID: ", docRef.id);
              /*
              setColHours("");
              setColBidderEmail("");
              setCost("");
              setDetails("");
              setEmail("");
              setImage("");
              setDate("");*/
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
            });
        });
      });
    }
    alert("Done ,You will shortly receive your risk profile.");
    console.log("que trae e?:  ", e);
    e.preventDefault();
  };

  return (
    <div className="div-img">
      <Box
        sx={{
          my: 4,
          mx: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="walletCard">
          <React.Fragment>
            <h1>Market</h1>
            <Container sx={{ py: 8 }} maxWidth="md">
              <Grid container spacing={4}>
                {textBoxes.map((textBox, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                      className="border"
                    >
                      <br></br>
                      <center>
                        <Typography gutterBottom variant="h5" component="h2">
                          {textBox.category}
                        </Typography>
                        <div className="div-services">
                          <img
                            className={"img-services"}
                            src={
                              textBox.image.length >= 1
                                ? textBox.image
                                : defaultImage
                            }
                          />
                        </div>
                        <Typography gutterBottom variant="h5" component="h2">
                          Cost per Hour:
                        </Typography>
                        ${textBox.cost} filecoin
                      </center>

                      {connectedMetamask == true ? (
                        <React.Fragment>
                          <CardContent sx={{ flexGrow: 1 }}>
                            <TextField
                              id="filled-basic"
                              label="Hours"
                              type="number"
                              value={textBox.num}
                              onChange={(e) => handleChange(e, index)}
                            />
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="h2"
                            >
                              delivery term:{" "}
                              {Math.round(colHours / 5) <= 0 && colHours >= 1
                                ? 1
                                : Math.round(colHours / 5)}{" "}
                              days.
                            </Typography>
                          </CardContent>

                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="h2"
                            >
                              Name: {textBox.name}
                            </Typography>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="h2"
                            >
                              Details: {textBox.details}
                            </Typography>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="h2"
                            >
                              Email: {textBox.email}
                            </Typography>
                            <br></br>
                            <br></br>
                          </CardContent>

                          <center>
                            <CardActions sx={{ justifyContent: "center" }}>
                              <Button
                                id={index}
                                variant="contained"
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                                color="success"
                                className="button"
                                onClick={handleSubmit}
                                //onClick={(e) => { alert("The cost per hour is: " + textBox.cost + " filecoins.");  }}
                              >
                                Reserve
                              </Button>
                            </CardActions>
                          </center>
                        </React.Fragment>
                      ) : (
                        <></>
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </React.Fragment>
        </div>
      </Box>
    </div>
  );
};

export default HUser;
