import { View, Text, SafeAreaView, Image, FlatList } from 'react-native'
import { db } from '../_layout'
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore"
import React, { useEffect, useState } from 'react'

const Home = () => {
  const [posts, setPosts] = useState([])

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
    <SafeAreaView>
      <Text className='font-Consolas font-bold text-3xl ml-7 mt-7 mb-5'>
        Recents
      </Text>

      <FlatList
      data={posts} 
      renderItem={({item}: {item: any}) => (
        <View className='flex-1'>
           <Image
           className='w-1/3 h-full rounded-xl'
            source={{uri: item.url}}
          />
          <Text>
            {item.title}
          </Text>
        </View>
      )}
      />
    </SafeAreaView>
  )
}

export default Home