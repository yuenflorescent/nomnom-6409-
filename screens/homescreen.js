import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/native'

const HomeScreen = () => {

    const navigation = useNavigation();

    const handleSignout = () => {
        const userEmail = auth.currentUser?.email;
        auth
        .signOut()
        .then(() => {
            console.log('Logged out of account: ' + userEmail);
            navigation.replace('Login')
        })
        .catch(error => alert(error.message))
    };

  return (
    <View style = {styles.container}>
      <Text>Email: {auth.currentUser?.email}</Text>
      <TouchableOpacity
        style = {styles.button}
        onPress = {handleSignout}>
        <Text style = {styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'white',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40,
    },
    buttonText: {
        color: 'black',
        fontWeight: '700',
        fontSize: 16,
    },
})