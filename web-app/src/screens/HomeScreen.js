import React,{ useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// HomeScreen.js
import AnaNavbar from '../components/AnaNavbar';
import Lottie from 'react-lottie';
import animationData from '../resim/smartCity.json'; // JSON animasyon dosyanızın yolu

export default function HomeScreen() {
  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div >
   
    <AnaNavbar/>
        <Lottie  options={defaultOptions} height={600} width={900}  />

    </div>
  );
}
