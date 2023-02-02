import React, { useEffect } from "react";
import { GoogleButton } from "react-google-button";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import { profile } from "../firebase";

const Signin = () => {
  const { googleSignIn, user } = UserAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log("Error:  ", error);
    }
  };

  useEffect(() => {
    if (user != null) {
      navigate("/PromoteYourServices");
    }
  }, [user]);

  return (
    <React.Fragment>
      {/* Hero unit */}
      <Container
        disableGutters
        maxWidth="sm"
        component="main"
        sx={{ pt: 8, pb: 6 }}
      >
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          PoliSwap
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          component="p"
        >
          A platform to exchanges services using Filecoin as payment
        </Typography>

        <CardHeader
          titleTypographyProps={{ align: "center" }}
          subheaderTypographyProps={{
            align: "center",
          }}
        />

        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              mb: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              <div>
                <div>
                  <GoogleButton onClick={handleGoogleSignIn} />
                </div>
              </div>
            </Typography>
          </Box>
        </CardContent>
      </Container>
      {/* End hero unit */}
    </React.Fragment>
  );
};

export default Signin;
