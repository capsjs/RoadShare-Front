import React, { useState } from 'react'
import { Alert, Image, ScrollView, Text, Touchable, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import {Link, useRouter } from 'expo-router'
import { ReactNativeModal } from 'react-native-modal'

import { icons, images } from '@/constants'
import InputField from '@/components/inputField'
import CustomButton from '@/components/customButton'
import OAuth from '@/components/0Auth'

const SignUp = () => {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email:"",
    password: ""
  });

  const [verification, setVerification] = useState({
    state: 'default',
    error: '',
    code: ''
  })

  //Handle submission of sign-up form
  const onSignUpPress = async () => {
    if(!isLoaded) return
    //Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      })

      //Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      
      //Set 'pendingVerification' to true to display second form 
      //and capture OTP code
      setVerification({
        ...verification,
        state: 'pending'
      })
    } catch (error: any) {
      Alert.alert("Error", error.errors[0].longMessage)
    }
  };

  //Handle submission of verification form
  const onPressVerify = async () => {
    if (!isLoaded) return

    try {
      //Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });
      //If verification was completed, set the session to active
      //and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        setVerification({ 
          ...verification,
           state: "success"
        });
      } else {
        //If the status is not compltete, check why. User may need to
        //complete futher steps
        setVerification({ 
          ...verification,
           state: "failed",
           error: "Verification failed"
        });
      }
       
    } catch (err: any) {
      setVerification({ 
        ...verification,
        error: err.errors[0].longMessage,
        state: "failed",
      });
      console.error(JSON.stringify(err, null, 2))
    }
  };

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
            autoCapitalize="none"
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
            onPress={onSignUpPress}
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

        <ReactNativeModal isVisible={verification.state === 'pending'}
          onModalHide={() => { 
            if (verification.state === 'success') setShowSuccessModal(true)}
          }
        >
          <View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]'>
            <Text className='text-2xl font-JakartaExtraBold mb-2'>
              Verification
            </Text>
            <Text className='font-Jakarta mb-5'>
              We've sent a verification code to {form.email}
            </Text>
            <InputField 
              label='Code'
              icon={icons.lock} 
              placeholder='12345' 
              value={verification.code} 
              keyboardType='numeric'
               onChangeText={(code) =>
                 setVerification({ ...verification, code })}
            />
            {verification.error && (
              <Text className='text-red-500 text-sm mt-1'>
                {verification.error}
              </Text>
            )}
            <CustomButton 
              title='Verify Email'
              onPress={onPressVerify}
              className='mt-5 bg-green-500'
             />
          </View>
        </ReactNativeModal>

        <ReactNativeModal isVisible={showSuccessModal}>
          <View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]'>
            <Image
              source={images.check}
              className='w-[110px] h-[110px] mx-auto my-5'
            />
            <Text className='text-3xl font-JakartaBold text-center'>Verified</Text>
            <Text className='text-base text-gray-400 font-Jakarta text-center mt-2'>You have successfully verified your account.</Text>
            <CustomButton
              title='Browse Home'
              className='mt-5'
              onPress={() => router.push('/(root)/(tabs)/home')}
            />
          </View>
        </ReactNativeModal>

      </View>
    </ScrollView>
  )
}

export default SignUp