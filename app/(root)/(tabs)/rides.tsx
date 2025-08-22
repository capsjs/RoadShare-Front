import Map from "@/components/Map";
import MapTracking from "@/components/MapTracking";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Rides = () => {
  return (
    <SafeAreaView>
      <View className="flex flex-row items-center bg-transparent h-[98%]">
        <MapTracking />
      </View>
    </SafeAreaView>
  );
};

export default Rides;
