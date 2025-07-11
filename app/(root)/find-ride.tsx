import { Text, View } from "react-native"

import { useLocationStore } from "@/store";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import CustomPlacesInput from "@/components/CustomPlacesInput";

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
        <CustomPlacesInput
          icon={icons.target}
          initialLocation={userAddress!}
          onSelect={(location: any) => {setUserLocation(location)}}
        />
      </View>
      <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold mb-3">A</Text>
        <CustomPlacesInput
          icon={icons.target}
          initialLocation={destinationAddress!!}
          onSelect={(location: any) => {setDestinationLocation(location)}}
        />
      </View>
    </RideLayout>
  )
};

export default FindRide;