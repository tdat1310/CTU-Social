import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, position } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./Redux/store.js";
import { SocketProvider } from "./provider/socketContext.jsx";
//mport { SocketProvider } from "./provider/socketContext.js";
SocketProvider
const theme = extendTheme({
  
  colors: {
    myColor: {
      100: "#4b7ce7 ",
      200: "#2d5be4",
    },
  },
  fonts: {
    heading: "'Maven Pro', sans-serif",
    body: "'Maven Pro', sans-serif",
  },
  styles: {
    global: {
      "::selection": {
        background: "teal",
        color: "white",
      },
      "::-webkit-scrollbar": {
        width: "5px",
      },
      "::-webkit-scrollbar-track": {
        background: "#f1f1f1",
      },
      "::-webkit-scrollbar-thumb": {
        background: "#4771a7",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#555",
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider theme={theme}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SocketProvider>
      </PersistGate>
    </Provider>
  </ChakraProvider>
);
