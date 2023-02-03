import React, { useState,useContext , useEffect, useRef, useMemo} from "react";
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
import { UserAuth } from "../context/AuthContext";
import { CollectionsBookmarkRounded } from "@mui/icons-material";
import ABI from "../Solidity/TransferABI.json";
import {
  useAccount,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useContractWrite,
  useSendTransaction,
  useWaitForTransaction,
  ChainDoesNotSupportMulticallError,
  useNetwork
} from "wagmi";
import { providers, Contract, utils } from 'ethers';
let connectedMetamask = true;

const HUser = (props) => {
  const { chain } = useNetwork()
  const { user } = UserAuth();
  const [textBoxes, setTextBoxes] = useState([]);
  const [idStatusQuery, setIdStatusQuery] = useState("");
  const [address, setAddress] = useState("");
  const [serviceValue,setServiceValue]= useState("0");

  let listData = [];
  const [enableProcess, setEnableProcess] = useState(0);
  const theFlag = useMemo(() => {
    return address !== "" && serviceValue !== "";
  }, [address, serviceValue]);

  const dataxx = async () => {
    let array = [];
    let catalogServiceList = [];

    const statusCatalog = await firebase
      .firestore()
      .collection("status")
      .get();
    statusCatalog.forEach((doc) => {
      if (doc.data().name == "In Progress")
        setIdStatusQuery(doc.id);
    });

    const categoryCatalog = await firebase
      .firestore()
      .collection("category")
      .get();
    categoryCatalog.forEach((doc) => {
      catalogServiceList = doc.data().category;
      // get:  name, details, cost, email, date, category, image
    });



    const dataFirestore = await firebase
      .firestore()
      .collection("register")
      .get();
    dataFirestore.forEach((doc) => {
      array.push({
        ...doc.data(),
        categoryName: catalogServiceList[doc.data().category].name,
        id: doc.id,
      });
      // get:  name, details, cost, email, date, category, image
    });

    setTextBoxes(array);
  };
  useEffect(() => {
    dataxx();
  }, []);

  function getDate() {
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  const {
    config:isConfig,
    data: datax,
    isSuccess: isSuccessPrepare,
    error: prepareError,
    isPrepareError: isPrepareError,
  } = usePrepareContractWrite({
    address: process.env.REACT_APP_SMART_CONTRACT_FIL,
    abi: ABI,
    functionName: "transfer",
    enabled: theFlag,
    args: [address, utils.parseEther(serviceValue)],
    chainId:props.chains.find(networkValue => chain.id === networkValue.id).id,
    onSuccess(data) {
      console.log("Success", data);
    },
    onError(error) {
      setEnableProcess(0);
      console.log("Error", error);
    },
    onSettled(data, error) {
      console.log("Settled", { data, error });
    },
  });
  const { data:dataCW, error:errorCW, isError:isErrorCW, write } = useContractWrite(isConfig);
  const { isLoading:isLoadingWT, isSuccess:isSuccessWT } = useWaitForTransaction({
    hash: dataCW?.hash,
  });
  useEffect(() => {
    if (enableProcess == 2) {
      setEnableProcess(2);
      write?.();
    }
  }, [enableProcess]);
  // Firebase Register
  const handleSubmit = (e, index, textBox) => {
    if (textBoxes[e.target.id].filecoinHours != null && textBoxes[e.target.id].filecoinHours >= 1 && textBoxes[e.target.id].filecoinHours <= 10000) {
      e.preventDefault();

      const data = {
        HiringDate: getDate(),
        id: textBoxes[e.target.id].id,
        hoursReserved: parseInt(textBoxes[e.target.id].filecoinHours),
        total: parseInt(textBoxes[e.target.id].total),
        client: user.email,
        idStatus: idStatusQuery
      };
      const db = firebase.firestore();
      db.collection("reserves")
        .add(data)
        .then(async function (docRef) {
          alert("Done :)");
          setServiceValue((textBoxes[e.target.id].total).toString());
          setAddress("0xdD8815D8a1FD9eAF00cA2A0730096942B31C0AB5");
          const provider = new providers.Web3Provider(window.ethereum);
          // Get the current account
          const signer = provider.getSigner();


          // Define the amount of ether to send
          const amount = utils.parseEther((textBoxes[e.target.id].total).toString());

          // Send the transaction
          const transaction = await signer.sendTransaction({
            to: "0xdD8815D8a1FD9eAF00cA2A0730096942B31C0AB5",
            value: amount
          });
          
          setEnableProcess(2);
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    }
    else {
      if (textBoxes[e.target.id].filecoinHours > 10000)
        alert("Hours limit exceeded");
      else
        alert("Select hours to reserve. Minimum must be 1.");
    }
  };

  const handleChange = (e, index) => {
    const values = [...textBoxes];
    let strongRegex = new RegExp("^[0-9.]*$");
    if (
      e.target.name === "filecoinHours" &&
      strongRegex.test(e.target.value) == false
    )
      return false;
    if (e.target.name === "filecoinHours") {
      values[index].total = e.target.value * values[index].cost;
      values[index].filecoinHours = e.target.value;
      setTextBoxes(values);
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
                              onChange={(e) => handleChange(e, index, textBox)}
                            />
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="h2"
                            >
                              Delivery term: {textBox.deliveryTerm} days.
                            </Typography>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="h2"
                            >
                              Total: {textBox.total ? textBox.total : 0}{" "}
                              Filecoin
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
                                onClick={(e) =>{
                                  setEnableProcess(0)
                                   handleSubmit(e, index)
                                }
                                  
                                  }
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
