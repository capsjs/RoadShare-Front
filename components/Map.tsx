import MapView, { PROVIDER_DEFAULT } from "react-native-maps";
import { StyleSheet } from 'react-native';

import { useLocationStore } from "@/store";
import { calculateRegion } from "@/lib/map";

  const Map = () => {
  const { userLongitude, userLatitude, destinationLongitude, destinationLatitude } = useLocationStore();

  const region = calculateRegion({
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  });

  return (
    <MapView
      provider={PROVIDER_DEFAULT} 
      style={styles.map}
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      showsUserLocation={true}
      userInterfaceStyle="light"
      initialRegion={region}
    >
    </MapView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default Map;