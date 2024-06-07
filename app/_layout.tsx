import { StyleSheet, Text, View } from 'react-native'
import { SplashScreen, Stack, Slot } from 'expo-router'
import { useFonts } from 'expo-font'
import { useEffect } from 'react'
import "../global.css"
import { FONTFAMILY } from "./themes";

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