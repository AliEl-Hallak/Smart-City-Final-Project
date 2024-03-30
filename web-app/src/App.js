import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationScreen from './screens/RegistrationScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ParkScreen from './screens/ParkScreen';
import EvScreen from './screens/EvScreen';
import CopScreen from './screens/copScreen';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/cop" element={<CopScreen />} />
        <Route path="/park" element={<ParkScreen />} />
        <Route path="/ev" element={<EvScreen />} />
        <Route path="/register" element={<RegistrationScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
