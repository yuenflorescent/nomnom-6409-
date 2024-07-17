import React, { useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import { router } from 'expo-router'
import { auth, db } from '../_layout'
import { doc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUsername(userDoc.data().username);
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, []);

  const handleSignout = () => {
    const userEmail = auth.currentUser?.email;
    auth
      .signOut()
      .then(() => {
        console.log('Logged out of account: ' + userEmail);
        router.back();
      })
      .catch(error => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <Image source = {require('../../assets/profileicon.png')} style = {styles.profileicon}/>
      <Text style={styles.usernameText}>@{username}</Text>
      <Text style={styles.emailText}>Logged-in to: {auth.currentUser?.email}</Text>
      <TouchableOpacity
        style = {styles.button}
        onPress={() => router.push('/bookmarks')}
      >
        <Ionicons name="bookmark-outline" size={24} color="black" style = {styles.icon}/>
        <Text style={styles.buttonText}>View Bookmarks</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSignout}
      >
        <Text style={[styles.buttonText, { color: 'red' }]}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileicon: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  usernameText: {
    fontSize: 16,
    marginBottom: 30,
    color: '#ed800c',
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'white',
    width: '80%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    flexDirection: 'row'
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default ProfileScreen;
