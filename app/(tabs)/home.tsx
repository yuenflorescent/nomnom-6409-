import { View, Text, SafeAreaView, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { db } from '../_layout'
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore"
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router';

const Home = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    var arr: any = []
    const q = query(
      collection(db, 'posts'), orderBy("post_time", "desc"), limit(10)
      )

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      arr.push(doc.data())
    });
    setPosts(arr)
  };

  useEffect(() => {
    fetchPosts();
  }, [])

  return (
    // <SafeAreaView>
    //   <Text className='font-Consolas font-bold text-3xl ml-7 mt-7 mb-5'>
    //     Recents
    //   </Text>

      <FlatList
          data = {posts}
          renderItem={({ item }: {item: any}) => (
              <TouchableOpacity onPress= {() => router.push({ pathname: '/postdetails', params: item })}> 
                  <View style = {styles.imageContainer}>
                    <Image source={{uri: item.url}} style = {styles.image}/>
                  </View>
                  <View style = {styles.textContainer}>
                    <Text style = {styles.title}>{item.title}</Text>
                  </View>
              </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.flatListContent}
          />
    // </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  flatListContent: {
  },
  row: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 25,
    borderWidth: 0,
    width: 180,
  },
  textContainer: {
    alignItems:'flex-start',
    width: 180,
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
})