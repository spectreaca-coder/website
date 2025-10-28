import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import SpecterIntro from './components/SpecterIntro/SpecterIntro';
import Instructors from './components/Instructors/Instructors';
import Location from './components/Location/Location';
import Contact from './components/Contact/Contact';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/specter-intro" element={<SpecterIntro />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/location" element={<Location />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
