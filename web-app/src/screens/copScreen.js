import React, { useState, useRef,useEffect } from 'react';
import '../index.css';
import CustomNavbar from '../components/CustomNavbar';
import Lottie from 'lottie-react';
import animationData from '../resim/cop.json';
import animationData2 from '../resim/copSiveysi.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { database } from '../FirebaseConfig';
import { ref, onValue } from 'firebase/database';
// HomeScreen.js
export default function CopScreen() {
  
  const [trashLevel, setTrashLevel] = useState('');
  const [trashStatus, setTrashStatus] = useState('');
  const [animationProgress, setAnimationProgress] = useState(0.1); // Animasyon ilerlemesini tutacak state
  const [animationProgresslevel, setAnimationProgresslevel] = useState(0); // Animasyon ilerlemesini tutacak state
  const lottieRef = useRef(null);
  const lottieRef2 = useRef(null);
  useEffect(() => {
    const levelRef = ref(database, 'trashLevel');
    const statusRef = ref(database, 'trashStatus');

    onValue(levelRef, (snapshot) => {
      const level = snapshot.val();
      setTrashLevel(level);
      updateAnimationProgresslevel(level); // Çöp seviyesine göre animasyon ilerlemesini güncelle

    });

    onValue(statusRef, (snapshot) => {
      const status = snapshot.val();
      setTrashStatus(status);
      updateAnimation(status); // Çöp durumuna göre animasyonu güncelle

    });
  }, []);
  const updateAnimationProgresslevel = (level) => {
    // Çöp seviyesini 0.1 aralıklarla kategorilere ayır
    let segmentStart, segmentEnd;
    switch(level) {
      case 0:
        segmentStart = animationData.op * 0.83;
      segmentEnd = animationData.op * 0.84;
        break;
      case 1:
        segmentStart = animationData.op * 0.80;
      segmentEnd = animationData.op * 0.83;
        break;
      case 2:
        segmentStart = animationData.op * 0.75;
        segmentEnd = animationData.op * 0.80;
        break;
        case 3:
          segmentStart = animationData.op * 0.75;
          segmentEnd = animationData.op * 0.80;
          break;
      case 4:
        segmentStart = animationData.op * 0.70;
        segmentEnd = animationData.op * 0.75;
        break;
      case 5:
        segmentStart = animationData.op * 0.65;
        segmentEnd = animationData.op * 0.70;
        break;
        case 6:
          segmentStart = animationData.op * 0.55;
          segmentEnd = animationData.op * 0.65;
        break;
      case 7:
        segmentStart = animationData.op * 0.45;
        segmentEnd = animationData.op * 0.55;
        break;
      case 8:
        segmentStart = animationData.op * 0.35;
        segmentEnd = animationData.op * 0.45;
        break;
        case 9:
          segmentStart = animationData.op * 0.25;
          segmentEnd = animationData.op * 0.35;
        break;
      case 10:
        segmentStart = animationData.op * 0.20;
        segmentEnd = animationData.op * 0.25;
        break;
        
      case 11:
    
        segmentStart = animationData.op * 0.15;
        segmentEnd = animationData.op * 0.20;
        break;
      case 12:
  

      segmentStart = animationData.op * 0.10;
      segmentEnd = animationData.op * 0.15;
        break;
      case 13:
  
        segmentStart = animationData.op * 0.01;
        segmentEnd = animationData.op * 0.02;
        break;
        case 14:
          segmentStart = animationData.op * 0.01;
          segmentEnd = animationData.op * 0.02;
          break;
      default:
        segmentStart = animationData.op * 0.83;
      segmentEnd = animationData.op * 0.84;   }

    if (lottieRef2.current) {
      // `true` parametresi segmentin hemen başlamasını sağlar
      lottieRef2.current.playSegments([Math.floor(segmentStart), Math.floor(segmentEnd)], true);
    }
  };



  const updateAnimation = (status) => {
    let segmentStart, segmentEnd;

    if (status === "Bos") {
      segmentStart = animationData.op * 0.04;
      segmentEnd = animationData.op * 0.19;
    } else if (status === "Orta") {
      segmentStart = animationData.op * 0.2;
      segmentEnd = animationData.op * 0.5;
    } else if (status === "Dolu") {
      segmentStart = animationData.op * 0.5;
      segmentEnd = animationData.op * 0.9;
      toast("copunuz Dolu!!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    if (lottieRef.current) {
      // `true` parametresi segmentin hemen başlamasını sağlar
      lottieRef.current.playSegments([Math.floor(segmentStart), Math.floor(segmentEnd)], true);
    }
  };
  return (
    <div>
      <ToastContainer />

<CustomNavbar/>
    <div className="app">
      <div className="content">
        <div className='lottiCop'>
             <Lottie lottieRef={lottieRef} animationData={animationData}   style={{ width: 500, height: 500 }} // Animasyonun genişliği ve yüksekliği
 />
        </div>    
        <div className='lottiCop'>
   
          <Lottie lottieRef={lottieRef2} animationData={animationData2}   style={{ width: 500, height: 500 }} // Animasyonun genişliği ve yüksekliği
 />
       </div>

      </div>
    </div>
    </div>

  );
}

