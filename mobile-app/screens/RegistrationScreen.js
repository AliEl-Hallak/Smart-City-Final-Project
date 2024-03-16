// screens/RegistrationScreen.js
import React, { useState } from 'react';
import { View, Alert, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebasseConfig';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { doc, setDoc } from '@firebase/firestore';
import Toast from 'react-native-toast-message'; // Kütüphaneyi import et
import {DotIndicator} from 'react-native-indicators';

const auth = FIREBASE_AUTH;

const RegistrationScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Veriler yükleniyor başlangıçta true olarak ayarlandı

  const signUp = async () => {

    try {
      setIsLoading(true); // Veriler yüklendiğinde beklemeyi kaldır

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore'a kullanıcı adı ve telefon numarası ekle
      const userRef = doc(FIRESTORE_DB, 'users', user.uid);
      await setDoc(userRef, {
        username: username,
        phoneNumber: phoneNumber,
      });
      setIsLoading(false); // Veriler yüklendiğinde beklemeyi kaldır

      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'success',
        text2: 'Kayıt işlemi başarıyla gerçekleştirildi ' ,
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
      setTimeout(() => {
        navigation.navigate('HomeScreen');
        
    }, 2000);
    } catch (error) {
      setIsLoading(false); // Veriler yüklendiğinde beklemeyi kaldır

      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Hata',
        text2: 'Kayıt başarısız: ' + error.message,
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
    }

    setEmail("");
    setPassword("");
    setPhoneNumber("");
    setUsername("");
  }

  return (
    <View style={styles.container}>
          <View style={styles.cont}>


          {isLoading && (
        <View style={styles.loadingContainer}>
<DotIndicator  color='#2196f3' />
        </View>
      )}
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Kullanıcı Adı"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder="E-posta"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder="Şifre"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
        placeholder="Telefon Numarası"
        keyboardType="phone-pad" // Klavyeyi telefon klavyesi olarak ayarla
      />
      <Button title="Kaydol" color="#4a90e2" onPress={signUp} />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Zaten bir hesabınız var mı? Giriş Yap</Text>
      </TouchableOpacity>
      </View>
      <Toast ref={(ref) => Toast.setRef(ref)} /> 

    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#f5f5f5',
    },
    input: {
      height: 50,
      borderColor: '#e1e1e1',
      borderWidth: 2,
      marginBottom: 15,
      paddingHorizontal: 10,
      borderRadius: 5,
      backgroundColor: 'white',
    },
    linkText: {
      color: '#4a90e2',
      marginTop: 15,
      textAlign: 'center',
    },
    cont: {
      width: '100%',
      padding: 20,
      borderRadius: 10,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },

    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
  });
export default RegistrationScreen;
