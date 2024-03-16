// StatusScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { database } from '../FirebasseConfig';
import { ref, onValue, set } from 'firebase/database';
import Slider from '@react-native-community/slider';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'; // İkon kütüphanesini içe aktar
import Icon from 'react-native-vector-icons/FontAwesome'; // FontAwesome setini kullanıyoruz
import * as Notifications from 'expo-notifications';

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
        
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'deprem',
            body: 'deprem',
          },
          trigger: { seconds: 1 },
        });
      }
    });

    onValue(gazRef, (snapshot) => {
      const isGaz = snapshot.val();
      setgaz(isGaz);

      if (isGaz) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'gaz',
            body: 'gaz',
          },
          trigger: { seconds: 1 },
        });
      }      
    });

    onValue(hirsizStateRef, (snapshot) => {
      const isHirsiz = snapshot.val();
      sethirsizState(isHirsiz);

      if (isHirsiz) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'hirsiz',
            body: 'hirsiz',
          },
          trigger: { seconds: 1 },
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

  
    // Diğer sensör/cihaz ref'leri ve dinleyicileri burada eklenebilir.
  }, []);

  return (
    <View style={styles.container2}>
      <View style={styles.header}>

        <TouchableOpacity style={styles.button} onPress={toggleKlima}>
          {klima ? (
            <Icon name="snowflake-o" size={40} color="#007BFF" /> // Klima kapalıyken kar tanesi ikonu

          ) : (
            <Icon name="snowflake-o" size={40} color="#808080" /> // Klima kapalıyken kar tanesi ikonu

          )}
          <Text style={styles.buttonText}></Text>

        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleLed}>
          <Icon2
            name={isLedOn ? "lightbulb-on" : "lightbulb-on"} // LED durumuna göre ikonu değiştir
            size={40} // İkon boyutu
            color={isLedOn ? "#FFD700" : "#808080"} // LED durumuna göre ikon rengini değiştir
          />
          <Text style={styles.buttonText}></Text>

        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleAlarm}>
          <Icon2
            name={isAlarmOn ? "security" : "security"} // LED durumuna göre ikonu değiştir
            size={40} // İkon FFD700
            color={isAlarmOn ? "#FFD700" : "#808080"} // LED durumuna göre ikon rengini değiştir
          />
          <Text style={styles.buttonText}></Text>

        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleOtoKlima}>
          <Icon2
            name={isOtoKlimaOn ? "fan-auto" : "fan-auto"} // LED durumuna göre ikonu değiştir
            size={40} // İkon boyutu
            color={isOtoKlimaOn ? "#007BFF" : "#808080"} // LED durumuna göre ikon rengini değiştir
          />
          <Text style={styles.buttonText}></Text>

        </TouchableOpacity>

    
      </View>
      <TouchableOpacity style={styles.buttonbottom} >
        {light ? (
          <Icon name="moon-o" size={30} color="#808080" /> // Klima kapalıyken kar tanesi ikonu

        ) : (
          <Icon name="sun-o" size={30} color="orange" /> // Klima açıkken güneş ikonu

        )}
        <Text style={styles.buttonText}></Text>

      </TouchableOpacity>

      <View style={styles.container}>



        <View style={styles.progressContainer}>

          <View style={styles.circularProgressContainer}>

            <Icon2 name="thermometer" size={35} color={'#4a90e2'} style={styles.icon} />

         
            <AnimatedCircularProgress
              size={140}
              width={10}
              fill={humidity}
              tintColor={'#4a90e2'}
              backgroundColor="#e6e6e6"
            >
              {
                (fill) => (
                  <Text style={styles.progressText}>
                    {`${Math.round(humidity)}%`}
                  </Text>
                )
              }
            </AnimatedCircularProgress>
          </View>

          <View style={styles.circularProgressContainer}>
            <Icon2 name="water-outline" size={35} color={'#4a90e2'} style={styles.icon} />
            <AnimatedCircularProgress
              size={140}
              width={10}
              fill={temperature}
              tintColor={'#4a90e2'}
              backgroundColor="#e6e6e6"
            >
              {
                (fill) => (
                  <Text style={styles.progressText}>
                    {`${Math.round(temperature)}°C`}
                  </Text>
                )
              }

            </AnimatedCircularProgress>
           
          </View>

        </View>



      </View>

      <View style={styles.bildirimler}>
        <TouchableOpacity style={styles.buttonbildrim} >
          <Icon2 style={styles.iconbildirim}
            name={deprem ? "pulse" : "pulse"} // LED durumuna göre ikonu değiştir
            size={30} // İkon boyutu
            color={deprem ? "orange" : "#808080"} // LED durumuna göre ikon rengini değiştir
          />
          <Text style={styles.buttonText}></Text>

          <Icon2 style={styles.iconbildirim}
            name={gaz ? "fire" : "fire"} // LED durumuna göre ikonu değiştir
            size={30} // İkon boyutu
            color={gaz ? "orange" : "#808080"} // LED durumuna göre ikon rengini değiştir
          />

          <Icon2 style={styles.iconbildirim}
            name={hirsizState ? "eye" : "eye"} // LED durumuna göre ikonu değiştir
            size={30} // İkon boyutu
            color={hirsizState ? "orange" : "#808080"} // LED durumuna göre ikon rengini değiştir
          />


        </TouchableOpacity>

      </View>

      <View style={styles.sliderContainer}>
      <Icon2 
            name={angle2 ? "garage" : "garage"} // LED durumuna göre ikonu değiştir
            size={30} // İkon boyutu
            color={angle2 ? "orange" : "#808080"} // LED durumuna göre ikon rengini değiştir
          />
<Slider
        style={styles.verticalSlider}
        minimumValue={0}
        maximumValue={90}
        value={angle2}
        onValueChange={updateAngle2}
        step={1}
        thumbTintColor="#4a90e2" // Burada kaydırıcı butonunun rengini istediğiniz renge ayarlayın

      />
      <Icon2
            name={angle ? "door" : "door"} // LED durumuna göre ikonu değiştir
            size={30} // İkon boyutu
            color={angle ? "orange" : "#808080"} // LED durumuna göre ikon rengini değiştir
          />
<Slider
        style={styles.verticalSlider}
        minimumValue={0}
        maximumValue={90}
        value={angle}
        onValueChange={updateAngle}
        step={1}
        thumbTintColor="#4a90e2" // Burada kaydırıcı butonunun rengini istediğiniz renge ayarlayın

      />
</View>
      <View style={styles.cont}>


        <View style={styles.dfplayercont}>

          <View style={styles.dfplayer}>

            <TouchableOpacity style={styles.button} onPress={() => sendDFPlayerStatus('prev')} >
              
                <Icon2 name="skip-previous" size={40} color="#2196F3" /> 
              
              <Text style={styles.buttonText}></Text>

            </TouchableOpacity>
            <TouchableOpacity style={styles.button}  onPress={() => togglePlayStop()}>
            <Icon2 name={isPlaying ? "stop" : "play"} size={40} color="#2196F3" />
              <Text style={styles.buttonText}></Text>

            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button}  onPress={() => sendDFPlayerStatus('next')}>
              <Icon2
                name={isOtoKlimaOn ? "skip-next" : "skip-next"} // LED durumuna göre ikonu değiştir
                size={40} // İkon boyutu
                color={isOtoKlimaOn ? "#2196F3" : "#2196F3"} // LED durumuna göre ikon rengini değiştir
              />
              <Text style={styles.buttonText}></Text>
            </TouchableOpacity>




          </View>


          <View style={styles.sliderContainer2}>
            <Slider
              style={styles.verticalSlider2}
              minimumValue={0}
              maximumValue={30}
              value={ses}
              onValueChange={updateSes}
              step={1}
              thumbTintColor="#4a90e2" // Burada kaydırıcı butonunun rengini istediğiniz renge ayarlayın

            />
          </View>
          
        </View>


      </View>


    </View>

  );
};

const styles = StyleSheet.create({


  sliderContainer2: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -50,
    marginLeft: -50,
    marginTop: 0,
    
  },

  verticalSlider2: {
    width: 250,

  },
  container: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  progressContainer: {
    marginBottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 2,

  },
  progressText: {
    position: 'absolute',
    fontSize: 18,
    color :'#4a90e2',
  },
  circularProgressContainer: {
    alignItems: 'center', // İçerikleri merkezlemek için
  },

  led: {
    marginTop: 10,
  },


  descriptionText: {
    marginTop: 8, // İlerleme çubuğunun hemen altında biraz boşluk
    fontSize: 16,

  },
  header: {
    margin: 20,
    flexDirection: 'row',


  },
  dfplayer: {
    flexDirection: 'row',
    margin: 10,


  },

  dfplayercont: {
    width: '95%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,

  },



  button: {

    flexDirection: 'row',
    margin: 10,
    backgroundColor: '#FFFFFF',
    padding:12,
    borderRadius: 20,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    alignItems: 'center', // İçerikleri dikey olarak merkezler
  },
  buttonbildrim: {
    width: '95%', // İçeriklerin genişliğini %80 olarak ayarlar
    flexDirection: 'row',
    margin: -20,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 20,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    alignItems: 'center', // İçerikleri dikey olarak merkezler
    justifyContent: 'center', // İçerikleri yatay olarak merkezler (eğer içeriklerin genişliği toplamı < %100 ise)
  },

  sliderContainer: {
    width: '95%', // İçeriklerin genişliğini %80 olarak ayarlar
    flexDirection: 'row',
   marginTop :50,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 20,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    alignItems: 'center', // İçerikleri dikey olarak merkezler
    justifyContent: 'center', // İçerikleri yatay olarak merkezler (eğer içeriklerin genişliği toplamı < %100 ise)
  },

  verticalSlider: {
    width: 100,

  },
  buttonbottom: {
    flexDirection: 'row',
    marginBottom: -70, // İkon ve metin arasında boşluk

    padding: 10,


  },
  buttonText: {
    marginTop: 4, // İkon ve metin arasında boşluk
    color: '#555', // Metin rengi
    fontSize: 16, // Metin boyutu
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    margin: 20,
    backgroundColor: '#fafafa',
    padding: 15,
    borderRadius: 20,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  icon: {



    alignItems: 'center', // İçerikleri dikey olarak merkezler
    marginBottom: 15,
    marginTop: -15,
  },
  iconbildirim: {


    marginLeft: 40,
    marginRight: 40,
    alignItems: 'center', // İçerikleri dikey olarak merkezler

  },

  bildirimler: {
    flexDirection: 'row',

  },

  cont: {
    flexDirection: 'row', // Elemanları yatay olarak sıralar
    alignItems: 'center', // Elemanları dikey olarak merkeze alır
    justifyContent: 'space-between', // Elemanlar arasında eşit boşluk bırakır
    marginTop: 40, // Üstten boşluk
    marginHorizontal: 0, // Yatay yönde (sağdan ve soldan) 10 birimlik boşluk
    marginBottom: 10, // Alttan boşluk

  },




});

export default EvScreen;
