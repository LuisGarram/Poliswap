import React, { useEffect, useState,useContext } from "react";

import { UserAuth } from "../context/AuthContext";
import AppBar from "@mui/material/AppBar";

import Button from "@mui/material/Button";
import Link from '@mui/material/Link';
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
import {
  useAccount,
  useConnect,
  useDisconnect,
  usePrepareContractWrite,
  useNetwork, useSwitchNetwork
} from 'wagmi'
const Navbar = (props) => {
 const { address, connector, isConnected } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } =useConnect()
  const { disconnect } = useDisconnect()
  const { chain } = useNetwork()

  const [check, setCheck] = useState(false);
  // Create a stateful variable to store the network next to all the others
  const [network, setNetwork] = useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  
  const { user, logOut } = UserAuth();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
    const [defaultAccount, setDefaultAccount] = useState(null);
  useEffect(() => {

  }, [defaultAccount]);
  const handleClose = () => {
    setAnchorEl(null);
  };


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

            {chain && props.chains.find(networkValue => chain.id === networkValue.id) && props.isConnected?
            
            <React.Fragment>      
                                      <Link
              variant="button"
              color="secondary" 
              onClick={() => {
                if (chain) {
                  if (props.chains.find(networkValue => chain.id === networkValue.id)) {
                    let explorer = props.chains.find(networkValue => chain.id === networkValue.id).blockExplorers.default.url.replace("type", "address").replace("valuex", address);
                    window.open(explorer,'_blank');
                  }
                }
				
                  
              }}
              sx={{ my: 1, mx: 1.5 }}
            >
              {address}
            </Link>
              <Link
              variant="button"
              color="secondary"

              sx={{ my: 1, mx: 1.5 }}
            >
              {
                  props.chains.some(networkValue => {
                    props.chains.find(chainx => chain.id === networkValue.id)
                  }
                    )
                  

              }
            {chain ? props.chains.find(networkValue => chain.id === networkValue.id) ? "Connected to:" + chain.network : "Network not supported" : "Chain is undefined"}       
            </Link>
              <Button
                variant="outlined"
                onClick={HomeUser}
                sx={{ my: 1, mx: 1.5 }}
              >
                Buy
              </Button>
                         
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
          
            <Button variant="outlined" onClick={PromoteYourServices} sx={{ my: 1, mx: 1.5 }}>
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
              <Button onClick={disconnect} variant="outlined" sx={{ my: 1, mx: 1.5 }}>
              Disconnect
            </Button>
              </React.Fragment> : 

              <React.Fragment>        
              <React.Fragment>
      {connectors.map((connector) => (
             <Button
              disabled={!connector.ready}
              key={connector.id}
              variant="outlined"
              onClick={() => connect({ connector })}
            >
              Connect: {connector.name}
              {!connector.ready && ' (unsupported)'}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                ' (connecting)'}
            </Button>
          ))}
            </React.Fragment>
              </React.Fragment>}
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default Navbar;
