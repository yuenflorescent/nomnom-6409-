import { Image, View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'

// importing the search bar
import SearchBar from '../../components/SearchBar'

// Importing FireBase
import { db } from "../_layout"
import { collection, getDocs, query, where } from "firebase/firestore";

interface Post {
  id: string;
  url: string;
  title: string;
  likes: number;
}

const postsRef = collection(db, "posts")


const Search = () => {
  const {userQuery} = useLocalSearchParams<{userQuery: string}>();
  const [posts, setPosts] = useState<Post[]>([]);

  const searchPosts = async (input:any) => {
    const arr: any = []
    // will need to implement a more complex variant of <where("title", "<=", input + "\uf8ff")>
    const q = query(postsRef, where("title", ">=", input));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      arr.push({ id: doc.id, ...doc.data()})
    });
    setPosts(arr)
  }
  
  useEffect(() => {
    searchPosts(userQuery)
  }, [userQuery])
  
  return (
    <FlatList
    data={posts}
    renderItem={({ item }: { item: any }) =>(
      <TouchableOpacity 
        onPress={() => router.replace({ pathname: '/postdetails', params: item })}>
        <View className='flex-row mb-5 p-3 items-center'>
          <Image source={{uri: item.url}} className='h-24, w-24 rounded-xl py-12'/>
          <Text className='font-Consolas font-medium ml-3'> {item.title} </Text>
        </View>
      </TouchableOpacity>
    )}
    ListHeaderComponent={() => 
      <>
        <View className='flex mt-2 mb-10'>
        <SearchBar initialQuery = {userQuery} />
        <Text className='font-Monaco font-bold text-3xl mt-6 px-4'> 
          Search Results For {userQuery}:
        </Text>
        </View>
      </>
    }
    ListEmptyComponent={() => (
      <Text>No Posts Found...</Text>
    )}
    />
  )
}

export default Search