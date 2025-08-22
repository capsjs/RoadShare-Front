import { useUser } from "@clerk/clerk-expo";
import { Image, Text, TouchableOpacity, View } from "react-native";

import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { useDriverStore, useLocationStore } from "@/store";

const BookRide = () => {
  const { user } = useUser();
  const { userAddress, destinationAddress } = useLocationStore();
  const { drivers, selectedDriver } = useDriverStore();

  const driverDetails = drivers?.filter(
    (driver) => +driver.id === selectedDriver
  )[0];

  console.log({ drivers }, { selectedDriver });

  return (
    <RideLayout title="Trajet sélectionné">
      <>
        <Text className="text-xl font-JakartaSemiBold mb-3">
          Information trajet
        </Text>

        <View className="flex flex-col w-full items-center justify-center mt-10">
          <Image
            source={{ uri: driverDetails?.car_image_url }}
            className="w-28 h-28 rounded-full"
          />
          <Text>Photo de profil</Text>
          <Text className="text-lg font-JakartaRegular">
            Conducteur: {driverDetails?.title}
          </Text>
        </View>

        <View className="flex flex-col w-full items-start justify-center py-3 px-5 rounded-3xl bg-general-600 mt-5">
          <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
            <Text className="text-lg font-JakartaRegular">Temps de trajet</Text>
            <Text className="text-lg font-JakartaRegular">
              {formatTime(driverDetails?.time!)}
            </Text>
          </View>
        </View>

        <View className="flex flex-col w-full items-start justify-center mt-5">
          <View className="flex flex-row items-center justify-start mt-3 border-t border-b border-general-700 w-full py-3">
            <Image source={icons.to} className="w-6 h-6" />
            <Text className="text-lg font-JakartaRegular ml-2">
              {userAddress}
            </Text>
          </View>

          <View className="flex flex-row items-center justify-start border-b border-general-700 w-full py-3">
            <Image source={icons.point} className="w-6 h-6" />
            <Text className="text-lg font-JakartaRegular ml-2">
              {destinationAddress}
            </Text>
          </View>

          <View className="flex flex-col w-full items-start justify-center py-3 px-5 rounded-3xl bg-general-600 mt-5">
            <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
              <Text className="text-lg font-JakartaRegular">Description</Text>
              <Text className="text-lg font-JakartaRegular">21 obstacles</Text>
            </View>
          </View>
        </View>

        <View>
          <TouchableOpacity
            className="bg-blue-600 py-3 px-5 rounded-full w-full items-center justify-center mt-10"
            onPress={() => console.log("Démarrer")}
          >
            <Text className="text-white text-lg font-JakartaSemiBold">
              Démarrer
            </Text>
          </TouchableOpacity>
        </View>
      </>
    </RideLayout>
  );
};

export default BookRide;
