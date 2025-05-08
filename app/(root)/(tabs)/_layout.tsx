import React from 'react'
import { Tabs } from "expo-router"
import { Image, ImageSourcePropType, View } from "react-native";

import { icons } from "@/constants";

const TabIcon = ({
  source,
  focused,
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) => (

  <View className={`flex flex-row justify-center rounded-full w-12 h-12 items-center ${focused ? "bg-pink-600" : ""}`}>
    <Image
      source={source}
      tintColor="white"
      resizeMode="contain"
      className="w-7 h-7"
    />
  </View>
);
  
export default function Layout () {
  return (
    <Tabs
    initialRouteName="home"
    screenOptions={{
      tabBarActiveTintColor: "white",
      tabBarInactiveTintColor: "white",
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: "#333333",
        borderRadius: 50,
        overflow: "hidden",
        marginHorizontal: 20,
        marginBottom: 20,
        height: 60,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
      },
    }}
  >
      <Tabs.Screen
        name='home'
        options={{
          title: "home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.home} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='rides'
        options={{
          title: "rides",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.list} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='chat'
        options={{
          title: "chat",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.chat} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: "profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.profile} focused={focused} />
          ),
        }}
      />
    </Tabs>
  )
};