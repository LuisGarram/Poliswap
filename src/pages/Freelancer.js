import React, { useState, useEffect } from "react";
import "./Home.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import defaultImage from "../assets/defaultService.png";
import { Button, CardActionArea, CardActions } from "@mui/material";

import { UserAuth } from "../context/AuthContext";
let connectedMetamask = true;
let Loading = true;

const Freelancer = () => {
  const { user } = UserAuth();
  const [textBoxes, setTextBoxes] = useState([]);
  let listData = [];
  const datax = async () => {
    Loading = true;
    let catalogServiceList = [];
    let registerList = [];
    let reservesList = [];

    const categoryCatalog = await firebase
      .firestore()
      .collection("category")
      .get();
    categoryCatalog.forEach((doc) => {
      catalogServiceList = doc.data().category;
    });

    const reserves = await firebase.firestore().collection("reserves").get();
    const services = await firebase.firestore().collection("register").get();
    const statusQuery = await firebase.firestore().collection("status").get();

    services.forEach(async (doc) => {
      if (user.email === doc.data().email) {
        registerList.push({
          serviceId: doc.id,
          categoryId: doc.data().category,
          categoryName: catalogServiceList[doc.data().category].name,
          nameService: doc.data().name,
          deliveryTerm: doc.data().deliveryTerm,
          details: doc.data().details,
          image: doc.data().image,
        });
      }
    });

    reserves.forEach(async (reservesRow) => {
      let statusName = "";
      statusQuery.forEach(async (stat) => {
        if (stat.id == reservesRow.data().idStatus) {
          statusName = stat.data().name;
        }
      });

      registerList.forEach(async (registerRow) => {
        if (reservesRow.data().id == registerRow.serviceId) {
          console.log(reservesRow.data());
          console.log("---");
          reservesList.push({
            categoryName: registerRow.categoryName,
            categoryId: registerRow.categoryId,
            total: reservesRow.data().total,
            deliveryTerm: registerRow.deliveryTerm,
            client: reservesRow.data().client,
            status: statusName,
            image: registerRow.image,
            HiringDate: reservesRow.data().HiringDate,
          });
        }
      });
    });
    setTextBoxes(reservesList);
    Loading = false;
  };
  useEffect(() => {
    if (user.email) {
      datax();
    }
  }, [user.email]);

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
            <h1>Freelancer</h1>
            {Loading == true ? <h1>Loading...</h1> : <></>}
            <Container sx={{ py: 8 }} maxWidth="md">
              <Grid container spacing={4}>
                {textBoxes.length >= 1 ? (
                  textBoxes.map((textBox, index) => (
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
                        </center>

                        {connectedMetamask == true ? (
                          <React.Fragment>
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="h2"
                              >
                                Total: {textBox.total}
                              </Typography>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="h2"
                              >
                                Status:{textBox.status}
                              </Typography>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="h2"
                              >
                                Delivery term: {textBox.deliveryTerm} days.
                              </Typography>
                            </CardContent>
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="h2"
                              >
                                Hiring date: {textBox.HiringDate}
                              </Typography>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="h2"
                              >
                                Buyer email: {textBox.client}
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
                                >
                                  Report
                                </Button>
                              </CardActions>
                            </center>
                          </React.Fragment>
                        ) : (
                          <></>
                        )}
                      </Card>
                    </Grid>
                  ))
                ) : Loading == true ? (
                  <></>
                ) : (
                  <h1>Not reserves.</h1>
                )}
              </Grid>
            </Container>
          </React.Fragment>
        </div>
      </Box>
      {(Loading = true)}
    </div>
  );
};

export default Freelancer;
