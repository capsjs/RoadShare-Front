import React, { useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'

import { icons, images } from '@/constants'
import InputField from '@/components/inputField'
import CustomButton from '@/components/customButton'
import { Link } from 'expo-router'
import OAuth from '@/components/0Auth'

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email:"",
    password: ""
  });

  const onSignPress = async () => {};

  return (
    <ScrollView className='flex-1 bg-white'>
      <View className='flex-1 bg-white'>
        <View className='relative w-full h-[250px]'>
          <Image source={images.signUpCar} className='z-0 w-full h-[250px]' />
        <Text className='text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5'>Create your account</Text>
        </View>
        <View className='p-5'>
          <InputField
            label="Name"
            placeholder="Enter your name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
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
            title='Sign Up'
            onPress={onSignPress}
            className='mt-6'
          />

          <OAuth />
          
          <Link
            href="/(auth)/signIn"
            className='text-lg text-center text-general-200 mt-10'
          >
            <Text>Already have an account? </Text>
            <Text className='text-green-500'>Log In</Text>
          </Link>
        </View>

        {/*Verification Modal */}

      </View>
    </ScrollView>
  )
}

export default SignUp