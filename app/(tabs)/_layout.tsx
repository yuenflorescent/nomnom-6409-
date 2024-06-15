import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Tabs, Redirect, router } from 'expo-router'
import { getAuth } from 'firebase/auth'

const TabsLayout = () => {
  const [isLoading, setisLoading] = useState(true);

  getAuth().onAuthStateChanged((user) => {
    setisLoading(false);
    if (!user) {
      router.replace("/loginscreen");
    }
  });

  if (isLoading) return <Text className='font-OutfitBold'>Loading...</Text>;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#B3541E',
          tabBarStyle: {
            backgroundColor: '#461111'
          }
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="post"
          options={{
            title: "Post",
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout