import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons"; // Untuk ikon
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import Popup from "../main/popup/popup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";

const formatTanggal = (dateString) => {
  const date = new Date(dateString); // Mengonversi string ke objek Date

  // Menentukan opsi untuk format hari dan tanggal
  const options = {
    // Menampilkan hari dalam format panjang (misalnya: "Senin")
    day: "numeric", // Menampilkan tanggal (misalnya: 26)
    month: "long", // Menampilkan nama bulan dalam format panjang (misalnya: "Desember")
    year: "numeric", // Menampilkan tahun (misalnya: 2024)
  };

  // Menggunakan toLocaleDateString untuk format tanggal sesuai opsi dan lokal Indonesia
  return date.toLocaleDateString("id-ID", options); // "id-ID" untuk bahasa Indonesia
};

const CustomHeader = ({ activeTab, onTabPress }) => (
  <View className="pt-12 bg-[#FFFFFE] pb-5 rounded-b-xl">
    <View className="p-2 flex flex-row items-center gap-2">
      <Text className="text-3xl font-bold w-3/4">Profile</Text>
    </View>
  </View>
);

const ProfilScreen = ({ update, updating }) => {
  const [dataUser, setDataUser] = useState();

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        console.log("Token tidak ditemukan");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDataUser(response.data.data); // Simpan data ke state
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false); // Matikan loading
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [update])
  );

  const [popupNotif, setPopupNotif] = useState(false);
  const [contentNotif, setContentNotif] = useState();
  const [popupLogout, setPopupLogout] = useState(false);
  const [contentLogout, setContentLogout] = useState(
    <>
      <View className="w-full flex items-center justify-center">
        <Text className="text-xl font-bold">
          Apakah Anda Yakin ingin Logout?
        </Text>
        <View className="flex-row gap-3 w-full justify-start mt-5 items-center   ">
          <TouchableOpacity
            className="bg-[#15B7B9] p-2 px-10 rounded-xl "
            onPress={() => handleLogout()}
          >
            <Text className="text-white font-bold text-xl">Ya</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-[#F57170] p-2 px-10 rounded-xl "
            onPress={() => setPopupLogout(false)}
          >
            <Text className="text-white font-bold text-xl">Tidak</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const handleLogout = () => {
    const Logout = async () => {
      try {
        // Ambil token yang sudah disimpan di AsyncStorage
        const token = await AsyncStorage.getItem("userToken");

        // Periksa apakah token ada
        if (!token) {
          console.log("Token tidak ditemukan");
          return;
        }

        // Data yang akan dikirim
        // Kirim POST request dengan Bearer token
        const response = await axios.post(
          `${API_URL}/logout`,
          {}, // Ganti dengan URL API Anda
          {
            headers: {
              Authorization: `Bearer ${token}`, // Bearer token di header
            },
          }
        );
        setContentNotif(
          <>
            <Text className="text-xl font-bold text-center">
              {response.data.message}
            </Text>
            <View className="flex justify-center items-center">
              <TouchableOpacity
                className="bg-[#15B7B9] p-2 w-1/2 rounded-xl mt-10"
                onPress={async () => {
                  await AsyncStorage.removeItem("userToken");
                  updating();
                  onClose();
                }}
              >
                <Text className="text-center font-bold text-white text-2xl px-8">
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </>
        );

        setPopupNotif(true);

        // Cek response dari server
      } catch (error) {
        console.error("Gagal mengirim data:", error);
      }
    };

    // Panggil fungsi postData
    Logout();
  };

  const navigation = useNavigation();
  return (
    <View className="flex-1 bg-[#E3F6F5]">
      <CustomHeader />
      <View className="flex-1 bg-[#E3F6F5] p-5">
        {/* Kartu Profil */}
        <View className="bg-white rounded-xl shadow-lg p-4 flex-row items-center">
          {/* Foto Profil */}
          <Image
            source={require("../../../assets/profile.png")} // Ganti dengan URL gambar profil
            className="w-16 h-16 rounded-full mr-4"
          />

          {/* Info Pengguna */}
          <View className="flex-1">
            <Text className="text-xl font-bold">
              {dataUser && dataUser.name}
            </Text>
            <Text className="text-gray-500">
              Id : {dataUser && dataUser.id_user}
            </Text>
            <Text className="text-gray-500">
              Bergabung Pada : {dataUser && formatTanggal(dataUser.created_at)}
            </Text>
          </View>
        </View>

        {/* Menu Pilihan */}
        <View className="bg-white rounded-xl shadow-lg mt-4">
          {/* Pengaturan */}
          <TouchableOpacity
            className="flex-row items-center p-4 border-b border-gray-300"
            onPress={() => navigation.navigate("Pengaturan")}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color="black"
              className="mr-3"
            />
            <Text className="text-lg font-bold flex-1">Pengaturan</Text>
            <Ionicons name="chevron-forward" size={24} color="black" />
          </TouchableOpacity>

          {/* Hubungi Kami */}
          <TouchableOpacity className="flex-row items-center p-4">
            <FontAwesome5
              name="pen-alt"
              size={24}
              color="black"
              className="mr-3"
            />
            <Text className="text-lg font-bold flex-1">Hubungi Kami</Text>
            <Ionicons name="chevron-forward" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Tombol Logout */}
        <TouchableOpacity
          className="bg-red-400 rounded-lg py-3 mt-5"
          onPress={() => setPopupLogout(true)}
        >
          <Text className="text-white text-center text-lg font-bold">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
      <Popup
        visible={popupLogout}
        onClose={() => setPopupLogout(false)}
        content={contentLogout}
      />
      <Popup
        visible={popupNotif}
        onClose={() => setPopupNotif(false)}
        content={contentNotif}
      />
    </View>
  );
};

export default ProfilScreen;
