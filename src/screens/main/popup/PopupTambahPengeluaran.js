import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import Popup from "./popup";

const PopTambahPengeluaran = ({ visible, onClose, updating }) => {
  const today = new Date();
  const [jumlah, setJumlah] = useState(null);
  const [kategori, setKategori] = useState();
  const [kategoriNama, setKategoriNama] = useState("Pilih Kategori");
  const [tanggal, setTanggal] = useState(today.toISOString().split("T")[0]);
  const [showKategoriPopup, setShowKategoriPopup] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [popupNotif, setPopupNotif] = useState(false);
  const [contentNotif, setContentNotif] = useState();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    setTanggal(moment(date).format("YYYY-MM-DD")); // Format tanggal sesuai yang diinginkan
    hideDatePicker();
  };

  const handleSimpan = () => {
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
        const data = {
          pengeluaran: jumlah,
          id_kategori_pengeluaran: kategori,
          tanggal: tanggal,
        };

        // Kirim POST request dengan Bearer token
        const response = await axios.post(
          `${API_URL}/pengeluaran`, // Ganti dengan URL API Anda
          data,
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
          </>
        );

        setPopupNotif(true);
        // Cek response dari server
        updating();
        onClose();
      } catch (error) {
        console.error("Gagal mengirim data:", error);
      }
    };

    // Panggil fungsi postData
    postData();
  };

  return (
    <>
      <Popup
        onClose={() => setPopupNotif(false)}
        visible={popupNotif}
        content={contentNotif}
        notif={true}
      />
      <Modal transparent={true} visible={visible} animationType="slide">
        <Pressable
          className="flex-1 justify-end items-center bg-black/75  "
          onPress={onClose}
        />
        <View className="bg-black/75 px-2 ">
          <View className="bg-white p-5 rounded-t-2xl w-full">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-xl font-bold">Tambah Pengeluaran</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close-circle" size={32} color="red" />
              </TouchableOpacity>
            </View>

            <Text>Pengeluaran</Text>
            <TextInput
              className="border p-2 rounded mb-3"
              keyboardType="numeric"
              value={jumlah}
              onChangeText={setJumlah}
            />

            <Text>Kategori</Text>
            <TouchableOpacity
              className="border p-2 rounded mb-3"
              onPress={() => setShowKategoriPopup(true)}
            >
              <Text>{kategoriNama}</Text>
            </TouchableOpacity>

            <Text>Tanggal</Text>
            <TouchableOpacity
              className="border p-2 rounded mb-5"
              onPress={showDatePicker}
            >
              <Text>{tanggal}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-[#15B7B9] p-3 rounded"
              disabled={
                kategoriNama === "Pilih Kategori" ||
                jumlah === null ||
                jumlah <= 0
              }
              onPress={handleSimpan}
            >
              <Text className="text-white text-center font-bold text-lg">
                Simpan
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Popup Kategori */}
        <PopupKategori
          visible={showKategoriPopup}
          onClose={() => setShowKategoriPopup(false)}
          onSelect={setKategori}
          onSelectNama={setKategoriNama}
        />

        {/* Popup Kalender */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
        />
      </Modal>
    </>
  );
};

const PopupKategori = ({ visible, onClose, onSelect, onSelectNama }) => {
  const [kategoriList, setKategoriList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        if (!token) {
          console.log("Token tidak ditemukan");
          return;
        }

        const response = await axios.get(`${API_URL}/kategori/pengeluaran`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setKategoriList(response.data.data); // Simpan data ke state
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <Pressable
        className="flex-1 justify-end  items-center"
        onPress={onClose}
      />
      <View className=" px-2">
        <View className="bg-white p-5 rounded-lg w-full h-80">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold">Pilih Kategori</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={32} color="red" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={kategoriList}
            keyExtractor={(item) => item.id_kategori_pengeluaran}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="p-2 border m-1 flex-row items-center justify-between "
                onPress={() => {
                  onSelect(item.id_kategori_pengeluaran);
                  onSelectNama(item.nama_kategori);
                  onClose();
                }}
              >
                <View className="p-5 bg-[#F57170] rounded-full"></View>
                <View className="w-full">
                  <Text className="text-center">{item.nama_kategori}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

export default PopTambahPengeluaran;
