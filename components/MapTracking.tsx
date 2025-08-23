import React, { useEffect, useRef, useState } from "react";
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";

import { useUserStore, useLocationStore } from "@/store";
import { calculateRegion, generateMarkersFromData } from "@/lib/map";
import { User, MarkerData } from "@/types/type";
import { useFetch, API_BASE } from "@/lib/fetch";
import { useTrackStore } from "@/store/track";
import { SaveTrackModalOverlay } from "./SaveTrackModalOverlay";

const GOOGLE_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

export default function MapTracking() {
  const {
    data: users,
    loading: loadingUsers,
    error: usersError,
  } = useFetch<User[]>("/api/users");
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const {
    userLongitude,
    userLatitude,
    destinationLongitude,
    destinationLatitude,
  } = useLocationStore();

  const mapRef = useRef<MapView>(null);

  // --- tracking store ---
  const { isTracking, points, distanceMeters, start, stop, addPoint, reset } =
    useTrackStore();

  // --- abonnement localisation en cours ---
  const watchSub = useRef<Location.LocationSubscription | null>(null);

  // initialise tes marqueurs (comme avant)
  useEffect(() => {
    if (Array.isArray(users) && userLatitude && userLongitude) {
      setMarkers(
        generateMarkersFromData({
          data: users,
          userLatitude,
          userLongitude,
        })
      );
    }
  }, [users, userLatitude, userLongitude]);

  // région initiale (reprend ta fonction)
  const region: Region = calculateRegion({
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  }) as Region;

  // Démarrer le tracking
  const handleStart = async () => {
    // permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission localisation refusée");
      return;
    }
    reset(); // nouveau trajet
    start();

    // optionnel: prendre la position initiale immédiatement
    const cur = await Location.getCurrentPositionAsync({
      accuracy: Location.LocationAccuracy.BestForNavigation,
    });
    addPoint({
      latitude: cur.coords.latitude,
      longitude: cur.coords.longitude,
      timestamp: Date.now(),
    });

    // abonnement continu
    watchSub.current = await Location.watchPositionAsync(
      {
        accuracy: Location.LocationAccuracy.BestForNavigation,
        timeInterval: 1500, // min 1.5s
        distanceInterval: 5, // min 5 m
        mayShowUserSettingsDialog: true,
      },
      (loc) => {
        const p = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          timestamp: Date.now(),
        };
        addPoint(p);

        // suivre l’utilisateur pendant l’enregistrement
        mapRef.current?.animateCamera(
          {
            center: { latitude: p.latitude, longitude: p.longitude },
            pitch: 0,
            heading: 0,
            altitude: undefined,
            zoom: undefined,
          },
          { duration: 600 }
        );
      }
    );
  };

  // Arrêter + sauvegarder
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSaveModal = () => {
    if (isOpen) {
      setShowModal(true);
    }
  };

  const handleStop = () => {
    setShowModal(true);
    // watchSub.current?.remove();
    // watchSub.current = null;
    // stop();

    // Sauvegarde du trajet (points + distance) vers ton backend
    // try {
    //   const res = await fetch(`${API_BASE}/api/ride/track`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //     },
    //     body: JSON.stringify({
    //       startedAt: points[0]?.timestamp ?? Date.now(),
    //       endedAt: Date.now(),
    //       distanceMeters,
    //       points, // [{lat, lng, timestamp}]
    //     }),
    //   });
    //   if (!res.ok) {
    //     const text = await res.text();
    //     console.warn("Save track failed:", res.status, text);
    //     alert("Trajet arrêté. Erreur de sauvegarde.");
    //   } else {
    //     alert("Trajet sauvegardé ✅");
    //   }
    // } catch (e) {
    //   console.warn("Save track error:", e);
    //   alert("Trajet arrêté. Erreur réseau pendant la sauvegarde.");
    // }
  };

  // cleanup si on quitte l’écran en cours d’enregistrement
  useEffect(() => {
    return () => {
      watchSub.current?.remove();
      watchSub.current = null;
    };
  }, []);

  const hasUser = !!userLatitude && !!userLongitude;

  return (
    <View style={styles.container}>
      {loadingUsers && !hasUser ? (
        <View style={styles.loader}>
          <ActivityIndicator size="small" />
        </View>
      ) : null}

      {/* Message d’erreur drivers, mais on n’empêche pas la carte */}
      {usersError ? (
        <Text style={styles.warn}>Drivers: {usersError}</Text>
      ) : null}

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE} // iOS: nécessite un build avec googleMapsApiKey pour Google. Sinon Apple.
        style={styles.map}
        showsUserLocation
        initialRegion={region}
        showsPointsOfInterest={false}
        userInterfaceStyle="light"
      >
        {destinationLatitude != null && destinationLongitude != null && (
          <Marker
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="Destination"
          />
        )}

        {/* Trajet tracé */}
        {points.length > 1 && (
          <Polyline
            coordinates={points.map((p) => ({
              latitude: p.latitude,
              longitude: p.longitude,
            }))}
            strokeWidth={5}
          />
        )}
      </MapView>

      {/* Barre de contrôle */}
      <View style={styles.controls}>
        <View style={styles.stats}>
          <Text style={styles.statText}>
            {(distanceMeters / 1000).toFixed(2)} km
          </Text>
          <Text style={styles.statSub}>{points.length} points</Text>
        </View>

        {!isTracking ? (
          <TouchableOpacity
            style={[styles.btn, styles.btnStart]}
            onPress={handleStart}
          >
            <Text style={styles.btnText}>Démarrer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.btn, styles.btnStop]}
            onPress={handleStop}
          >
            <Text style={styles.btnText}>Arrêter</Text>
          </TouchableOpacity>
        )}
      </View>
      {showModal && (
        <SaveTrackModalOverlay
          visible={showModal}
          onClear={() => !showModal}
          onClose={() => !setShowModal}
          onSave={() => console.log("saved")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  loader: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 8,
    borderRadius: 8,
  },
  warn: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: "rgba(255,220,220,0.95)",
    padding: 8,
    borderRadius: 8,
  },
  controls: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stats: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
  },
  statText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  statSub: { color: "#fff", opacity: 0.8, marginTop: 2, fontSize: 12 },
  btn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 },
  btnStart: { backgroundColor: "#0a7" },
  btnStop: { backgroundColor: "#d33" },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
