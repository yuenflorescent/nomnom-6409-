import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';

const searchbar = ({initialQuery} : {initialQuery: string}) => {
    const pathname = usePathname();
    const [query, setQuery] = useState(initialQuery || '')

  return (
    <View className='flex-1 w-full rounded-2xl bg-gray'> 
      <TouchableOpacity
      onPress={()=>{
        if (query === '') return Alert.alert("Type Something In")
        if (pathname.startsWith("/Search")) router.setParams({ query })
        else router.push(`/search/${query}`)
      }}
      >
        <TextInput 
      placeholder='look something up!'
      onChangeText={(e) => setQuery(e)}
      />
        <AntDesign name="search1" backgroundColor="gray" size={12}/>
    </TouchableOpacity>
    </View>
  )
}

export default searchbar

const styles = StyleSheet.create({})