import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Button, CardActionArea, CardActions } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import InputAdornment from "@mui/material/InputAdornment";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "../firebase1";
import { v4 } from "uuid";

const Account = () => {
  const { logOut, user } = UserAuth();

  const [name, setName] = useState("");

  const [cost, setCost] = useState("");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  const [listData, setListData] = useState([]);
  const [fieldSubCategory, setFieldSubCategory] = React.useState(0);

  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    if (imageUpload == null) {
      setImageUpload([]);
    } else {
      const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        console.log(snapshot.metadata.fullPath);
        getDownloadURL(snapshot.ref).then((url) => {
          const data = {
            name: name,
            category: fieldSubCategory,
            cost: cost,
            details: details,
            email: email,
            date: date,
            image: url,
          };
          console.log(data);
          const db = firebase.firestore();
          db.collection("register")
            .add(data)
            .then(function (docRef) {
              console.log("Document written with ID: ", docRef.id);
              setName("");
              setFieldSubCategory("");
              setCost("");
              setDetails("");
              setEmail("");
              setImage("");
              setDate("");
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
            });
        });
      });
    }
    alert("Done ,You will shortly receive your risk profile.");
    e.preventDefault();
  };

  const datax = async () => {
    const dataFirestore = await firebase
      .firestore()
      .collection("category")
      .get();
    dataFirestore.forEach((doc) => {
      setListData(doc.data().category);
    });
  };
  useEffect(() => {
    datax();
  }, []);
  const handleChangeOptionSubCategory = (event) => {
    setFieldSubCategory(event.target.value);
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Promote your services
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            id="outlined-name"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <br></br>
          <br></br>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small">Category</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              label="Category"
              value={fieldSubCategory}
              onChange={handleChangeOptionSubCategory}
            >
              {listData.map((optionSubCategory, i) => (
                <MenuItem key={i} value={i}>
                  {optionSubCategory.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br></br>
          <br></br>
          <OutlinedInput
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            id="outlined-adornment-weight"
            endAdornment={
              <InputAdornment position="end">
                {" "}
                {process.env.REACT_APP_TLD}{" "}
              </InputAdornment>
            }
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              "aria-label": "weight",
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            name="Service details"
            label="Service details"
            value={details}
            type="text"
            id="Service details"
            onChange={(e) => setDetails(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email "
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button variant="contained" component="label">
            Upload
            <input
              onChange={(event) => {
                setImageUpload(event.target.files[0]);
              }}
              hidden
              multiple
              type="file"
            />
          </Button>

          <TextField
            margin="normal"
            fullWidth
            id="date"
            label="Delivery term"
            type="number"
            onChange={(e) => setDate(e.target.value)}
            value={date}
            //defaultValue=getdate
            InputLabelProps={{
              shrink: true,
            }}
            autoComplete="current-password"
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
            color="success"
          >
            Register
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item></Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Account;
