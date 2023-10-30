import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // Utiliza Routes en lugar de Switch
import App from './App';
import Home from './Home';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';


ReactDOM.render(
  <BrowserRouter>
    <Routes> {/* Utiliza Routes en lugar de Switch */}
      <Route path="/" element={<Home />} />
      <Route path="/app" element={<App />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);


