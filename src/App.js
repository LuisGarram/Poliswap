import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";

import Protected from "./components/Protected";
import { AuthContextProvider } from "./context/AuthContext";
import Account from "./pages/Account";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import firebase from "firebase/compat/app";
import HUser from "./pages/HUser";
import PurchasedServices from "./pages/PurchasedServices";

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
});

function App() {
  return (
    <div>
      <AuthContextProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/Account"
            element={
              <Protected>
                <Account />
              </Protected>
            }
          />
          <Route path="/Huser" element={<HUser />} />
          <Route path="/PurchasedServices" element={<PurchasedServices />} />
        </Routes>
      </AuthContextProvider>
    </div>
  );
}
export default App;
