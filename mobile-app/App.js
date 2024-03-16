// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import CopKutusuScreen from './screens/CopKutusuScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import HomeScreen from './screens/HomeScreen';
import OtoParkScreen from './screens/OtoParkScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import EvScreen from './screens/EvScreen';
import CustomAlert from './CustomAlert';
const Stack = createNativeStackNavigator();
import * as Notifications from 'expo-notifications';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator  screenOptions={{
    headerStyle: {
      backgroundColor: '#4a90e2', // Başlık çubuğunun arka plan rengi
    },
    headerTintColor: '#fff', // Başlık çubuğu içindeki öğelerin (başlık, geri butonu vs.) rengi
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }}initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen}  />

        <Stack.Screen name="Register" component={RegistrationScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="OtoParkScreen" component={OtoParkScreen} />
        <Stack.Screen name="CopKutusuScreen" component={CopKutusuScreen} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="CustomAlert" component={CustomAlert} />
        <Stack.Screen name="EvScreen" component={EvScreen} />



        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
