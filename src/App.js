import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";

import Protected from "./components/Protected";
import { AuthContextProvider } from "./context/AuthContext";
import PromoteYourServices from "./pages/PromoteYourServices";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import firebase from "firebase/compat/app";
import HUser from "./pages/HUser";
import Freelancer from "./pages/Freelancer";
import BuyUser from "./pages/BuyUser";
import UserReserves from "./pages/UserReserves";
import {
  useAccount,
  useConnect,
  useDisconnect,
  usePrepareContractWrite,
  useNetwork, useSwitchNetwork
} from 'wagmi'

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
});

function App(props) {
  const { address, connector, isConnected } = useAccount()
  return (
    <div>
      <AuthContextProvider>
        <Navbar isConnected={isConnected} chains={props.chains}/>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/PromoteYourServices"
            element={
              <Protected>
                <PromoteYourServices />
              </Protected>
            }
          />
          <Route path="/Huser" element={<HUser />} />
          <Route path="/PurchasedServices" element={<BuyUser />} />
          <Route path="/clientReservations" element={<Freelancer />} />
          <Route path="/myReservations" element={<UserReserves />} />
        </Routes>
      </AuthContextProvider>
    </div>
  );
}
export default App;
