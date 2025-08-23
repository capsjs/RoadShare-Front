import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SignedIn, useAuth, useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import GoogleTextInput from "@/components/GoogleTextInput";
import RideCard from "@/components/RideCard";
import Map from "@/components/Map";
import { useLocationStore } from "@/store";
import { icons, images } from "@/constants";
import CustomPlacesInput from "@/components/CustomPlacesInput";
import { useFetch, type Ride } from "@/lib/fetch";

const Home = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/signIn");
  };

  // const health = useFetch<{ ok: boolean }>("/api/health");
  // console.log("health", health.data, health.error);
  const { data, loading, error } = useFetch<Ride[]>("/api/rides");
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const [haspermissions, setHasPermissions] = useState<boolean>(false);

  // if (loading)
  //   return (
  //     <View className="flex-1 items-center justify-center">
  //       <ActivityIndicator />
  //     </View>
  //   );
  // if (error)
  //   return (
  //     <View className="p-4">
  //       <Text>Erreur: {error}</Text>
  //     </View>
  //   );

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermissions(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        // latitude: 48.866667,
        // longitude: 2.333333,
        address: `${address[0].name}, ${address[0].region}`,
      });
    };
    requestLocation();
  }, []);

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);
    router.push("/(root)/find-ride");
  };

  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.ride_id}
        renderItem={({ item }) => <RideCard ride={item} />}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        //Define what an emty list should look like (loading for example)
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="Aucune recherche associée"
                  resizeMode="contain"
                />
                <Text className="text-sm">Aucune recherche associée</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-xl font-JakartaExtraBold">
                Bienvenue {user?.name}👋
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="justify-center items-center w-10 h-10  rounded-full bg-white"
              >
                <Image source={icons.out} className="w-4 h-4" />
              </TouchableOpacity>
            </View>

            {/* <GoogleTextInput
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300"
              handlePress={handleDestinationPress}
            /> */}
            <CustomPlacesInput onSelect={handleDestinationPress} />

            <>
              <Text className="text-xl font-JakartaBold mt-5 mb-3">
                Ma position
              </Text>
              <View className="flex flex-row items-center bg-transparent h-[300px]">
                <Map />
              </View>
            </>
            <View className="flex flex-row justify-between">
              <Text className="text-xl font-JakartaBold mt-5 mb-3">
                Nouveaux trajets
              </Text>
              <Text className="text-xl font-JakartaBold mt-5 mb-3">
                Filtrer
              </Text>
            </View>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
