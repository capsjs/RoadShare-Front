import MapView, { PROVIDER_DEFAULT } from "react-native-maps";
import { StyleSheet } from 'react-native';


const Map = () => {
  return (
    <MapView
      provider={PROVIDER_DEFAULT} 
      style={styles.map}
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      showsUserLocation={true}
      userInterfaceStyle="light"
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