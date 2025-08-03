import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import { DriverCardProps } from "@/types/type";
import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";

const DriverCard = ({ item, selected, setSelected }: DriverCardProps) => {
  return (
    <TouchableOpacity
      onPress={setSelected}
      className={`${
        selected === item.id ? "bg-purple-500" : "bg-red-700"
      } flex flex-row items-center justify-between py-5 px-3 rounded-xl`}
    >
      <Image
        source={{ uri: item.car_image_url }}
        className="h-14 w-14"
        resizeMode="contain"
      />

      <View className="flex-1 flex flex-col items-start justify-center mx-3">
        <View className="flex flex-row items-center justify-start mb-1">
          <Text className="text-lg font-JakartaMedium">{item.title}</Text>

          <View className="flex flex-row items-center space-x-1 ml-2">
            <Image source={icons.star} className="w-3 h-3.5" />
            <Text className="text-sm font-JakartaMedium">4</Text>
          </View>
        </View>

        <View className="flex flex-row items-center justify-start">
          <View className="flex flex-row items-center">
            <Image source={icons.point} className="w-4 h-4" />
            <Text className="text-sm font-JakartaMedium ml-1">temps</Text>
          </View>

          <Text className="text-sm text-black font-JakartaMedium text-general-800 mx-1">
            |
          </Text>

          <Text className="text-sm text-black font-JakartaMedium">
            {formatTime(item.time!)}
          </Text>

          <Text className="text-sm text-black font-JakartaMedium text-general-800 mx-1">
            |
          </Text>

          <Text className="text-sm text-black font-JakartaMedium">
            {item.rating} distance
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DriverCard;
