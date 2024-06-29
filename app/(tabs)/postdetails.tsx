import React, { useState, useEffect} from "react";
import { StyleSheet, View, Text, Image, KeyboardAvoidingView, TextInput, FlatList, ScrollView, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, query, where, getDocs, serverTimestamp, orderBy, doc, getDoc } from 'firebase/firestore';
import { router, useLocalSearchParams } from 'expo-router';
import { db, auth } from '../_layout';

export default function PostDetails({  }) {

    const item = useLocalSearchParams();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    const fetchComments = async () => {
      try {
          const q = query(collection(db, 'comments'), where('postID', '==', item.id), orderBy('timestamp', 'desc'));
          const querySnapshot = await getDocs(q);
          const commentsData = querySnapshot.docs.map(doc => ({
              ...doc.data(),
              id: doc.id,
          }));
          setComments(commentsData);
      } catch (error) {
          console.error('Error fetching comments:', error);
      }
  };

  useEffect(() => {
    fetchComments();
  }, [item.id]); // Add item.id as a dependency to re-fetch comments when item.id changes


  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const username = userDoc.exists() ? userDoc.data().username : 'Anonymous';

            await addDoc(collection(db, 'comments'), {
                postID: item.id,
                userID: user.uid,
                username: username,
                comment: comment,
                timestamp: serverTimestamp(),
            });

            setComment('');
            fetchComments();
        }
    } catch (error) {
        console.error('Error submitting comment:', error);
    }
};

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={80}>
        <ScrollView>
          <Ionicons name="arrow-back-circle" size={40} color="orange" style = {styles.back} onPress={() => router.replace('/home')}/>
          <View style = {styles.imageContainer}>
            <Image source={{uri: item.url}} style = {styles.image}/>
          </View>
          <View style = {styles.textContainer}>
            <Text style = {styles.title}>{ item.title } </Text>
            <Text style = {styles.address}>Address: { item.address }</Text>
            <Text>{ item.caption } </Text>
          </View>

          <View style={styles.commentSection}>
                <Text style={styles.commentTitle}>Comments</Text>
                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.comment}>
                            <Text style={styles.commentUser}>{item.username}:</Text>
                            <Text>{item.comment}</Text>
                        </View>
                    )}
                />
            </View>

          <View style={styles.commentInputSection}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    value={comment}
                    onChangeText={setComment}
                />
                <Pressable style = {styles.button} onPress={handleCommentSubmit}>
                  <Text style = {styles.buttonText}>Post</Text>
                </Pressable>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
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
    },
    commentSection: {
      padding: 22,
      borderTopWidth: 1,
      borderTopColor: '#ccc',
  },
  commentTitle: {
      fontWeight: 'bold',
      fontSize: 20,
      marginBottom: 10,
  },
  comment: {
      marginBottom: 10,
  },
  commentUser: {
      fontWeight: 'bold',
  },
    commentInputSection: {
      flexDirection: 'row',
      paddingBottom: 15,
      paddingHorizontal: 12,
      borderTopWidth: 1,
      borderTopColor: '#ccc',
      marginBottom: 0,
      paddingTop: 14
  },
  commentInput: {
      flex: 1,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      marginRight: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
  },
  button: {
    paddingTop: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'orange'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }
  })