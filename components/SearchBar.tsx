import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';

const searchbar = ({initialQuery} : {initialQuery: any}) => {
    const pathname = usePathname();
    const [userQuery, setQuery] = useState(initialQuery || '')

  return (
      <TouchableOpacity
      onPress={()=>{
        if (userQuery === '') return Alert.alert("Type Something In")
        else {
          if (!pathname.startsWith("/search")) {
            {router.push(`/search/${userQuery}`);}
          }
          router.setParams({ userQuery })
        }
      }}
      className='self-center items-center justify-center flex-row flex-1 h-16 w-11/12 rounded-xl bg-white mt-14'
      >
      
      <TextInput 
      placeholder='look something up!'
      onChangeText={(e) => setQuery(e)}
      className='mr-24 font-Monaco'
      />
        <AntDesign name="search1" size={12} className='ml-32'/>
    </TouchableOpacity>
  )
}

export default searchbar

const styles = StyleSheet.create({})