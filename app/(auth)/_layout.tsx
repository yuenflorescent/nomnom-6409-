import { View, Text } from 'react-native'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="loginscreen"
          options={{
            headerShown: false
          }}
        />

        <Stack.Screen
          name="registerscreen"
          options={{
            headerShown: false
          }}
        /> 
      </Stack>
    </>
  )
}

export default AuthLayout