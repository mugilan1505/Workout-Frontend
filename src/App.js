import React from 'react';
import { Provider } from 'react-redux';
import store from "./redux/store";

import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Provider store={store}>
      <Layout />
    </Provider>
  );
}

export default App;
