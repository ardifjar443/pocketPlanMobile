import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import KategoriPendapatanScreen from "./KategoriPendapatanScreen";
import KategoriPengeluaranScreen from "./KategoriPengeluaranScreen";
import { Ionicons } from "@expo/vector-icons";
import { enableScreens } from "react-native-screens";

// Aktifkan optimisasi layar
enableScreens();

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const CustomHeader = ({ activeTab, onTabPress }) => (
  <View className="pt-12 bg-[#FFFFFE] ">
    <View className="p-2 flex flex-row items-center gap-2">
      <Text className="text-3xl font-bold w-3/4">Kategori</Text>
    </View>
  </View>
);

const HomeKategori = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Pendapatan");

  const onTabPress = (tabName) => {
    setActiveTab(tabName);
    // Use navigation to navigate to the correct tab within the Tab.Navigator
    if (tabName === "Pendapatan" || tabName === "Penghasilan") {
      navigation.navigate(tabName); // Navigate to the Tab.Screen
    }
  };

  return (
    <View className="bg-[#E3F6F5] flex-1">
      <CustomHeader activeTab={activeTab} onTabPress={onTabPress} />
      <Tab.Navigator
        initialRouteName={activeTab}
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "white",
          tabBarLabelStyle: { fontSize: 12 },
          headerShown: false,

          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                textShadowColor: "white",
                fontSize: 12,
                fontWeight: focused ? "bold" : "normal", // Menentukan bold untuk tab aktif
              }}
            >
              {route.name}
            </Text>
          ),
          tabBarIndicatorStyle: {
            height: 4, // Ukuran garis indikator
            backgroundColor:
              route.name === "Pendapatan"
                ? "#15B7B9"
                : route.name === "Pengeluaran"
                ? "#F57170"
                : "black", // Mengubah warna garis berdasarkan tab aktif
          },
          tabBarContentContainerStyle: {
            // Menambahkan padding horizontal
            // Menambahkan padding vertical
            borderWidth: 2, // Menambahkan border pada container
            borderColor: "green", // Menentukan warna border
            borderRadius: 100, // Memberikan sudut melengkung pada border
            justifyContent: "center", // Menyelaraskan konten secara vertikal di tengah
          },
          tabBarStyle: {
            backgroundColor: "#FFFFFE", // Warna background tab
            borderBottomLeftRadius: 15, // Menambahkan border radius untuk sudut kiri atas
            borderBottomRightRadius: 15, // Menambahkan border radius untuk sudut kanan atas
            overflow: "hidden", // Menyembunyikan bagian yang melampaui border
          },
        })}
      >
        <Tab.Screen name="Pendapatan" component={KategoriPendapatanScreen} />
        <Tab.Screen name="Pengeluaran" component={KategoriPengeluaranScreen} />
      </Tab.Navigator>
    </View>
  );
};

export default HomeKategori;
