import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useState } from 'react'

const FormField = ( {title, value, placeholder, handleChangeText, otherStyles, ...props}: 
                    {title: any, value: any, placeholder: any, handleChangeText: any, otherStyles: any} ) => {
  
  const [showPassword, setShowPassword] = useState(false)

  return (
    <View className={`space-y-2 ${otherStyles}`}>

      <Text className='font-OutfitSB text-white'>
        {title}
      </Text>

      <View className='w-5/6 h-12 rounded-full border border-white items-center flex-row mt-4 pl-5'>
        <TextInput
          className='flex-1 text-white'
          value={value}
          placeholder={placeholder}
          placeholderTextColor='white'
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
        />

        {title === 'Password' && (
          <TouchableOpacity onPress={ () => setShowPassword(!showPassword) }>
            {!showPassword ? <Text className='font-OutfitSB text-white mr-3'> Show </Text> : <Text className='font-OutfitSB text-white mr-3'> Hide </Text>} 
          </TouchableOpacity>
        ) }
      </View>
    </View>
  )
}

export default FormField