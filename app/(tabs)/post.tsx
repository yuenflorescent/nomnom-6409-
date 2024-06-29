import { View, Text, KeyboardAvoidingView, TouchableOpacity, Image, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import uuid from 'react-native-uuid'; // Import react-native-uuid


//importing custom components 
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';

// select images
import * as ImagePicker from "expo-image-picker"

import { db, auth } from '../_layout';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


const Post = () => {

  const [form, setForm] = useState({
    image: '',
    title: '',
    caption: '',
    address: '',
    likes: 0,
  })

  const pickImage = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.2,
    });

    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0].uri })
    }
  }


  const uploadPost = async () => {
    if (form.image === '') {
      return Alert.alert("You Didn't Upload An Image :(");
    }
    
    const storage = getStorage();
    const uniqueImageName = `${auth.currentUser?.uid}-${uuid.v4()}`; // Create a unique identifier
    const storageRef = ref(storage, uniqueImageName);

    const getBlobFroUri = async (uri: string) => {
      const blob: Blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });
    
      return blob;
    };
    
    const imageBlob: Blob = await getBlobFroUri(form.image);
    const uploadTask = uploadBytesResumable(storageRef, imageBlob);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    },
    (error: any) => {
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          break;
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
      }
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref)
      .then( async (downloadURL) => {
        const docRef = await addDoc(collection(db, "posts"),{
          url: downloadURL,
          userID: auth.currentUser?.uid,
          image: form.image,
          title: form.title,
          caption: form.caption,
          address: form.address,
          likes: form.likes,
          post_time: serverTimestamp()
        })
        console.log("Success!", docRef.id);
      });
      
      ({
        image: '',
        title: '',
        caption: '',
        address: '',
        likes: 0,
      });
      router.push('/home');
      }
    )
  }

  return (

    <KeyboardAvoidingView behavior = 'padding' keyboardVerticalOffset={400} className="bg-primary h-full items-center">
        {form.image !== '' ? (
          <Image
            className="mt-10 mb-10 w-2/3 h-1/3 rounded-xl"
            source={{uri: form.image}}
            resizeMode='contain'
          />
        ) : (
          <CustomButton 
          title= "Pick Something From Your Gallery..."
          handlePress= {pickImage}
          containerStyles= "mt-10 mb-10 w-2/3 h-1/3 rounded-xl bg-secondary"
          textStyles= "text-2xl font-OutfitBold text-white"
          isLoading={undefined}        
        />         
        )}

      <FormField 
      title='Title Your Review' 
      value= {form.title}
      placeholder= 'Give your review a title!'
      handleChangeText={(e: string) => setForm({ ...form, title: e })}
      otherStyles={undefined} 
      />

      <FormField 
      title='Review Your Nom' 
      value= {form.caption}
      placeholder= 'Tell people how you feel about this place!'
      handleChangeText={(e: string) => setForm({ ...form, caption: e })}
      otherStyles= "mt-5"
      />

      <FormField 
      title='Address (Optional)' 
      value= {form.address}
      placeholder= ''
      handleChangeText={(e: string) => setForm({ ...form, address: e })}
      otherStyles= "mt-5"
      />

      <CustomButton 
      title= "Post" 
      handlePress={uploadPost} 
      containerStyles= "w-5/6" 
      textStyles= "text-white" 
      isLoading={undefined}
      />

    </KeyboardAvoidingView>
  )
}

export default Post