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
import { storage } from "../firebase";
import { v4 } from "uuid";
import { UserAuth } from '../context/AuthContext';
let connectedMetamask = true;

const HUser = () => {
  const { user } = UserAuth()
  const [textBoxes, setTextBoxes] = useState([]);
  let listData = [];

  const datax = async () => {
    let array = [];
    let catalogServiceList=[];
    const categoryCatalog = await firebase
      .firestore()
      .collection("category")
      .get();
      categoryCatalog.forEach((doc) => {

        catalogServiceList=doc.data().category;
      // get:  name, details, cost, email, date, category, image
    });
    const dataFirestore = await firebase
      .firestore()
      .collection("register")
      .get();
    dataFirestore.forEach((doc) => {
      array.push({ ...doc.data(),categoryName:catalogServiceList[doc.data().category].name , id: doc.id });
      // get:  name, details, cost, email, date, category, image
    });
    
    setTextBoxes(array);

  };
  useEffect(() => {
    datax();
  }, []);




  // Firebase Register
  const handleSubmit = (e,index,textBox) => {
    e.preventDefault();
      const data = {
        id: textBoxes[e.target.id].id,
        hoursReserved: parseInt(textBoxes[e.target.id].filecoinHours),
        total: parseInt(textBoxes[e.target.id].total),
        client:user.email
      };
      const db = firebase.firestore();
      db.collection("reserves")
        .add(data)
        .then(function (docRef) {
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
      alert("Done :)");
    

  };
  const handleChange = (e, index) => {
    const values = [...textBoxes];
    let strongRegex = new RegExp("^[0-9.]*$");
    if (e.target.name === "filecoinHours" && strongRegex.test(e.target.value) == false)
      return false;
    if (e.target.name === "filecoinHours") {
      values[index].total=  e.target.value * values[index].cost
      values[index].filecoinHours= e.target.value;
      setTextBoxes(values)
    } 
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
                          {textBox.categoryName}
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
                              id="filecoinHours"
                              label="Hours"
                              name="filecoinHours"
                              type="number"
                              value={textBox.filecoinHours}
                              onChange={(e) => handleChange(e, index,textBox)}
                            />
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="h2"
                            >
                              Delivery term: {textBox.deliveryTerm } {" "}
                              days.
                            </Typography>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="h2"
                            >
                              Total: {textBox.total?textBox.total:0} {" "} Filecoin
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
                                onClick= {(e) => handleSubmit(e, index)}
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
