import React, { useState, useEffect } from 'react';
import { View,ScrollView, Text, StyleSheet,TouchableOpacity  } from 'react-native';
import LottieView from 'lottie-react-native'; // Lottie kütüphanesi
import { database } from '../FirebasseConfig';
import { ref, onValue } from 'firebase/database';
import Icon from 'react-native-vector-icons/FontAwesome';
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

const OtoParkScreen = () => {
  const [parkingSlots, setParkingSlots] = useState({});
  const [emptySlots, setEmptySlots] = useState(0);
  const [value, setValue] = useState(0.10); // value state'i

  useEffect(() => {
    // Boş park sayısını dinle
    const numRef = ref(database, 'parkingnum');
    onValue(numRef, (snapshot) => {
      setEmptySlots(snapshot.val());
    });

    // Park yerlerinin durumunu dinle
    const parkingRef = ref(database, 'parking');
    onValue(parkingRef, (snapshot) => {
      setParkingSlots(snapshot.val());

      // Park durumu false ise value'yu 0 yap
      if (!snapshot.val()) {
        setValue(0);
      }
    });
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
      <TouchableOpacity style={styles.emptySlotsContainer}>
        <Text style={styles.title}>
        {numToString(emptySlots)} tane park yeri müsaittir.
        </Text>
        <Icon name="car" size={24} color="#000" />
      </TouchableOpacity>
        {Object.keys(parkingSlots).map((key) => {
          // Anahtarı "slot1" formatından "P1" formatına dönüştür
          const displayKey = key.replace('slot', '🅿 ');
          return (
            <View key={key} style={styles.slotContainer}>
              
              {/* Park durumuna göre animasyon gösterimi */}
              {parkingSlots[key] ? (
                <LottieView
                  source={require('../resim/car.json')}
                  autoPlay={true}
                  loop={false}
                  style={styles.animation}
                />
              ) : (
                <LottieView
                  source={require('../resim/car.json')}
                  autoPlay={false}
                  loop={false}
                  progress={value}
                  style={styles.animation}
                />
              )}

              <Text style={[styles.slot, parkingSlots[key] ? styles.slotOccupied : styles.slotEmpty]}>
                {displayKey.toUpperCase()}: {parkingSlots[key] ? 'Dolu' : 'Boş'}
              </Text>
            </View>
          );
        })}
 
      </View>
    </ScrollView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F0F0F3', // Daha yumuşak bir arkaplan rengi
  },
  title: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center', // Başlığı ortala
  },
  slotContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // Daha yuvarlak köşeler
    paddingVertical: 15, // Dikey padding'i artır
    paddingHorizontal: 20, // Yatay padding'i artır
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4, // Daha yumuşak gölge
  },
  slot: {
    fontSize: 18,
    fontWeight: '500', // Font kalınlığını artır
    marginVertical: 5,
    textAlign :'center'
  },
  slotOccupied: {
    color: '#EF5350', // Daha canlı bir dolu slot rengi
  },
  slotEmpty: {
    color: '#66BB6A', // Daha canlı bir boş slot rengi
  },
  animation: {
    width: 100,
    height: 150,
    alignSelf: 'center',
  },
  emptySlotsContainer: {
    flexDirection: 'row', // İkon ve metni yanyana getirir
    backgroundColor: '#FFFFFF', // Container arka plan rengi
    paddingHorizontal: 20, // İçeriden sağa ve sola boşluk
    paddingVertical: 10, // İçeriden yukarı ve aşağıya boşluk
    borderRadius: 20, // Kenar yuvarlaklığı
    alignItems: 'center', // İçerikleri ortalar
    elevation: 5, // Android için gölge efekti
    shadowColor: '#000', // iOS için gölge rengi
    shadowOffset: { width: 0, height: 2 }, // iOS için gölge yönü
    shadowOpacity: 0.25, // iOS için gölge opaklığı
    shadowRadius: 3.84, // iOS için gölge yayılma yarıçapı
    marginBottom:15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10, // Metin ve ikon arasındaki mesafe
  },
  emptySlots: {
    color: '#f44336', // Boş park yerleri sayısının rengi
  },
});

export default OtoParkScreen;
