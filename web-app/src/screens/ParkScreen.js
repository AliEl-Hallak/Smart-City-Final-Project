import React, { useEffect, useState } from 'react';
import { database } from '../FirebaseConfig';
import { ref, onValue } from 'firebase/database';
import CustomNavbar from '../components/CustomNavbar';
import Lottie from 'react-lottie';
import animationData from '../resim/car.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCarSide} from '@fortawesome/free-solid-svg-icons';

const numToString = (num) => {
  const numbersInTurkish = [
    'Sıfır',
    'Bir',
    'İki',
    'Üç',
    'Dört',
    'Beş',
    'Altı',
  
    // Daha fazla sayı ekleyebilirsiniz.
  ];

  return numbersInTurkish[num] || 'Belirtilen sayı desteklenmiyor';
};

const ParkScreen = () => {
  const [parkingSlots, setParkingSlots] = useState({});
  const [emptySlots, setEmptySlots] = useState(0);

  useEffect(() => {
    const numRef = ref(database, 'parkingnum');
    onValue(numRef, (snapshot) => {
      setEmptySlots(snapshot.val());
    });

    const parkingRef = ref(database, 'parking');
    onValue(parkingRef, (snapshot) => {
      setParkingSlots(snapshot.val());
    });
  }, []);

  return (
    <div>
      <CustomNavbar/>
      <div className="container">
        <div className="empty-slots-container">
          <p className="title">
        {numToString(emptySlots)} tane park yeri müsaittir . 
        <FontAwesomeIcon icon={faCarSide}  />

          </p>
        </div>
        <div className="parking-lot">
          {Object.keys(parkingSlots).map((key) => {
            const displayKey = key.replace('slot', 'P');

            const isOccupied = parkingSlots[key];
            const lottieOptions = {
              loop: false,
              autoplay: isOccupied, // Dolu ise animasyonu oynat
              animationData: animationData,
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
              }
            };

            return (
              <div key={key} className="slot-container">
                <Lottie options={lottieOptions} height={150} width={200} isStopped={!isOccupied} isPaused={!isOccupied}/>
                <p className={`slot ${isOccupied ? 'slot-occupied' : 'slot-empty'}`}>
                  {displayKey.toUpperCase()}: {parkingSlots[key] ? 'Dolu' : 'Boş'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ParkScreen;
