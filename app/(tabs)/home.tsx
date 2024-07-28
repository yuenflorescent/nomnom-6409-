import { View, Text, ScrollView, Image, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native'
import { db, auth } from '../_layout'
import { collection, query, getDocs, orderBy, limit, doc, addDoc, deleteDoc, updateDoc, where, getDoc } from "firebase/firestore"
import React, { useEffect, useState } from 'react'
import { router, Link, useFocusEffect } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import SearchBar from '../../components/SearchBar';

// Define the Post type
interface Post {
  id: string;
  url: string;
  title: string;
  likes: number;
  hashtags: string[];
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

  const fetchPosts = async () => {
    const arr: any = []
    const q = query(
      collection(db, 'posts'), orderBy("post_time", "desc"), limit(10)
    )

    const querySnapshot = await getDocs(q);
    const hashtagQuery: {hashtag: string, postnumber: number}[] = []

    querySnapshot.forEach( async (doc) => {
      arr.push({ id: doc.id, ...doc.data() });
      const dRef = doc.ref
      const dSnap = await getDoc(dRef);
      const hashtagArr: string[] = dSnap.get("hashtags");
      const numofHashtags = hashtagArr.length;

      // checking if there are any hashtags
      if (numofHashtags > 0) {
        for (let i=0; i < numofHashtags; i++) {
          const curr = hashtagArr[i];
          if (!(hashtagQuery.some(({hashtag}) => hashtag == curr))) {
            hashtagQuery.push({hashtag: curr, postnumber: 1});
          }
          else {
            const currObject = hashtagQuery[hashtagQuery.findIndex(x => x.hashtag === curr)];
            currObject.postnumber = currObject.postnumber + 1;
          }
        }
      }

      const sortedQuery = hashtagQuery.sort((x, y) => {
        if (x.postnumber > y.postnumber) { return 1 }
        else if (x.postnumber < y.postnumber) { return -1 }
        else { return 0 }
      })
      if (sortedQuery.length > 10) {
        sortedQuery.slice(0, 9);
      }
      const finalQuery = sortedQuery.map(x => x.hashtag)

      // // const ind: number = arr.findIndex((p: { id: string; }) => p.id === doc.id)
      // updateDoc(doc.ref, {
      //   hashtags: [],
      // })
      setHashtags(finalQuery);
    });
    setPosts(arr)

    // Fetch liked posts
    if (auth.currentUser) {
      const likesQuery = query(collection(db, 'likes'), where('userId', '==', auth.currentUser.uid));
      const likesSnapshot = await getDocs(likesQuery);
      const likedPosts: { [key: string]: boolean } = {};
      likesSnapshot.forEach((doc) => {
        likedPosts[doc.data().postId] = true;
      });
      setLikedPosts(likedPosts);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [])

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
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
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }: { item: any }) => (
          <View>
            <View style={styles.postContainer}>
              <TouchableOpacity onPress={() => router.push({ pathname: '/postdetails', params: item })}>
                <Image source={{ uri: item.url }} style={styles.image} />
              </TouchableOpacity>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <TouchableOpacity onPress={() => handleLikePress(item.id)}>
                  <View style = {styles.heartAndLikes}>
                  <AntDesign
                    name={likedPosts[item.id] ? "heart" : "hearto"}
                    size={24}
                    color={likedPosts[item.id] ? "red" : "black"}
                    style={styles.heartIcon}
                  />
                  <Text>{item.likes}</Text>
                  </View>
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
        ListHeaderComponent={() => (
          <View>
            <SearchBar initialQuery={''} />
            <Text className='font-Monaco font-bold text-3xl px-4 mt-5'>
                  Popular
            </Text>
            <FlatList
              horizontal
              data={hashtags}
              renderItem={({item} : {item: string}) => (
                <View className='justify-start ml-4'>
                  <TouchableOpacity 
                  onPress={() => {
                    router.push({pathname: '/hashtag/[tag]', params: {tag: item}});
                  }}
                  className='rounded-full bg-zinc-300 bg-contain mt-6 mr-2 mb-3 size-auto'
                  style={styles.hashtagBorder}
                  >
                    <Text className='text-center' style={styles.hashtagText}>
                      {(item.length <= 15) ? (
                        item
                      ) : (
                        item.substring(0, 12).concat('...')
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              // ListHeaderComponent= {() => (
              //   <Text className='font-Monaco font-bold text-3xl px-4 mt-5'>
              //     Popular
              //   </Text>
              // )}
              // numColumns={4}
            />
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    marginBottom: 100,
  },
  flatListContent: {
  },
  hashtagBorder: {
    borderWidth: 9,
    borderColor: 'rgb(212 212 216)',
  },
  hashtagText: {
    color: 'rgb(30 58 138)',
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
    alignItems: 'center',
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
  heartAndLikes: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  heartIcon: {
  }
})