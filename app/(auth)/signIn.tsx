import React, { useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'

import { icons, images } from '@/constants'
import InputField from '@/components/inputField'
import CustomButton from '@/components/customButton'
import { Link } from 'expo-router'
import OAuth from '@/components/0Auth'

const SignIn = () => {
  const [form, setForm] = useState({
      email:"",
      password: ""
    });
  
    const onSignInPress = async () => {};

  return (
    <ScrollView className='flex-1 bg-white'>
      <View className='flex-1 bg-white'>
        <View className='relative w-full h-[250px]'>
          <Image source={images.signUpCar} className='z-0 w-full h-[250px]' />
        <Text className='text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5'>Welcome</Text>
        </View>
        <View className='p-5'>
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Pasword"
            placeholder="Enter your password"
            icon={icons.lock}
            value={form.password}
            secureTextEntry={true}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <CustomButton
            title='Sign Ip'
            onPress={onSignInPress}
            className='mt-6'
          />

          <OAuth />
          
          <Link
            href="/(auth)/signUp"
            className='text-lg text-center text-general-200 mt-10'
          >
            <Text>Don't have an account? </Text>
            <Text className='text-green-500'>Sign Up</Text>
          </Link>
        </View>

      </View>
  </ScrollView>
)
}

export default SignIn