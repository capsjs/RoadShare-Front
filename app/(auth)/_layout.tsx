import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

const Layout = () => {
  const { isSignedIn } = useAuth();

  if(isSignedIn) {
    return <Redirect href={'/(root)/(tabs)/home'} />
  };
 
  return (
      <Stack>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />  
        <Stack.Screen name="signUp" options={{ headerShown: false }} />  
        <Stack.Screen name="signIn" options={{ headerShown: false }} />  
      </Stack>
  );
};

export default Layout;