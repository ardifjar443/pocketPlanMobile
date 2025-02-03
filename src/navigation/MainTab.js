import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/main/home/HomeScreen";
import ProfilScreen from "../screens/profil/ProfilScreen";
import HomeKategori from "../screens/main/kategori/HomeKategori";
import RekomendasiScreen from "../screens/main/RekomendasiScreen";
import { enableScreens } from "react-native-screens";
import Pengaturan from "../screens/profil/Pengaturan";

// Aktifkan optimisasi layar
enableScreens();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator untuk Home
const HomeStack = ({ update, updating }) => (
  <Stack.Navigator
    screenOptions={{
      animationEnabled: true, // Aktifkan animasi perpindahan
      gestureEnabled: true, // Aktifkan gesture untuk swipe
      headerShown: false,
      cardStyleInterpolator: ({ current, layouts }) => {
        return {
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0], // Efek swipe
                }),
              },
            ],
          },
        };
      },
    }}
  >
    <Stack.Screen name="Utama">
      {(props) => <HomeScreen {...props} update={update} updating={updating} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const KategoriStack = () => (
  <Stack.Navigator
    screenOptions={{
      animationEnabled: true, // Aktifkan animasi perpindahan
      gestureEnabled: true, // Aktifkan gesture untuk swipe
      headerShown: false,
      cardStyleInterpolator: ({ current, layouts }) => {
        return {
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0], // Efek swipe
                }),
              },
            ],
          },
        };
      },
    }}
  >
    <Stack.Screen name="Menu_Kategori" component={HomeKategori} />
  </Stack.Navigator>
);

const RekomendasiStack = () => (
  <Stack.Navigator
    screenOptions={{
      animationEnabled: true, // Aktifkan animasi perpindahan
      gestureEnabled: true, // Aktifkan gesture untuk swipe
      headerShown: false,
      cardStyleInterpolator: ({ current, layouts }) => {
        return {
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0], // Efek swipe
                }),
              },
            ],
          },
        };
      },
    }}
  >
    <Stack.Screen name="Menu_Rekomendasi" component={RekomendasiScreen} />
  </Stack.Navigator>
);

// Stack Navigator untuk Profil
const ProfilStack = ({ update, updating }) => (
  <Stack.Navigator
    screenOptions={{
      animationEnabled: true, // Aktifkan animasi perpindahan
      gestureEnabled: true, // Aktifkan gesture untuk swipe
      headerShown: false,
      cardStyleInterpolator: ({ current, layouts }) => {
        return {
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0], // Efek swipe
                }),
              },
            ],
          },
        };
      },
    }}
  >
    <Stack.Screen name="menuProfil">
      {(props) => (
        <ProfilScreen {...props} update={update} updating={updating} />
      )}
    </Stack.Screen>
    <Stack.Screen name="Pengaturan">
      {(props) => <Pengaturan {...props} update={update} updating={updating} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const MainTab = ({ update, updating }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Profil")
            iconName = focused ? "person" : "person-outline";
          else if (route.name === "Rekomendasi")
            iconName = focused ? "flame" : "flame-outline";
          else if (route.name === "Kategori")
            iconName = focused ? "apps" : "apps-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#15B7B9",

        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: { fontSize: 12 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home">
        {(props) => (
          <HomeStack {...props} update={update} updating={updating} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Kategori" component={KategoriStack} />
      <Tab.Screen name="Rekomendasi" component={RekomendasiStack} />
      <Tab.Screen name="Profil">
        {(props) => (
          <ProfilStack {...props} update={update} updating={updating} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default MainTab;
