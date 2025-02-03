import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MainTab from "./MainTab";
import Login from "../screens/main/auth/login";
import Registrasi from "../screens/main/auth/registrasi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View, Text } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "@env";

const Stack = createStackNavigator();

export default function AuthStack() {
  const [loading, setLoading] = useState(true); // Loading state untuk memverifikasi token
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Menyimpan status apakah sudah login atau belum
  const [update, setUpdate] = useState(false);
  const updating = () => {
    setUpdate(!update);
  };
  useEffect(() => {
    // Verifikasi token saat aplikasi dibuka
    const verifyToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        try {
          const response = await axios.post(
            `${API_URL}/verify`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.status === 200) {
            // Token valid, set isAuthenticated ke true
            setIsAuthenticated(true);
          } else {
            // Token tidak valid, hapus token dan set isAuthenticated ke false
            await AsyncStorage.removeItem("userToken");
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          await AsyncStorage.removeItem("userToken");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false); // Token tidak ada, anggap pengguna belum login
      }
      setLoading(false); // Selesai verifikasi token
    };
    verifyToken();
  }, [update]);

  // Tampilkan loading screen saat memverifikasi token
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#E3F6F5]">
        <View className="flex justify-center items-center ">
          <Ionicons name="wallet-outline" size={100} color="black" />

          <Text className="text-5xl font-bold text-center">Pocket Plan</Text>
          <Text className="text-2xl text-center">Make it easy</Text>
        </View>
        <View className="mt-20  ">
          <ActivityIndicator size="large" color="#15B7B9" />
          <Text>Verifying Token...</Text>
        </View>
      </View>
    );
  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main">
          {(props) => (
            <MainTab {...props} update={update} updating={updating} />
          )}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Login">
            {(props) => (
              <Login {...props} setIsAuthenticated={setIsAuthenticated} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Register" component={Registrasi} />
        </>
      )}
    </Stack.Navigator>
  );
}
