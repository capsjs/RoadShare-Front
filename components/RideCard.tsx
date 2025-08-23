import { View, Text, Image } from "react-native";
import React from "react";
import { Ride } from "@/lib/fetch";
import { icons } from "@/constants";
import { formatDate, formatTime } from "@/lib/utils";

// util petit calcul de distance (km)
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.asin(Math.sqrt(a)));
}

const RideCard = ({ ride }: { ride: Ride }) => {
  const km = haversineKm(
    ride.origin_latitude,
    ride.origin_longitude,
    ride.destination_latitude,
    ride.destination_longitude
  ).toFixed(1);

  return (
    <View className="flex flex-row items-center justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 mb-3">
      <View className="flex flex-col items-center justify-center p-3">
        <View className="flex flex-row items-center justify-between">
          <Image
            source={{
              uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${ride.destination_longitude},${ride.destination_latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
            }}
            className="w-[80px] h-[90px] rounded-lg"
          />
          <View className="flex flex-col mx-5 gap-y-5 flex-1">
            <View className="flex flex-row items-center gap-x-2">
              <Image source={icons.to} className="w-5 h-5" />
              <Text className="text-md font-JakartaMedium" numberOfLines={1}>
                {ride.origin_address}
              </Text>
            </View>

            <View className="flex flex-row items-center gap-x-2">
              <Image source={icons.point} className="w-5 h-5" />
              <Text className="text-md font-JakartaMedium" numberOfLines={1}>
                {ride.destination_address}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex flex-col w-full mt-5 bg-general-500 rounded-lg p-3 items-start justify-center">
          <View className="flex flex-row items-center w-full justify-between mb-5">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Temps
            </Text>
            <Text className="text-md font-JakartaMedium text-gray-500">
              {formatTime(ride.ride_time)}
            </Text>
          </View>

          <View className="flex flex-row items-center w-full justify-between mb-5">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Distance
            </Text>
            <Text className="text-md font-JakartaMedium text-gray-500">
              {km} km
            </Text>
          </View>

          <View className="flex flex-row items-center w-full justify-between mb-5">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Publié le
            </Text>
            <Text className="text-md font-JakartaMedium text-gray-500">
              {formatDate(ride.created_at)}
            </Text>
          </View>

          <View className="flex flex-row items-center w-full justify-between mb-1">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Nom utilisateur
            </Text>
            <View className="flex-row items-center gap-x-2">
              <Text className="text-md font-JakartaMedium text-gray-500">
                {ride.user?.name ?? "—"}
              </Text>
              {ride.user?.car_image_url ? (
                <Image
                  source={{ uri: ride.user.car_image_url }}
                  className="w-6 h-6 rounded-full"
                />
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RideCard;
