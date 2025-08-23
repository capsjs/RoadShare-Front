import { User, MarkerData } from "@/types/type";

const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

export const generateMarkersFromData = ({
  data,
  userLatitude,
  userLongitude,
}: {
  data: User[];
  userLatitude: number;
  userLongitude: number;
}): MarkerData[] => {
  return data.map((user) => {
    const latOffset = (Math.random() - 0.5) * 0.01;
    const lngOffset = (Math.random() - 0.5) * 0.01;

    return {
      // ✅ d’abord le driver, ensuite on impose les champs de Marker
      ...user,
      latitude: userLatitude + latOffset,
      longitude: userLongitude + lngOffset,
      title: `${user.name}`,
    };
  });
};

export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
}) => {
  if (!userLatitude || !userLongitude) {
    return { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.01, longitudeDelta: 0.01 };
  }
  if (!destinationLatitude || !destinationLongitude) {
    return { latitude: userLatitude, longitude: userLongitude, latitudeDelta: 0.01, longitudeDelta: 0.01 };
  }
  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  const latitudeDelta = Math.max((maxLat - minLat) * 1.3, 0.01);
  const longitudeDelta = Math.max((maxLng - minLng) * 1.3, 0.01);

  return {
    latitude: (userLatitude + destinationLatitude) / 2,
    longitude: (userLongitude + destinationLongitude) / 2,
    latitudeDelta,
    longitudeDelta,
  };
};

export const calculateDriverTimes = async ({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  markers: MarkerData[];
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
}) => {
  if (!userLatitude || !userLongitude || !destinationLatitude || !destinationLongitude) return;
  if (!directionsAPI) {
    console.warn("EXPO_PUBLIC_DIRECTIONS_API_KEY manquante, skip times.");
    return markers;
  }

  try {
    const timesPromises = markers.map(async (marker) => {
      const toUserRes = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${marker.latitude},${marker.longitude}&destination=${userLatitude},${userLongitude}&key=${directionsAPI}`
      );
      const toUser = await toUserRes.json();
      const timeToUser = toUser?.routes?.[0]?.legs?.[0]?.duration?.value ?? 0;

      const toDestRes = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=${destinationLatitude},${destinationLongitude}&key=${directionsAPI}`
      );
      const toDest = await toDestRes.json();
      const timeToDestination = toDest?.routes?.[0]?.legs?.[0]?.duration?.value ?? 0;

      const totalTime = (timeToUser + timeToDestination) / 60; // minutes
      const price = (totalTime * 0.5).toFixed(2);

      return { ...marker, time: totalTime, price };
    });

    return await Promise.all(timesPromises);
  } catch (error) {
    console.error("Error calculating driver times:", error);
    return markers; // ne bloque pas l’UI
  }
};
