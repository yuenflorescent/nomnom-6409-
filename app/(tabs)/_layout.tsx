import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Tabs, Redirect, router, usePathname, useSegments } from 'expo-router'
import { getAuth } from 'firebase/auth'
import { AntDesign } from '@expo/vector-icons';

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
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#B3541E',
          tabBarStyle: {
            backgroundColor: '#461111',
          }})}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({size, focused, color}) => (
              <AntDesign name="home" size={size} color={color} />)
          }}
        />

        <Tabs.Screen
          name="post"
          options={{
            title: "Create Post",
            headerShown: false,
            tabBarIcon: ({size, focused, color}) => (
              <AntDesign name="plussquare" size={size} color='orange' />)
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({size, focused, color}) => (
              <AntDesign name="user" size={size} color={color} />)
          }}
        />

        <Tabs.Screen
          name = "postdetails"
          options ={{
            title: "Post Details",
            headerShown: false,
            tabBarButton: () => null,
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout