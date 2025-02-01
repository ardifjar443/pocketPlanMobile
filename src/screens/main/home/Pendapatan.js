import { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PopupTambah from "../popup/PopupTambah";

const Pendapatan = () => {
  const [modalPopup, setModalPopup] = useState(false)
  return (
    <View className="bg-[#E3F6F5] min-h-screen p-4 ">
      <PopupTambah visible={modalPopup} onClose={()=>setModalPopup(false)} />
      <View>
        <TouchableOpacity
          className="absolute bottom-48 right-6 bg-[#15B7B9] w-16 h-16 rounded-full flex items-center justify-center shadow-lg z-10"
          onPress={()=>setModalPopup(true)}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
        <ScrollView>
          <Card tanggal="Senin 1/2" total="Pengeluaran: 30.000.00" />
          <Card tanggal="Minggu 1/2" total="Pengeluaran: 30.000.00" />

          <Card tanggal="Sabtu 1/2" total="Pengeluaran: 30.000.00" />

          <Card tanggal="Jumat 1/2" total="Pengeluaran: 30.000.00" />
        </ScrollView>
      </View>
    </View>
  );
};

const Card = ({ tanggal, total }) => {
  return (
    <View className="bg-white rounded-xl shadow-lg p-4 my-3">
      <View>
        <View className="flex-row justify-between">
          <Text className="text-xl font-semibold">{tanggal}</Text>
          <Text className="text-gray-600">{total}</Text>
        </View>
        <TouchableOpacity className="px-4 py-2 rounded-lg mt-10">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Ionicons
                name="wallet"
                size={24}
                color="black"
                className="mr-2"
              />
              <View>
                <Text className="text-black font-bold text-xl">Kategori</Text>
                <Text className="text-black">Tanggal</Text>
              </View>
            </View>
            <Text className="text-[#15B7B9] font-bold text-lg">
              +Rp.100.000
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="px-4 py-2 rounded-lg mt-10">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Ionicons
                name="wallet"
                size={24}
                color="black"
                className="mr-2"
              />
              <View>
                <Text className="text-black font-bold text-xl">Kategori</Text>
                <Text className="text-black">Tanggal</Text>
              </View>
            </View>
            <Text className="text-[#15B7B9] font-bold text-lg">
              +Rp.100.000
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="px-4 py-2 rounded-lg mt-10">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Ionicons
                name="wallet"
                size={24}
                color="black"
                className="mr-2"
              />
              <View>
                <Text className="text-black font-bold text-xl">Kategori</Text>
                <Text className="text-black">Tanggal</Text>
              </View>
            </View>
            <Text className="text-[#15B7B9] font-bold text-lg">
              +Rp.100.000
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Pendapatan;
