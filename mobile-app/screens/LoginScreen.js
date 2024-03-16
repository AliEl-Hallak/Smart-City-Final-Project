import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from '../FirebasseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';
import Toast from 'react-native-toast-message'; // Kütüphaneyi import et
import {DotIndicator} from 'react-native-indicators';

const auth = FIREBASE_AUTH;

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Veriler yükleniyor başlangıçta true olarak ayarlandı

  const handleLogin = async () => {
    try {
      setIsLoading(true); // Veriler yüklendiğinde beklemeyi kaldır

      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const userEmail = userCredential.user.email;
      setIsLoading(false); // Veriler yüklendiğinde beklemeyi kaldır

      navigation.navigate('HomeScreen', { email: userEmail });
    } catch (error) {
      setIsLoading(false); // Veriler yüklendiğinde beklemeyi kaldır

      // Hata durumunda toast mesajı göster
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Hata',
        text2: 'Giriş başarısız: ' + error.message,
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
    }
    setEmail("");
    setPassword("");
  };






  return (
    <View style={styles.container}>
         <View style={styles.cont}>
         {isLoading && (
        <View style={styles.loadingContainer}>
<DotIndicator  color='#2196f3' />
        </View>
      )}
      <Text/>
      <Text/>
      <Text/>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text)=>setEmail(text)}
        placeholder="E-posta"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text)=>setPassword(text)}
        placeholder="Şifre"
        secureTextEntry
      />
    <Button title="Giriş Yap" color="#4a90e2" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Hesabınız yok mu? Kaydolun</Text>
      </TouchableOpacity>
      <Text/>
      <Text/>
      <Text/>

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
    backgroundColor: '#fff',
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
export default LoginScreen;
