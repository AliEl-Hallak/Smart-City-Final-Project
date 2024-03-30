import React, { useState, useEffect } from 'react';
import { database } from '../FirebaseConfig';
import { ref, onValue, set } from 'firebase/database';
import ReactSlider from 'react-slider';
import '../index.css';
import CustomNavbar from '../components/CustomNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSnowflake, faLightbulb, faFan, faShieldAlt, faMoon, faSun, faEye, faFire, faHeartbeat ,faThermometerHalf, faTint, faMusic, faStop, faPlay, faForward, faBackward } from '@fortawesome/free-solid-svg-icons';
import { CircularProgressbar } from 'react-circular-progressbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-circular-progressbar/dist/styles.css';

const EvScreen = () => {
  const [humidity, setHumidity] = useState('');
  const [temperature, setTemperature] = useState('');
  const [deprem, setDeprem] = useState(false);
  const [gaz, setgaz] = useState(false);
  const [light, setLight] = useState(false);
  const [isLedOn, setIsLedOn] = useState(false);
  const [klima, setKlima] = useState(false);
  const [isOtoKlimaOn, setIsOtoKlimaOn] = useState(false);
  const [isAlarmOn, setIsAlarmOn] = useState(false);
  const [hirsizState, sethirsizState] = useState(false);
  const [angle, setAngle] = useState(0);
  const [angle2, setAngle2] = useState(0);
  const [ses, setSes] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false); // Oynatma durumunu kontrol eden state

  const notify = () => toast("Giriş başarısız!");

    // DFPlayer durumunu Firebase'e gönderme


    // Play ve Stop işlevlerini yönetme
    const togglePlayStop = () => {
      const newStatus = !isPlaying ? 'play' : 'stop';
      setIsPlaying(!isPlaying); // Oynatma durumunu güncelle
      set(ref(database, 'dfPlayerState'), newStatus);

    }

    const sendDFPlayerStatus = (status) => {

      // İlk olarak gelen status değerini Firebase'e gönder
      set(ref(database, 'dfPlayerState'), status);
    
      // Eğer status "next" veya "prev" ise, bir sonraki adımda "other" olarak güncelle
        setTimeout(() => {
          set(ref(database, 'dfPlayerState'), "play");
        }, 2000); // Kısa bir gecikme ekleyerek Firebase'deki değişikliği "other" ile güncelle
      
    };

  const getColorForTemperature = (temp) => {
    if (temp <= 14) return '#ff9933'; // Mavi
    else if (temp <= 20) return '#ff8800'; // Yeşil
    else if (temp <= 25) return '#ff3333'; // Sarı
    else return '#ff0000'; // Kırmızı
  };
  const getColorForHumidity = (temp) => {
    if (temp <= 25) return '#33ffff'; // Mavi
    else if (temp <= 50) return '#00ffff'; // Yeşil
    else if (temp <= 75) return '#33ff99'; // Sarı
    else return '#00ff80'; // Kırmızı
  };

  const updateSes = (newSes) => {
    setSes(newSes);
    // Firebase'de yeni açı değerini güncelle
    set(ref(database, 'SesDegeri'), parseInt(newSes, 10));
    setSes(newSes);
    

  };
  const updateAngle = (newAngle) => {
    setAngle(newAngle);
    // Firebase'de yeni açı değerini güncelle
    set(ref(database, 'AnaKapiState'), parseInt(newAngle, 10));
    setAngle(newAngle);

  };

  const updateAngle2 = (newAngle2) => {
    setAngle2(newAngle2);
    // Firebase'de yeni açı değerini güncelle
    set(ref(database, 'parkKapisiState'), parseInt(newAngle2, 10));
    setAngle2(newAngle2);

  };
  const toggleLed = () => {
    const newLedState = !isLedOn;
    set(ref(database, '/ledState'), newLedState ? 1 : 0);
    setIsLedOn(newLedState);
  };

  const toggleKlima = () => {
    const newKlimaState = !klima;
    set(ref(database, '/klimaState'), newKlimaState ? 1 : 0);
    setKlima(newKlimaState);
  };

  const toggleOtoKlima = () => {
    const newOtoKlimaState = !isOtoKlimaOn;
    set(ref(database, '/OtoKlimaState'), newOtoKlimaState ? 1 : 0);
    setIsOtoKlimaOn(newOtoKlimaState);

  };

  const toggleAlarm = () => {
    const newAlarmState = !isAlarmOn;
    set(ref(database, '/hirsizAlarm'), newAlarmState ? 1 : 0);
    setIsAlarmOn(newAlarmState);

  };

  useEffect(() => {
    const humidityRef = ref(database, 'humidity');
    const temperatureRef = ref(database, 'temperature');
    const lightRef = ref(database, 'isikDegeri');
    const depremRef = ref(database, 'depremState');
    const gazRef = ref(database, 'GazState');
    const ledRef = ref(database, '/ledState');
    const klimaRef = ref(database, '/klimaState')
    const otoKlimaRef = ref(database, '/OtoKlimaState');
    const alarmRef = ref(database, '/hirsizAlarm');
    const hirsizStateRef = ref(database, '/hirsizState');
    const AngleRef = ref(database, '/AnaKapiState');
    const AngleRef2 = ref(database, '/parkKapisiState');
    const dfplayerRef = ref(database, '/dfPlayerState');
    const dfplayersesRef = ref(database, '/SesDegeri');

    onValue(dfplayerRef, (snapshot) => {
      setIsPlaying(snapshot.val());
      const status = snapshot.val();
      setIsPlaying(status === 'play'); // Duruma göre isPlaying'i güncelle
    });

    onValue(AngleRef2, (snapshot) => {
      setAngle2(snapshot.val());
    });

    onValue(AngleRef, (snapshot) => {
      setAngle(snapshot.val());
    });
    onValue(dfplayersesRef, (snapshot) => {
      setSes(snapshot.val());
    });
    onValue(humidityRef, (snapshot) => {
      setHumidity(snapshot.val());
    });

    onValue(temperatureRef, (snapshot) => {
      setTemperature(snapshot.val());
    });

    onValue(lightRef, (snapshot) => {
      setLight(snapshot.val());
    });

    onValue(depremRef, (snapshot) => {
      const isDeprem = snapshot.val();
      setDeprem(isDeprem);

      if (isDeprem) {
        toast("Deprem tespit edildi! Güvende olun.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
      }
    });
    onValue(gazRef, (snapshot) => {
      const isGaz = snapshot.val();
      setgaz(isGaz);

      if (isGaz) {
        toast("Gaz tespit edildi! Güvende olun.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
      }
    });

    onValue(ledRef, (snapshot) => {
      const data = snapshot.val();
      setIsLedOn(data === 1);
    });
    onValue(klimaRef, (snapshot) => {
      const data = snapshot.val();
      setKlima(data === 1);
    });




    onValue(otoKlimaRef, (snapshot) => {
      const data = snapshot.val();
      setIsOtoKlimaOn(data === 1);
    });

    onValue(alarmRef, (snapshot) => {
      const data = snapshot.val();
      setIsAlarmOn(data === 1);
    });

    onValue(hirsizStateRef, (snapshot) => {
     const isHirsiz = snapshot.val();
      sethirsizState(isHirsiz);

      if (isHirsiz) {
        toast("Hirsiz tespit edildi! Güvende olun.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
      }
    });
    // Diğer sensör/cihaz ref'leri ve dinleyicileri burada eklenebilir.
  }, []);

  return (
<div>
<ToastContainer />

<CustomNavbar/>

<div className="containery">
<div className="headery">
        <button className="buttony" onClick={() => toggleKlima()}>
          <FontAwesomeIcon icon={faSnowflake} size="3x" color={klima ? "#007BFF" : "#808080"} />
        </button>
        <button className="buttony" onClick={() => toggleLed()}>
          <FontAwesomeIcon icon={faLightbulb} size="3x" color={isLedOn ? "#FFD700" : "#808080"} />
        </button>
        <button className="buttonbildirim">
          <FontAwesomeIcon icon={light ? faMoon : faSun} size="3x" color={light ? "#808080" : "orange"} />
        </button>
      
        <button className="buttony" onClick={() => toggleAlarm()}>
          <FontAwesomeIcon icon={faShieldAlt} size="3x" color={isAlarmOn ? "#FFD700" : "#808080"} />
        </button>
        
        <button className="buttony" onClick={() => toggleOtoKlima()}>
          <FontAwesomeIcon icon={faFan} size="3x" color={isOtoKlimaOn ? "#007BFF" : "#808080"} />
        </button>

      </div>
      <div className="gauges">
      <div  className="gauge" style={{ width: '200px', height: '200px' }} >
      <CircularProgressbar  value={humidity} text={`${humidity}%`} />
    </div>
    
    {/* İkonlar burada yer alacak */}
    <div className="orta">

<div className="icons">

<button className="buttonbildirim" >
          <FontAwesomeIcon icon={faHeartbeat} size="3x" color={deprem ? "orange" : "#808080"} />
        </button>
  
<button className="buttonbildirim" >
          <FontAwesomeIcon icon={faEye} size="3x" color={hirsizState ? "orange" : "#808080"} />
        </button>
        
<button className="buttonbildirim" >
          <FontAwesomeIcon icon={faFire} size="3x" color={gaz ? "orange" : "#808080"} />
        </button>


</div>

<div className='SliderKapicontainer'>
<div className='SliderKapi'>
  
<input

        type="range"
        min="0"
        max="90"
        value={angle2}
        onChange={(e) => updateAngle2(e.target.value)}
        className="slider"
      />

</div>
<div className='SliderKapi'>
<input
        type="range"
        min="0"
        max="90"
        value={angle}
        onChange={(e) => updateAngle(e.target.value)}
        className="slider"
      />
    </div>
</div>
</div>

    
    
    <div className="gauge " style={{ width: '200px', height: '200px' }}>
      <CircularProgressbar value={temperature} text={`${temperature}°C`} />
    </div>

      </div>
      
      {/* Diğer UI elemanları ve butonlar */}
      <div className="footery">
        {/* Müzik kontrol butonları */}
        <div className="dfpalyer">
        <button className="buttondf"  onClick={() => sendDFPlayerStatus('prev')}>
          <FontAwesomeIcon icon={faBackward} size="2x" color="#4a90e2" />
        </button>
        <button className="buttondf"  onClick={() => togglePlayStop()}>
          <FontAwesomeIcon icon={isPlaying ? faStop : faPlay} size="2x" color="#4a90e2" />
        </button>
        <button className="buttondf"  onClick={() => sendDFPlayerStatus('next')}>
          <FontAwesomeIcon icon={faForward} size="2x" color="#4a90e2" />
        </button>
        </div>

        <div className="slider-container">
      <input
        type="range"
        min="0"
        max="30"
        value={ses}
        onChange={(e) => updateSes(e.target.value)}
        className="slider"
      />
    </div>

      </div>
     
    </div>
  
  </div>
  );
};
const styles = {
    buttony: {
      padding: '10px 20px',
      fontSize: '16px',
      color: 'white',
      backgroundColor: 'blue',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      margin: '10px',
    },

    containery: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px',
      }

      
  };
  
export default EvScreen;
