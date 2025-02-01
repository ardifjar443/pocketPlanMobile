import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PopupTambah = ({ visible, onClose }) => {
  const [jumlah, setJumlah] = useState("");
  const [kategori, setKategori] = useState("Side job");
  const [tanggal, setTanggal] = useState("26/12/2024");

  // Animated Value untuk opacity dan posisi
  const fadeAnim = new Animated.Value(0);  // Opacity (dimulai dengan 0)
  const slideAnim = new Animated.Value(200); // Posisi (dimulai di bawah layar)

  // Menjalankan animasi saat popup muncul
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animasi keluar
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 200,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Setelah animasi selesai, panggil onClose
        onClose();
      });
    }
  }, [visible]);

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end items-center bg-black/75">
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
            { width: 350 },
          ]}
          className="bg-white p-5 rounded-t-2xl shadow-lg"
        >
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold">Tambah</Text>
            <TouchableOpacity onPress={() => {
              // Animasi close sebelum memanggil onClose
              Animated.parallel([
                Animated.timing(fadeAnim, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                  toValue: 200,
                  duration: 300,
                  useNativeDriver: true,
                }),
              ]).start(() => {
                onClose();  // Menutup setelah animasi selesai
              });
            }}>
              <Ionicons name="close-circle" size={32} color="red" />
            </TouchableOpacity>
          </View>

          <Text className="text-gray-700">Pendapatan</Text>
          <TextInput
            className="border p-2 rounded mb-3"
            placeholder="Rp."
            keyboardType="numeric"
            value={jumlah}
            onChangeText={setJumlah}
          />

          <Text className="text-gray-700">Kategori</Text>
          <TouchableOpacity className="flex-row items-center border p-2 rounded mb-3">
            <View className="w-4 h-4 bg-green-400 rounded-full mr-2" />
            <Text className="flex-1">{kategori}</Text>
            <Ionicons name="chevron-forward" size={20} color="black" />
          </TouchableOpacity>

          <Text className="text-gray-700">Tanggal</Text>
          <TouchableOpacity className="flex-row items-center border p-2 rounded mb-5">
            <Text className="flex-1">{tanggal}</Text>
            <Ionicons name="calendar" size={20} color="black" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-[#15B7B9] p-3 rounded">
            <Text className="text-white text-center font-bold text-lg">Simpan</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default PopupTambah;
