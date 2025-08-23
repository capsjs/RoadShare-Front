import { create } from "zustand";

import { UserStore, LocationStore, MarkerData } from "@/types/type";

export const useLocationStore = create<LocationStore>((set) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    }));

    // if user is selected and now new location is set, clear the selected user
    const { selectedUser, clearSelectedUser } = useUserStore.getState();
    if (selectedUser) clearSelectedUser();
  },

  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
      destinationAddress: address,
    }));

    // if driver is selected and now new location is set, clear the selected driver
    const { selectedUser, clearSelectedUser } = useUserStore.getState();
    if (selectedUser) clearSelectedUser();
  },
}));

export const useUserStore = create<UserStore>((set) => ({
  users: [] as MarkerData[],
  selectedUser: null,
  setSelectedUser: (userId: number) =>
    set(() => ({ selectedUser: userId })),
  setUsers: (users: MarkerData[]) => set(() => ({ users })),
  clearSelectedUser: () => set(() => ({ selectedUser: null })),
}));