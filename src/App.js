import React from 'react';
import './App.css';
import Drought from './Components/Drought';
import { BrowserRouter, Switch, Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
            <Route path="/" component={Drought} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
