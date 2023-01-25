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
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

const HUser = () => {
  const [price, setPrice] = useState("10");
  const [activateERC20, setActivateERC20] = useState(0);
  const [textBoxes, setTextBoxes] = useState([]);

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

    });
    setTextBoxes(array);
    setData(listData);
  };
  useEffect(() => {
    datax();
    console.log("List data: ", listData);
  }, []);

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
                      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                      <br></br>
                      <CardMedia
                        component="img"
                        image={textBox.image}
                        alt="random"
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                          Name: {textBox.name}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="h2">
                          Details: {textBox.details}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="h2">
                          Cost per Hour: {textBox.cost}
                        </Typography>
                        <br></br>
                        <br></br>
                        <center>
                          <Button
                            variant="contained"
                            color="success"
                            className="buttonWallet"
                            onClick={(e) => {
                              alert("The cost per hour is: " + textBox.cost + " filecoins.");
                            }}
                          >
                            Reserve
                          </Button>
                        </center>
                      </CardContent>

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
