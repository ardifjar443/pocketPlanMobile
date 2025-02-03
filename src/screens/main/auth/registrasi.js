import { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Popup from "../popup/popup";
import axios from "axios";
import { API_URL } from "@env";

const Registrasi = () => {
  const navigation = useNavigation();
  const goToLogin = () => {
    navigation.navigate("Login");
  };

  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState(false);
  const [contentPopup, setContentPopup] = useState();
  const [judulPopup, setJudulPopup] = useState();
  const [error, setError] = useState(false);

  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const handleRegister = async () => {
    setLoading(true);
    try {
      axios
        .post(`${API_URL}/register`, { name, username, password })
        .then((response) => {
          setError(false);
          setPopup(true);
          setContentPopup(
            <View className="flex justify-center items-center">
              <Text className=" text-center font-bold text-xl">
                Anda Berhasil Register
              </Text>
              <TouchableOpacity
                className="bg-[#15B7B9] p-2 w-1/2 rounded-xl mt-10"
                onPress={() => navigation.navigate("Login")}
              >
                <Text className="text-center font-bold text-white text-2xl px-8">
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          );
          setLoading(false);
        })
        .catch((error) => {
          setError(true);
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
        notif={error}
      />
      <View>
        <Text className="text-5xl font-bold text-center">Pocket Plan</Text>
        <Text className="text-2xl text-center">Make it easy</Text>
      </View>
      <View className=" w-full p-8 mt-10">
        <Text>Name</Text>
        <TextInput
          className="bg-white w-full my-2 rounded-xl shadow-md "
          value={name}
          onChangeText={setName}
        />
        <Text>Username</Text>
        <TextInput
          className="bg-white w-full my-2 rounded-xl shadow-md "
          value={username}
          onChangeText={setUsername}
        />
        <Text>Password</Text>
        <TextInput
          secureTextEntry
          className="bg-white w-full my-2 rounded-xl shadow-md "
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          className={`bg-[#FFD803] p-3 mt-3 rounded-xl ${
            loading ? "opacity-75" : "opacity-100"
          }`}
          disabled={loading}
          onPress={handleRegister}
        >
          {loading ? (
            <Text className="text-center text-2xl font-bold">Loading ...</Text>
          ) : (
            <Text className="text-center text-2xl font-bold">Register</Text>
          )}
        </TouchableOpacity>

        <View className="mt-2  flex-row justify-center items-center">
          <Text>Sudah mempunyai akun?</Text>
          <TouchableOpacity
            className="bg-[#15B7B9] p-1 px-2  rounded-xl ms-2"
            onPress={goToLogin}
          >
            <Text className="text-center text-lg font-bold text-white">
              Login Disini
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Registrasi;
