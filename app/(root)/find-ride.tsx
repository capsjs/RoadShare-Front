import { Text, View } from "react-native"

import { useLocationStore } from "@/store";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import GoogleTextInput from "@/components/GoogleTextInput";
import CustomButton from "@/components/customButton";
import { router } from "expo-router";

const FindRide = () => {
  const { 
    userAddress,
    setDestinationLocation,
    destinationAddress,
    setUserLocation
  } = useLocationStore();

  return (
    <RideLayout title="Trajets">
      <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold mb-3">De</Text>
        <GoogleTextInput
          icon={icons.target}
          initialLocation={userAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="#f5f5f5"
          handlePress={(location) => setUserLocation(location)}
        />
      </View>

      <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold mb-3">A</Text>
        <GoogleTextInput
          icon={icons.map}
          initialLocation={destinationAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="transparent"
          handlePress={(location) => setDestinationLocation(location)}
        />
      </View>

      <CustomButton 
        title="Rechercher" 
        onPress={()=> router.push('/(root)/confirm-ride')}
        className="mt-5"
      />
    </RideLayout>
  )
};

export default FindRide;