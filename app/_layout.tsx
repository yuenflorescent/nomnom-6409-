import { StyleSheet, Text, View } from 'react-native'
import { SplashScreen, Stack, Slot } from 'expo-router'
import { useEffect } from 'react'

// for NativeWind
import "../global.css"

// importing custom fonts into the app
import { useFonts } from 'expo-font'
import { FONTFAMILY } from "./themes";

// firebase initialization
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import firebase from 'firebase/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCigU63kn2Fjjn0mzKkF4-oWJyeCsdKWrs",
    authDomain: "nomnom-authentification.firebaseapp.com",
    projectId: "nomnom-authentification",
    storageBucket: "nomnom-authentification.appspot.com",
    messagingSenderId: "136424992640",
    appId: "1:136424992640:web:55eb07d9a24fb0f454db65",
    measurementId: "G-CJV6SDRKML"
  };

const app = initializeApp(firebaseConfig)
const db = getFirestore(app);
const auth = getAuth(app);

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts ({
    "OutfitReg": require("../assets/fonts/Outfit-Regular.ttf"),
    "OutfitBold": require("../assets/fonts/Outfit-Bold.ttf"),
    "OutfitSB": require("../assets/fonts/Outfit-SemiBold.ttf"),
  });

  useEffect(() => {
    if(error) throw error;
    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error])

  if(!fontsLoaded && !error) return null;

  return (
  <Stack>
    <Stack.Screen name= "index" options={{headerShown: false}} />
  </Stack>
  )
}

export default RootLayout
export { db, auth }