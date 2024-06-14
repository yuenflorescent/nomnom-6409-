import { View, Text, KeyboardAvoidingView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import * as FileSystem from 'expo-file-system'

//importing custom components 
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';

// select images
import * as ImagePicker from "expo-image-picker"
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'

const Post = () => {

  const [form, setForm] = useState({
    image: '',
    caption: ''
  })

  const [upload, setUpload] = useState(false)

  const pickImage = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true
    });

    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0].uri })
    }
  }

  const submit = async () => {
    if (form.image === '') {
      return Alert.alert("You Didn't Upload An Image :(")
    }

    setUpload(true);

    try {
      const { uri } = await FileSystem.getInfoAsync(form.image)
      const blob: Blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (e) => {
          reject(new TypeError("Network Request Failed"));
        };
        xhr.responseType = 'blob'
        xhr.open('GET', uri, true)
        xhr.send(null)
      });
      const filename = form.image.substring(form.image.lastIndexOf("/") + 1)
      const ref = firebase.storage().ref().child(filename)

      await ref.put(blob);
      setUpload(false)
      Alert.alert("Photo Uploaded :)")
      setForm({
        image: '',
        caption: ''
      })
    } catch (error) {
      console.error(error);
      setUpload(false)
    }
  }

  return (

    <KeyboardAvoidingView>

      <View>
        {form.image !== '' ? (
          <Image
            className="w-5/6 h-1/4 rounded-xl"
            source={{uri: form.image}}
            resizeMode='contain'
          />
        ) : (
          <CustomButton 
          title= "Pick Something From Your Gallery..."
          handlePress= {pickImage}
          containerStyles= "w-5/6 h-1/4 rounded-xl"
          textStyles= "text-xl"
          isLoading={undefined}        
        />         
        )}
      </View>

      <FormField 
      title='Review Your Nom' 
      value= {form.caption}
      placeholder= 'Write Something Cool :)'
      handleChangeText={(e: string) => setForm({ ...form, caption: e })}
      otherStyles={undefined} 
      />

      <CustomButton 
      title= "Post" 
      handlePress={submit} 
      containerStyles= "w-5/6" 
      textStyles={undefined} 
      isLoading={undefined}
      />

    </KeyboardAvoidingView>
  )
}

export default Post