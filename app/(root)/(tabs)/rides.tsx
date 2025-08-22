import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MapTracking from "@/components/MapTracking";

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
