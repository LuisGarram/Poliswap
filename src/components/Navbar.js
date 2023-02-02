import React, { useState } from "react";

import { UserAuth } from "../context/AuthContext";
import AppBar from "@mui/material/AppBar";

import Button from "@mui/material/Button";

import CssBaseline from "@mui/material/CssBaseline";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import GlobalStyles from "@mui/material/GlobalStyles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { ethers } from "ethers";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Polis from "./Poli.png";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const { user, logOut } = UserAuth();
  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {}
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#2020E6",
      },
      secondary: {
        main: "#f44336",
      },
    },
  });

  let navigate = useNavigate();

  const redirect = () => {
    let path = `Signin`;
    navigate(path);
  };

  let User = useNavigate();
  const HomeUser = () => {
    let path = `HUser`;
    User(path);
  };

  let Acc = useNavigate();

  const PromoteYourServices = () => {
    let path = `PromoteYourServices`;
    Acc(path);
  };

  const myReservations = () => {
    let path = `myReservations`;
    Acc(path);
    AccountClose();
  };
  const clientReservations = () => {
    let path = `clientReservations`;
    Acc(path);
    AccountClose();
  };
  const AccountClose = () => {
    setAnchorEl(null);
  };

  const AccountClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <GlobalStyles
          styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
        />
        <CssBaseline />

        <AppBar
          position="static"
          color="default"
          elevation={0}
          sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        >
          <Toolbar sx={{ flexWrap: "wrap" }}>
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              <img className="image" src={Polis} style={{ width: 150 }} />
            </Typography>
            <nav>
              <Button
                variant="outlined"
                onClick={HomeUser}
                sx={{ my: 1, mx: 1.5 }}
              >
                Buy
              </Button>

              <Button variant="outlined" onClick={PromoteYourServices}>
                Promote your services
              </Button>
              <Button
                id="basic-button"
                variant="outlined"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={AccountClick}
              >
                Account
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={AccountClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={myReservations}>My reservations</MenuItem>
                <MenuItem onClick={clientReservations}>Clients</MenuItem>
              </Menu>

              <Button>
                {user?.displayName ? (
                  <Button variant="outlined" onClick={handleSignOut}>
                    Logout
                  </Button>
                ) : (
                  <React.Fragment>
                    <Button variant="outlined" onClick={redirect}>
                      Sign In
                    </Button>
                  </React.Fragment>
                )}
              </Button>
            </nav>
            <Button variant="outlined" sx={{ my: 1, mx: 1.5 }}></Button>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default Navbar;
