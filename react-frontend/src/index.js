import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';

import './index.css';
import 'pax-imperia-js/css/style.css';
import 'pax-imperia-js/css/systems.css';
import Context from './app/Context';
import FirebaseConnector from './app/FirebaseConnector';
import { initGameData } from './app/gameDataInitializer';
import AzureAuth from './app/AzureAuth';
import { UserContextProvider } from './app/UserContextProvider';
const container = document.getElementById('root');
const root = createRoot(container);

const gameData = initGameData();
const azureAuth = new AzureAuth();

root.render(
  <Provider store={store}>
    <UserContextProvider azureAuth={azureAuth}>
      <Context gameData={gameData}>
        <FirebaseConnector azureAuth={azureAuth}>
          {/* <React.StrictMode> */}
          <Router basename={process.env.REACT_APP_PUBLIC_SUFIX}>
            <App />
          </Router>
          {/* </React.StrictMode> */}
        </FirebaseConnector>
      </Context>
    </UserContextProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
