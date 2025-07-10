import { Text, View } from "react-native"

import { useLocationStore } from "@/store";

const FindRide = () => {
  const { 
    userAddress,
    setDestinationLocation,
    destinationAddress,
    setUserLocation
  } = useLocationStore();

  return (
    <View>
      <Text>I am here: {userAddress}</Text>
      <Text>I go: {destinationAddress}</Text>
    </View>
  )
};

export default FindRide;