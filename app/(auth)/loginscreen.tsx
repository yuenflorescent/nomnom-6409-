import { SafeAreaView, ScrollView, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { signInWithEmailAndPassword, getAuth} from 'firebase/auth';
import { router } from 'expo-router';

//importing custom components 
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';


const LoginScreen = () => {

    const auth = getAuth();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const handleError = (errorCode: any) => {
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
        const unsubscribe = getAuth().onAuthStateChanged(user => {
            if (user) {
                router.replace('/home')
            }
        }) 

        return unsubscribe;
    }, [])

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, form.email, form.password)
        .then((userCredential) => {
            const user = userCredential.user;
            router.replace('/home');
            console.log('Logged in with: ' + form.email);
        })
        .catch(error => alert(handleError(error.code)))
    }

  return (
    <KeyboardAvoidingView 
    className="flex-1 bg-primary h-full" 
    behavior="padding"
    keyboardVerticalOffset={130} 
    >
        <ScrollView contentContainerStyle={{
          height: "100%",
        }}>

        <View className="bg-primary h-full w-full items-center justify-center">
            <View className='items-center'>
                <Image 
                    source={require('../../assets/alternate_2.png')}
                    className="w-[300px] h-[50px] -mt-5"
                />
                <Text className='font-OutfitSB text-white text-3xl mb-4 mt-10'>
                    log In
                </Text>
            </View>
                <FormField 
                    title='Email' 
                    value={form.email} 
                    handleChangeText={(e: string) => setForm({ ...form, email: e })} 
                    placeholder={undefined} 
                    otherStyles={undefined}           
                />

                <FormField 
                    title='Password' 
                    value={form.password} 
                    handleChangeText={(e: string) => setForm({ ...form, password: e })} 
                    placeholder={undefined} 
                    otherStyles="mt-7"           
                />

                <CustomButton 
                title='Log In' 
                handlePress={handleLogin} 
                containerStyles="bg-white w-[140px] mt-7"
                textStyles= "text-l text-primary"
                isLoading={undefined}            
                />

            </View>
        </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen