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

const Freelancer = () => {
  const { user } = UserAuth();
  const [textBoxes, setTextBoxes] = useState([]);
  let listData = [];
  const datax = async () => {
    let catalogServiceList = [];
    let registerList = [];
    let reservesList = [];

    const categoryCatalog = await firebase
      .firestore()
      .collection("category")
      .get();
    categoryCatalog.forEach((doc) => {
      catalogServiceList = doc.data().category;
      // get: client, hoursReserves, id, total
    });

    const reserves = await firebase.firestore().collection("reserves").get();
    const services = await firebase.firestore().collection("register").get();

    services.forEach(async (doc) => {
      /*
      {
           x "category": 1, 
           x  "image": "https://firebasestorage.googleapis.com/v0/b/poliswap.appspot.com/o/images%2Ficone-cercle-bleu.pngde6d0db9-9468-4b95-868e-602203499fed?alt=media&token=43105bce-d98f-474d-9a00-3689000986ed",
           x "name": "saaa", 
            x "email": "samuelpolino91@gmail.com", 
            x "deliveryTerm": 7, 
            x "details": "sss", 
            "cost": 5
        }
      */

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
      registerList.forEach(async (registerRow) => {
        if (reservesRow.data().id == registerRow.serviceId) {
          /*
          ReserverRow
            {
                "client": "dfhlokote@gmail.com",
                "total": null,
                "hoursReserved": null,
                "id": "pK86Wm5cnCVIRyVR5KQ1"
            }
            */
          /*
          RegisterRow
            {
                "serviceId": "pK86Wm5cnCVIRyVR5KQ1",
                "categoryId": 1,
                "categoryName": "Bussines promotion",
                "nameService": "saaa",
                "deliveryTerm": 7,
                "details": "sss"
                date
            }
            */
          console.log(reservesRow.data());
          console.log("---");
          reservesList.push({
            categoryName: registerRow.categoryName,
            categoryId: registerRow.categoryId,
            total: reservesRow.data().total,
            deliveryTerm: registerRow.deliveryTerm,
            client: reservesRow.data().client,
            image: registerRow.image,
          });
        }
      });
    });
    setTextBoxes(reservesList);
  };
  useEffect(() => {
    if (user.email) {
      datax();
    }
  }, [user.email]);

  // Firebase Register

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
                              Status:{" "}
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
                              Hiring date: {/*textBox.name*/}
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
                ))}
              </Grid>
            </Container>
          </React.Fragment>
        </div>
      </Box>
    </div>
  );
};

export default Freelancer;
