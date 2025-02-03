import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons"; // Untuk ikon
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-gesture-handler";
import Popup from "../main/popup/popup";
import { useNavigation } from "@react-navigation/native";

const CustomHeader = ({ activeTab, onTabPress }) => (
  <View className="pt-12 bg-[#FFFFFE] pb-5 rounded-b-xl">
    <View className=" flex flex-row items-center gap-2 p-4">
      <Text className="text-3xl font-bold w-3/4">Pengaturan</Text>
    </View>
  </View>
);

const Pengaturan = ({ update, updating }) => {
  const navigate = useNavigation();
  const [popupNotif, setPopupNotif] = useState(false);
  const [contentNotif, setContentNotif] = useState();
  const [username, setUsername] = useState();
  const [name, setName] = useState();
  //   const [password, setPassword] = useState();
  const [id, setId] = useState();
  useEffect(() => {
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

        setUsername(response.data.data.username); // Simpan data ke state
        setName(response.data.data.name); // Simpan data ke state // Simpan data ke state
        setId(response.data.data.id_user); // Simpan data ke state // Simpan data ke state
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false); // Matikan loading
      }
    };

    fetchData();
  }, []);

  const handleUpdate = () => {
    const postData = async () => {
      try {
        // Ambil token yang sudah disimpan di AsyncStorage
        const token = await AsyncStorage.getItem("userToken");

        // Periksa apakah token ada
        if (!token) {
          console.log("Token tidak ditemukan");
          return;
        }

        // Data yang akan dikirim
        const dataUpdate = {
          username: username,
          name: name,
          //   password: password,
        };
        // console.log(`${API_URL}/pendapatan/${data.id}`);
        // Kirim POST request dengan Bearer token
        const response = await axios.put(
          `${API_URL}/user`, // Ganti dengan URL API Anda
          dataUpdate,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Bearer token di header
            },
          }
        );
        console.log(response.data);
        // Cek response dari server
        setContentNotif(
          <>
            <Text className="text-xl font-bold text-center">
              {response.data.message}
            </Text>
            <View className="flex justify-center items-center">
              <TouchableOpacity
                className="bg-[#15B7B9] p-2 w-1/2 rounded-xl mt-10"
                onPress={() => {
                  setPopupNotif(false);
                  //   closePendapatan();
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

        onClose();
        updating();
        navigate.navigate("menuProfil");
      } catch (error) {
        console.error("Gagal mengirim data:", error.response.data);
      }
    };

    // Panggil fungsi postData
    postData();
  };
  return (
    <View className="flex-1 bg-[#E3F6F5]">
      <CustomHeader />

      <View className="p-5">
        <View className="bg-[#15B7B9] p-4 rounded-xl">
          <Text className="text-white text-xl font-bold text-center">
            Edit Data Profile
          </Text>
        </View>
      </View>
      <View className="flex-1 bg-[#E3F6F5] p-5">
        {/* Kartu Profil */}
        <View className="bg-white rounded-xl shadow-lg p-4 flex-col items-center">
          {/* Foto Profil */}
          <Image
            source={require("../../../assets/profile.png")} // Ganti dengan URL gambar profil
            className="w-16 h-16 rounded-full mr-4"
          />

          {/* Info Pengguna */}
          <View className="w-full flex-col gap-5">
            <View>
              <Text>Username</Text>
              <TextInput
                className="text-xl font-bold border-b w-full"
                value={username}
                onChangeText={setUsername}
              ></TextInput>
            </View>
            <View>
              <Text>Nama</Text>
              <TextInput
                className="text-xl font-bold border-b w-full"
                value={name}
                onChangeText={setName}
              ></TextInput>
            </View>
            {/* <View>
              <Text>Password</Text>
              <TextInput
                secureTextEntry
                className="text-xl font-bold border-b w-full"
                value={password}
                onChangeText={setPassword}
              ></TextInput>
            </View> */}
          </View>
        </View>

        {/* Tombol Logout */}
        <TouchableOpacity
          className="bg-red-400 rounded-lg py-3 mt-5"
          onPress={() => handleUpdate()}
        >
          <Text className="text-white text-center text-lg font-bold">
            Simpan
          </Text>
        </TouchableOpacity>
      </View>

      <Popup
        onClose={() => {
          setPopupNotif(false);
        }}
        visible={popupNotif}
        content={contentNotif}
      />
    </View>
  );
};

export default Pengaturan;
