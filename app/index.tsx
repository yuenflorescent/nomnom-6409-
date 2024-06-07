import { Text, Image, View } from "react-native";
import { SafeAreaView } from "react-native";

export default function App() {
  return (
    <SafeAreaView className="bg-primary h-full">

        <View className="h-full w-full items-center justify-center">

          <View className="mb-40">
            <Text className="text-xl font-OutfitSB text-white">
              welcome, fellow nommer
            </Text>
          </View>

          <Image
          source={require('../assets/logo_2.png')}
          className="max-w-[340px] w-full h-[100px]"
          resizeMode="contain"
          />
        
        </View>


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
