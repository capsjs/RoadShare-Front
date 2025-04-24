import { View, Text, Image } from 'react-native'
import React from 'react'

import CustomButton from './customButton'
import { icons } from '@/constants'

const OAuth = () => (
    <View>
      <View className='flex flex-row justify-center items-center mt-4 gap-x-3'>
        <View className='flex-1 h-[1px] bg-pink-500' />
        <Text className='text-lg'>Or</Text>
        <View className='flex-1 h-[1px] bg-pink-500' />
      </View>
      <CustomButton
        title='Log In with Google'
        className='mt-5 w-full shadow-none'
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className='w-5 h-5 mx-2'
          />
        )}
      />
    </View>
  );

export default OAuth