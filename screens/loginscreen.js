import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation();

    const handleError = (errorCode) => {
        switch (errorCode) {
            case 'auth/invalid-email':
                return 'Enter a valid email address.';
            case 'auth/invalid-credential':
                return 'Incorrect email/password.';
            case 'auth/email-already-in-use':
                return 'Email has a registered account already.';
            default:
                 return {errorCode} + 'An unknown error occurred.';
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace('Home')
            }
        }) 

        return unsubscribe;
    }, [])

    const handleSignup = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Registered with: ' + user.email);
        })
        .catch(error => alert(handleError(error.code)))
    }

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Logged in with: ' + user.email);
        })
        .catch(error => alert(handleError(error.code)))
    }
  return (
    <KeyboardAvoidingView
        style = {styles.container}
        behavior='padding'>
            <ImageBackground source={require('../assets/Login_Background.png')} style = {styles.background}>
            <Image source = {require('../assets/Banhmi.png')} style = {styles.logo}/>
            <View style = {styles.inputContainer}>
                <TextInput
                    placeholder='Email'
                    value = {email}
                    onChangeText = {text => setEmail(text)}
                    style = {styles.input}
                />
                <TextInput
                    placeholder='Password'
                    value = {password}
                    onChangeText = {text => setPassword(text)}
                    style = {styles.input}
                    secureTextEntry
                />
            </View>

            <View style = {styles.buttonContainer}>
                {/* Login Button */}
                <TouchableOpacity
                    onPress={handleLogin}
                    style = {styles.button}
                >
                    <Text style = {styles.buttonText}>Login</Text>
                </TouchableOpacity>
 
                {/* Sign up Button */}
                <TouchableOpacity
                    onPress={handleSignup}
                    style = {[styles.button, styles.buttonOutline]}
                >
                    <Text style = {styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>
            </View>
            </ImageBackground>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f79860',
    },
    background: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 300,
        height: 200,
        marginBottom: 40,
        marginLeft: 5,
        borderWidth: 5,
        borderColor: 'transparent',
        // borderRadius: 90,
    },
    inputContainer: {
        width: '70%',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2,
    },
    buttonText: { 
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16,
    },
})