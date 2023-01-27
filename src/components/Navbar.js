import React, { useState } from "react";

import { UserAuth } from "../context/AuthContext";
import AppBar from "@mui/material/AppBar";

import Button from "@mui/material/Button";

import CssBaseline from "@mui/material/CssBaseline";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import GlobalStyles from "@mui/material/GlobalStyles";

import { ethers } from "ethers";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Polis from "./Poli.png";

const Navbar = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const { user, logOut } = UserAuth();

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
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
  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log("MetaMask Here!");

      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText("Wallet Connected");
          getAccountBalance(result[0]);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getAccountBalance(newAccount.toString());
  };

  const getAccountBalance = (account) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [account, "latest"] })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  };

  // listen for account changes
  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

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
  
  const account = () => {
    let path = `account`;
    Acc(path);
  };
  const PurchasedServices = () => {
    let path = `PurchasedServices`;
    Acc(path);
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

              <Button variant="outlined" onClick={account}>
                Promote your services
              </Button>
              <Button variant="outlined" onClick={PurchasedServices}>
                Account
              </Button>
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
            <Button
              variant="outlined"
              sx={{ my: 1, mx: 1.5 }}
              onClick={connectWalletHandler}
            >
              {connButtonText}
            </Button>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default Navbar;
