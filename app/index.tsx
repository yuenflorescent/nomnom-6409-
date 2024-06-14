import { Text, Image, View } from "react-native";
import { SafeAreaView, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link, Redirect, router } from "expo-router";
import  CustomButton from "../components/CustomButton";

export default function App() {
  return (
    <SafeAreaView className="bg-primary h-full">
      
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View className="h-full w-full items-center justify-center min-h-[90vh]">

          <Image
            source={require('../assets/Banhmi_2.png')}
            className="w-full h-[250px] mt-40"
            resizeMode="contain"
          />


          <View className="mt-20">
            <Text className="text-3xl font-Consolas font-semibold text-white">
              welcome, fellow nommer
            </Text>
          </View>

          {/* <Link href="home" style={{ color: 'white' }}>Link to Home Screen</Link> */}

          <View className="flex-row">
            <CustomButton 
              title="Log In"
              handlePress={() => { router.push('/loginscreen')} }
              containerStyles="bg-white w-[140px] mt-7 mr-5"
              textStyles={`text-l text-primary`}
              isLoading={undefined}          
            />

            <CustomButton 
              title="Sign Up"
              handlePress={() => { router.push('/registerscreen')} }
              containerStyles="bg-white w-[140px] mt-7"
              textStyles={`text-l text-primary`}
              isLoading={undefined}          
            />
          </View>

          <StatusBar
            backgroundColor="#040303"
            style="light" 
          />
        
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 24,
//   },
//   main: {
//     flex: 1,
//     justifyContent: "center",
//     maxWidth: 960,
//     marginHorizontal: "auto",
//   },
//   title: {
//     fontSize: 32,
//     alignItems: "center",
//     fontWeight: "bold",
//   },
//   subtitle: {
//     fontSize: 36,
//     color: "#38434D",
//   },
// });
