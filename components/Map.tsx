// Map.tsx
import { useEffect, useState } from "react";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { useDriverStore, useLocationStore } from "@/store";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { Driver, MarkerData } from "@/types/type";
import { useFetch } from "@/lib/fetch";

// ✅ endpoint sans parenthèses + laisse useFetch préfixer avec API_BASE
const Map = () => {
  const {
    data: drivers,
    loading,
    error,
  } = useFetch<Driver[]>("/api/ride/driver");
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const {
    userLongitude,
    userLatitude,
    destinationLongitude,
    destinationLatitude,
  } = useLocationStore();
  const { setDrivers } = useDriverStore();

  useEffect(() => {
    if (Array.isArray(drivers) && userLatitude && userLongitude) {
      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });
      setMarkers(newMarkers);
    }
  }, [drivers, userLatitude, userLongitude]);

  useEffect(() => {
    if (
      markers.length > 0 &&
      destinationLatitude != null &&
      destinationLongitude != null &&
      userLatitude &&
      userLongitude
    ) {
      calculateDriverTimes({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      }).then((driversWithTimes) => {
        if (driversWithTimes) setDrivers(driversWithTimes as MarkerData[]);
      });
    }
  }, [markers, destinationLatitude, destinationLongitude]);

  const region = calculateRegion({
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  });

  if (loading || (!userLatitude && !userLongitude)) {
    return (
      <View className="flex justify-between items-center w-full">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }

  // ❌ Ne pas bloquer l’UI — affiche la carte même si drivers en erreur
  // (Tu peux overlay un petit message si tu veux)
  return (
    <View style={styles.container}>
      {error ? (
        <Text style={{ position: "absolute", top: 8, left: 8, zIndex: 10 }}>
          Drivers: {error}
        </Text>
      ) : null}
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        mapType="mutedStandard"
        showsPointsOfInterest={false}
        showsUserLocation={true}
        userInterfaceStyle="light"
        initialRegion={region}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
});

export default Map;
