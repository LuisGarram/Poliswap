import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { publicProvider } from 'wagmi/providers/public'
import { Provider,createClient,configureChains,useAccount, useConnect, useDisconnect } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { Chain } from 'wagmi'
import { useNetwork } from 'wagmi'
import { WagmiConfig } from 'wagmi'
import {wallabyTestnet,hyperspaceTestnet} from './Chain'
const { chains, provider } = configureChains(
  [ hyperspaceTestnet, wallabyTestnet],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === hyperspaceTestnet.id) return { http: chain.rpcUrls.default  };
        if (chain.id === wallabyTestnet.id) return { http: chain.rpcUrls.default };
        return null;
      },
    }),
  ]
);
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
  ],
  provider:provider
})

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <WagmiConfig client={client}>
    <App client={client} chains={chains}/>
    </WagmiConfig>
  </BrowserRouter>
);
