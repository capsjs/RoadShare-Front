import React from 'react'
import { Text, View } from 'react-native'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'

const Home = () => {
  const { user } = useUser();

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      </SignedIn>
      <SignedOut>
        <Link href="/signIn">
        <Text>Sign In</Text>
        </Link>
        <Link href="/signUp">
        <Text>Sign Up</Text>
        </Link>
      </SignedOut>
      <Text>Home</Text>
    </View>
  )
}

export default Home