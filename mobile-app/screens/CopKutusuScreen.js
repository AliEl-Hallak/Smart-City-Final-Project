import React, { useState, useEffect ,useRef} from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { database } from '../FirebasseConfig';
import { ref, onValue } from 'firebase/database';
import LottieView from 'lottie-react-native';
import * as Notifications from 'expo-notifications';


const CopKutusuScreen = () => {
  const [trashLevel, setTrashLevel] = useState('');
  const [trashStatus, setTrashStatus] = useState('');
  const [animationProgresslevel, setAnimationProgresslevel] = useState(0); // Animasyon ilerlemesini tutacak state
  const animationRef = useRef(null);

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

    switch(level) {
      case 0:
        setAnimationProgresslevel(1);
        break;
      case 1:
        setAnimationProgresslevel(1);
        break;
      case 2:
        setAnimationProgresslevel(0.9);
        break;
        case 3:
          setAnimationProgresslevel(0.8);
          break;
      case 4:
        setAnimationProgresslevel(0.7);
        break;
      case 5:
        setAnimationProgresslevel(0.6);
        break;
        case 6:
        setAnimationProgresslevel(0.6);
        break;
      case 7:
        setAnimationProgresslevel(0.5);
        break;
      case 8:
        setAnimationProgresslevel(0.4);
        break;
        case 9:
        setAnimationProgresslevel(0.4);
        break;
      case 10:
        setAnimationProgresslevel(0.3);
        break;
      case 11:
        setAnimationProgresslevel(0.2);
        break;
      case 12:
        setAnimationProgresslevel(0.1);
        break;
      case 13:
        setAnimationProgresslevel(0);
        break;
        case 14:
          setAnimationProgresslevel(0);
          break;
      default:
        setAnimationProgresslevel(0); // Eğer seviye belirlenen aralıklar dışındaysa varsayılan olarak 0 ayarla
    }
  };



  const updateAnimation = (status) => {
    switch(status) {
      case 'Bos':
        animationRef.current.play(5, 30); // 60% ile 100% arası
        break;
      case 'Orta':
        animationRef.current.play(50, 70); // 60% ile 100% arası
        break;
      case 'Dolu':
        animationRef.current.play(72, 90); // 60% ile 100% arası
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'cop',
            body: 'cop',
          },
          trigger: { seconds: 1 },
        });
        break;
      default:
        animationRef.current.play(10, 20); // 60% ile 100% arası
    }
  };

  return (
    <ScrollView >

<View style={styles.container}>
<View style={styles.slotContainer}>

      <LottieView
      source={require('../resim/cop.json')} // Make sure this path is correct

      ref={animationRef}

      autoPlay={false}
      loop={true}
      style={styles.lottieAnimation}
      />
      <LottieView
      source={require('../resim/copSiveysi.json')} // Make sure this path is correct
      progress={animationProgresslevel}
      autoPlay={false}
      loop={false}
      style={styles.lottieAnimationLevel}
      />
    {/* 
      <Text style={styles.text}>Çöp Seviyesi: {trashLevel}</Text>
      <Text style={styles.text}>Çöp Durumu: {trashStatus}</Text>
    
    */}
        </View>

    </View>
    </ScrollView>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F3',
  },
  slotContainer: {
    width: '90%', // Use percentage to ensure it fits within various screen sizes
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // More pronounced rounded corners
    padding: 20, // Uniform padding
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  lottieAnimation: {
      width: 300, // Adjust width as needed
    height: 500, // Adjust height as needed
    alignSelf: 'center',

    marginTop: -30, // Üstteki animasyonla arasındaki boşluğu azaltmak için
    marginBottom: -280, // Üstteki animasyonla arasındaki boşluğu azaltmak için
  },
  lottieAnimationLevel: {
    width: 300,
    height: 500, // Consistent size with the first animation
    alignSelf: 'center',
    marginBottom: -80, // Üstteki animasyonla arasındaki boşluğu azaltmak için

  },
});

export default CopKutusuScreen;
