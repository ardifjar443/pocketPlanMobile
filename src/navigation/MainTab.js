import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/main/home/HomeScreen";
import ProfilScreen from "../screens/main/ProfilScreen";
import { enableScreens } from "react-native-screens";

// Aktifkan optimisasi layar
enableScreens();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator untuk Home
const HomeStack = () => (
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
    <Stack.Screen name="Home" component={HomeScreen} />
  </Stack.Navigator>
);

// Stack Navigator untuk Profil
const ProfilStack = () => (
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
    <Stack.Screen name="Profil" component={ProfilScreen} />
  </Stack.Navigator>
);

const MainTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Profil")
            iconName = focused ? "card" : "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#15B7B9",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: { fontSize: 12 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Profil" component={ProfilStack} />
    </Tab.Navigator>
  );
};

export default MainTab;
