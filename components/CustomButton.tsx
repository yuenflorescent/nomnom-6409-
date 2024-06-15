import { TouchableOpacity, View, Text } from 'react-native'
import React from 'react'

const CustomButton = ( {title, handlePress, containerStyles, textStyles, isLoading}: 
                      {title:any, handlePress: any, containerStyles: any, textStyles: any, isLoading:any} ) => {
  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
      // in this case, we are using template literals (`...`)
      className={`min-h-[50px] min-w-[30px] rounded-full items-center justify-center
                  ${containerStyles} ${isLoading ? 'opacity-50': ''}`}
      disabled={isLoading}
    >
      <Text className={`font-OutfitSB ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}
 
export default CustomButton
