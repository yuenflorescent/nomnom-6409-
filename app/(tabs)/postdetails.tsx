
import React, { useState, useEffect} from "react";
import { StyleSheet, View, Text, Image, KeyboardAvoidingView, TextInput, FlatList, ScrollView, Pressable, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, query, where, getDocs, serverTimestamp, orderBy, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { db, auth } from '../_layout';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function PostDetails({  }) {

    const item: any = useLocalSearchParams();
    const [comment, setComment] = useState('');
    const [caption, setCaption]: any = useState([]);
    const [comments, setComments]: any = useState([]);
    const [isBookmarked, setIsBookmarked] = useState(false);

    const splitCaption = () => {
      const postcaption = item.caption;
      const captionArr = postcaption.trim().split(" ");
      // captionArr.forEach((word: any) => {
      //   if (word.startsWith("#")) {
      //     word = <Link href={{pathname: "/hashtag/[tag]", params: {tag: word}}} className='text-sky-600'>${word}</Link>;
      //   }
      // });
      // // const result:string = captionArr.join(" ");
      setCaption(captionArr);
    }

    const checkBookmarkStatus = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const bookmarkQuery = query(collection(db, 'bookmarks'), where('userId', '==', user.uid), where('postId', '==', item.id));
          const bookmarkSnapshot = await getDocs(bookmarkQuery);
          setIsBookmarked(!bookmarkSnapshot.empty);
        }
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    };

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
    checkBookmarkStatus();
    splitCaption();
  }, [item.id]);

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

    const handleBookmarkPress = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          alert('You need to be logged in to bookmark posts.');
          return;
        }
  
        const bookmarkQuery = query(collection(db, 'bookmarks'), where('userId', '==', user.uid), where('postId', '==', item.id));
        const bookmarkSnapshot = await getDocs(bookmarkQuery);
  
        if (!bookmarkSnapshot.empty) { // Already bookmarked
          // Remove bookmark
          await deleteDoc(doc(db, 'bookmarks', bookmarkSnapshot.docs[0].id));
          setIsBookmarked(false);
        } else { // Not bookmarked
          // Add bookmark
          await addDoc(collection(db, 'bookmarks'), {
            userId: user.uid,
            postId: item.id,
          });
          setIsBookmarked(true);
        }
      } catch (error) {
        console.error('Error handling bookmark:', error);
      }
    };

  return (
    <>
      <KeyboardAwareScrollView style = {styles.container}>
        <View style = {styles.addBottomSpace}>
      {/* <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={80}> */}
        <View style={styles.header}>
          <Ionicons name="arrow-back-circle" size={40} color="#ed800c" style={styles.back} onPress={() => router.back()} />
          <TouchableOpacity>
            <Ionicons name={isBookmarked ? "bookmark" : "bookmark-outline"} size={30} color={isBookmarked ? "orange" : "black"} style={styles.bookmark} onPress={handleBookmarkPress} />
          </TouchableOpacity>
        </View>

        <FlatList

          ListHeaderComponent={ // Display post image and details.
            <>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.url }} style={styles.image} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title} </Text>
                <Text style={styles.address}>📍Address: {item.address}</Text>
                <View>
                  <Text>
                  {caption.map((word: string, index: number) =>
                    word.startsWith('#') ? (
                      <Link key={index} href={{pathname: "/hashtag/[tag]", params: {tag: word}}} className='text-sky-600'>{word} </Link>
                    ) : (
                      <Text key={index}>{word} </Text>
                    ) 
                  )}
                  </Text>
                </View>
              </View>
              <View style={styles.commentHeader}>
                <Text style={styles.commentTitle}>Comments</Text>
              </View>
            </>}

          // Display comments
          data={comments}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => (
            <View style={styles.comment}>
              <Text style={styles.commentUser}>{item.username}:</Text>
              <Text>{item.comment}</Text>
            </View>
          )}
        />
      {/* </KeyboardAvoidingView> */}
      </View>
      </KeyboardAwareScrollView>

      {/* Comment input */}
      <View style={styles.commentInputSection}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
        />
        <Pressable style={styles.button} onPress={handleCommentSubmit}>
          <Text style={styles.buttonText}>Post</Text>
        </Pressable>
      </View>
      {/* </KeyboardAvoidingView> */}
      {/* </KeyboardAwareScrollView> */}
    </>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 35,
      marginBottom: 100,
    },
    addBottomSpace: {
      marginBottom: 30,
    },
    header: {
      flexDirection: 'row',
      marginTop: 25,
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    back: {
      paddingLeft: 18,
    },
    bookmark: {
      marginRight: 22,
      paddingTop: 6,
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
  commentHeader: {
      marginHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      marginBottom: 20,
  },
  commentTitle: {
      fontWeight: 'bold',
      fontSize: 20,
      marginBottom: 10,
  },
  comment: {
      marginBottom: 10,
      marginLeft: 20,
  },
  commentUser: {
      fontWeight: 'bold',
  },
    commentInputSection: {
      flexDirection: 'row',
      paddingHorizontal: 12,
      borderTopWidth: 1,
      borderTopColor: '#ccc',
      marginBottom: 30,
      paddingTop: 14,
      position:'absolute',
      bottom: 0,
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
    backgroundColor: '#ed800c'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }
  })