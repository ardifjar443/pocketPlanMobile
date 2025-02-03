import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Popup from "./popup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";
const iconKategori = [
  "fast-food-outline",
  "bag-outline",
  "drink-outline",
  "sparkles-outline",
  "bag-outline",
  "bicycle-outline",
];
const PopupPengeluaran = ({
  visible,
  onClose,
  updating,
  data,
  formatTanggal,
  formatRupiah,
  updateButton,
}) => {
  const [popupDelete, setPopupDelete] = useState(false);
  const [popupNotif, setPopupNotif] = useState(false);
  const [contentNotif, setContentNotif] = useState();
  const handleDelete = () => {
    const deleteData = async () => {
      try {
        // Ambil token yang sudah disimpan di AsyncStorage
        const token = await AsyncStorage.getItem("userToken");

        // Periksa apakah token ada
        if (!token) {
          console.log("Token tidak ditemukan");
          return;
        }

        const response = await axios.delete(
          `${API_URL}/pengeluaran/${data.id}`, // Ganti dengan URL API Anda
          {
            headers: {
              Authorization: `Bearer ${token}`, // Bearer token di header
            },
          }
        );
        // console.log(response.data.message);
        // Cek response dari server
        updating();
        onClose();
        setPopupDelete(false);
        setContentNotif(
          <Text className="text-xl font-bold text-center">
            {response.data.message}
          </Text>
        );
        setPopupNotif(true);
      } catch (error) {
        console.error("Gagal mengirim data:", error.response.data);
      }
    };

    // Panggil fungsi postData
    deleteData();
  };
  return (
    <>
      <Modal transparent={true} visible={visible} animationType="slide">
        <Pressable
          className="flex-1 justify-end items-center bg-black/75 px-6"
          onPress={onClose}
        />
        <View className="px-6 bg-black/75 ">
          <View className="w-full flex justify-center items-center">
            <View className="bg-[#f7d7d7] rounded-full  p-3  absolute z-20 flex justify-center items-center">
              <Ionicons
                name={iconKategori[data.kategori_id - 1]}
                size={40}
                color="#F57170"
              />
            </View>
            <View className="bg-white p-2 w-full rounded-t-xl z-10 "></View>
          </View>
          <View className="bg-white px-5 pb-5 w-full">
            <View className="flex-row justify-between items-center mb-3">
              <View>
                <Text className="text-xl">Pengeluaran</Text>
                <Text className="text-3xl font-bold">
                  {formatRupiah(data.pengeluaran)}
                </Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close-circle" size={48} color="red" />
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between">
              <View>
                <Text className="text-lg">Kategori pengeluaran</Text>
                <Text className="text-xl font-bold">{data.kategori_name}</Text>
              </View>
              <View>
                <Text className="text-lg">Tanggal</Text>
                <Text className="text-xl font-bold">
                  {formatTanggal(data.tanggal)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              className="bg-[#FFD803] p-3 rounded-xl mb-3 mt-3"
              onPress={updateButton}
            >
              <Text className="text-black text-center font-bold text-lg">
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-[#F57170] p-3 rounded-xl"
              onPress={() => {
                setPopupDelete(true);
              }}
            >
              <Text className="text-white text-center font-bold text-lg">
                Hapus
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Popup
        onClose={() => {
          setPopupNotif(false);
          onClose();
        }}
        visible={popupNotif}
        content={contentNotif}
        notif={true}
      />
      <Popup
        visible={popupDelete}
        onClose={() => {
          setPopupDelete(false);
        }}
        content={
          <>
            <View>
              <Text className="text-xl font-bold">
                Apakah anda yakin ingin menghapus pengeluaran ini ?
              </Text>
              <View className="flex-row justify-center gap-5 mt-4">
                <TouchableOpacity
                  className="p-4 rounded-xl bg-[#15B7B9] w-1/3"
                  onPress={() => handleDelete()}
                >
                  <Text className="text-white text-lg font-bold text-center">
                    Ya
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="p-4 rounded-xl bg-[#F57170] w-1/3"
                  onPress={() => {
                    setPopupDelete(false);
                  }}
                >
                  <Text className="text-white text-lg font-bold text-center">
                    Tidak
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
      />
    </>
  );
};

export default PopupPengeluaran;
