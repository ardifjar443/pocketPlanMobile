import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./navigation/AuthStack";

import { enableScreens } from "react-native-screens";
import { Alert, BackHandler, Text, View, TouchableOpacity } from "react-native";
import Popup from "./screens/main/popup/popup";
enableScreens();

export default function App() {
  const [exitPopup, setExitPopup] = useState(false);

  useEffect(() => {
    const backAction = () => {
      setExitPopup(true);
      return true; // Mencegah aplikasi langsung keluar
    };

    // Menangkap event tombol back
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Membersihkan event listener saat komponen unmount
  }, []);
  return (
    <NavigationContainer>
      <Popup
        visible={exitPopup}
        onClose={() => setExitPopup(false)}
        judul="Konfirmasi"
        content={
          <>
            <Text className="text-xl font-bold text-center">
              Apakah Anda Yakin Ingin Keluar Aplikasi
            </Text>
            <View className="flex-row justify-between items-center w-1/2 gap-2">
              <TouchableOpacity
                className="bg-[#15B7B9] p-3 w-full mt-3 rounded-xl"
                onPress={() => BackHandler.exitApp()}
              >
                <Text className="text-center text-2xl font-bold text-white">
                  Ya
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-[#F57170] w-full p-3 mt-3 rounded-xl"
                onPress={() => setExitPopup(false)}
              >
                <Text className="text-center text-2xl font-bold text-white">
                  Tidak
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
      />
      <AuthStack />
    </NavigationContainer>
  );
}
