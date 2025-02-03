import { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Popup from "../popup/popup";
import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ setIsAuthenticated }) => {
  const navigation = useNavigation();
  const goToRegister = () => {
    // Navigasi ke halaman Register
    navigation.navigate("Register");
  };

  const [popup, setPopup] = useState(false);
  const [contentPopup, setContentPopup] = useState();
  const [judulPopup, setJudulPopup] = useState();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const handleLogin = async () => {
    setLoading(true);
    try {
      axios
        .post(`${API_URL}/login`, { username, password })
        .then(async (response) => {
          console.log(response.data.token);

          try {
            // Menyimpan token ke AsyncStorage dengan try-catch
            setLoading(false);
            await AsyncStorage.setItem("userToken", response.data.token);
            console.log("Token berhasil disimpan.");
            setIsAuthenticated(true);

            // Menavigasi ke halaman utama setelah login berhasil
            navigation.navigate("Main");
          } catch (storageError) {
            // Tangani error jika penyimpanan gagal
            console.error("Gagal menyimpan token:", storageError);
            Alert.alert("Error", "Terjadi kesalahan saat menyimpan token.");
            setLoading(false);
          }
        })
        .catch((error) => {
          setPopup(true);
          setContentPopup(
            <Text className=" text-center font-bold text-xl">
              {error.response.data.error}
            </Text>
          );
          setLoading(false);
        });
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Login Error", "Terjadi kesalahan saat login.");
      setLoading(false);
    }
  };

  return (
    <View className="bg-[#E3F6F5] min-h-screen p-4 flex justify-center items-center">
      <Popup
        visible={popup}
        onClose={() => setPopup(false)}
        content={contentPopup}
        judul={judulPopup}
        notif={true}
      />
      <View>
        <Text className="text-5xl font-bold text-center">Pocket Plan</Text>
        <Text className="text-2xl text-center">Make it easy</Text>
      </View>
      <View className=" w-full p-8 mt-10">
        <Text>Username</Text>
        <TextInput
          className="bg-white w-full my-2 rounded-xl shadow-md "
          value={username}
          onChangeText={setUsername}
        />
        <Text>Password</Text>
        <TextInput
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className="bg-white w-full my-2 rounded-xl shadow-md "
        />
        <TouchableOpacity
          className={`bg-[#FFD803] p-3 mt-3 rounded-xl ${
            loading ? "opacity-75" : "opacity-100"
          }`}
          disabled={loading}
          onPress={handleLogin}
        >
          {loading ? (
            <Text className="text-center text-2xl font-bold">Loading ...</Text>
          ) : (
            <Text className="text-center text-2xl font-bold">Login</Text>
          )}
        </TouchableOpacity>

        <View className="mt-2  flex-row justify-center items-center">
          <Text>Belum mempunyai akun?</Text>
          <TouchableOpacity
            className="bg-[#15B7B9] p-1 px-2  rounded-xl ms-2"
            onPress={goToRegister}
          >
            <Text className="text-center text-lg font-bold text-white">
              Registrasi Disini
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
