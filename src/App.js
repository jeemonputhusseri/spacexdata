import React from 'react';
import './App.css';
import AppRouter from './Components/AppRouter'
import {withRouter} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default withRouter(App);
