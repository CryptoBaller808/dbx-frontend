import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import { PersistGate } from "redux-persist/integration/react";
import { SocketProvider } from './context/socket';

import App from "./App";
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SocketProvider>
        <App />
      </SocketProvider>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
