import { View, Text, ScrollView, Image, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native'
import { db, auth } from '../_layout'
import { collection, query, getDocs, orderBy, limit, doc, addDoc, deleteDoc, updateDoc, where, getDoc } from "firebase/firestore"
import React, { useEffect, useState, useCallback } from 'react'
import { router, useFocusEffect } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';


// Define the Post type
interface Post {
  id: string;
  url: string;
  title: string;
  likes: number;
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

 
  const fetchBookmarkedPosts = async () => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'bookmarks'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const bookmarkedPostIDs = querySnapshot.docs.map(doc => doc.data().postId);
      
      const postPromises = bookmarkedPostIDs.map(async (postId) => {
        const postDoc = await getDoc(doc(db, 'posts', postId));
        return { id: postId, ...postDoc.data() } as Post;
      });

      const postsData = await Promise.all(postPromises);
      setPosts(postsData);

      // Fetch liked posts
      const likesQuery = query(collection(db, 'likes'), where('userId', '==', user.uid));
      const likesSnapshot = await getDocs(likesQuery);
      const likedPosts: { [key: string]: boolean } = {};
      likesSnapshot.forEach((doc) => {
        likedPosts[doc.data().postId] = true;
      });
      setLikedPosts(likedPosts);
      }
    };

    useFocusEffect(
      useCallback(() => {
        fetchBookmarkedPosts();
      }, [])
    );


  const onRefresh = () => {
    setRefreshing(true);
    fetchBookmarkedPosts();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000)
};

  const handleLikePress = async (postId: string) => {
    const user = auth.currentUser;
    if (!user) {
      alert('You need to be logged in to like posts.');
      return;
    }

    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
      const updatedPosts = [...posts];
      const isLiked = likedPosts[postId];

      if (isLiked) {
        // Unlike the post
        const likeQuery = query(collection(db, 'likes'), where('userId', '==', user.uid), where('postId', '==', postId));
        const likeSnapshot = await getDocs(likeQuery);
        if (!likeSnapshot.empty) {
          await deleteDoc(doc(db, 'likes', likeSnapshot.docs[0].id));
          const updatedLikes = updatedPosts[postIndex].likes - 1;
          updatedPosts[postIndex].likes = updatedLikes;
          setPosts(updatedPosts);
          setLikedPosts((prev) => ({ ...prev, [postId]: false }));

          // Update likes in Firestore
          const postRef = doc(db, 'posts', postId);
          await updateDoc(postRef, {
            likes: updatedLikes
          });
        }
      } else {
        // Like the post
        await addDoc(collection(db, 'likes'), {
          userId: user.uid,
          postId: postId
        });
        const updatedLikes = updatedPosts[postIndex].likes + 1;
        updatedPosts[postIndex].likes = updatedLikes;
        setPosts(updatedPosts);
        setLikedPosts((prev) => ({ ...prev, [postId]: true }));

        // Update likes in Firestore
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          likes: updatedLikes
        });
      }
    }
  };

  return (
    <View>
      <View style = {styles.header}>
        <Ionicons name="arrow-back" size={28} color="white" style = {styles.back} onPress={() => router.replace('/profile')}/>
        <Text className='text-2xl text-white font-extrabold'>Bookmarks</Text>
      </View>
      <FlatList
          data={posts}
          renderItem={({ item }: {item : any}) => (
            <View>
              <View style={styles.postContainer}>
                <TouchableOpacity onPress={() => router.push({ pathname: '/postdetails', params: item })}>
                    <Image source={{ uri: item.url }} style={styles.image} />
                </TouchableOpacity>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <TouchableOpacity onPress={() => handleLikePress(item.id)}>
                    <AntDesign
                      name={likedPosts[item.id] ? "heart" : "hearto"}
                      size={24}
                      color={likedPosts[item.id] ? "red" : "black"}
                      style={styles.heartIcon}
                    />
                    <Text>{item.likes}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )
        }
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.flatListContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
        />
      </View>
  )
}

export default Home

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: '#ed800c',
    paddingTop: 60,
    paddingLeft: 5,
    paddingBottom: 6,
  },
  back: {
    marginLeft: 5,
    marginRight: 10,
  },
  flatListContent: {
  },
  row: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  postContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 25,
    borderWidth: 0,
    width: 180,
  },
  textContainer: {
    alignItems:'center',
    width: 140,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 0
  },
  image: {
    width: 180,
    height: 240,
    borderRadius: 40,
  },
  title: {
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'left',
  },
  heartIcon: {
    
  }
})