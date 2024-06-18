import React from "react";
import { StyleSheet, View, Text, Button, Image, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';


export default function PostDetails({  }) {

    const item = useLocalSearchParams();

    return (
        <View style = {styles.container}>
          <Ionicons name="arrow-back-circle" size={40} color="orange" style = {styles.back} onPress={() => router.replace('/home')}/>
          <View style = {styles.imageContainer}>
            <Image source={{uri: item.url}} style = {styles.image}/>
          </View>
          <View style = {styles.textContainer}>
            <Text style = {styles.title}>{ item.title } </Text>
            <Text style = {styles.address}>Address: { item.address }</Text>
            <Text>{ item.caption } </Text>
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 35
    },
    back: {
      paddingLeft: 18,
      paddingBottom: 20
    },
    imageContainer: {
      alignItems: 'center'
    },
    image: {
      width: 350,
      height: 350,
      borderRadius: 5,
    },
    textContainer: {
      padding: 22
    },
    title: {
      marginBottom: 0,
      fontWeight: 'bold',
      fontSize: 25,
    },
    address: {
      fontStyle: 'italic',
      marginBottom: 10
    },
    text: {
      fontSize: 12,
    }
  })