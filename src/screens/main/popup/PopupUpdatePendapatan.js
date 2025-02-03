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
import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import Popup from "./popup";

const PopupUpdatePendapatan = ({
  visible,
  onClose,
  updating,
  data,
  closePendapatan,
}) => {
  const today = new Date();
  const [jumlah, setJumlah] = useState();
  const [kategori, setKategori] = useState();
  const [kategoriNama, setKategoriNama] = useState("Pilih Kategori");
  const [tanggal, setTanggal] = useState(today.toISOString().split("T")[0]);
  const [showKategoriPopup, setShowKategoriPopup] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [popupNotif, setPopupNotif] = useState(false);
  const [contentNotif, setContentNotif] = useState();

  useEffect(() => {
    setJumlah(data.pendapatan);
    setKategoriNama(data.kategori_name);
    setTanggal(data.tanggal);
    setKategori(data.kategori_id);
  }, [data]);

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
          pendapatan: jumlah,
          id_kategori_pendapatan: kategori,
          tanggal: tanggal,
        };
        // console.log(`${API_URL}/pendapatan/${data.id}`);
        // Kirim POST request dengan Bearer token
        const response = await axios.put(
          `${API_URL}/pendapatan/${data.id}`, // Ganti dengan URL API Anda
          dataUpdate,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Bearer token di header
            },
          }
        );
        console.log(response);
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
                  closePendapatan();
                }}
              >
                <Text className="text-center font-bold text-white text-2xl px-8">
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </>
        );
        onClose();
        setPopupNotif(true);

        updating();
      } catch (error) {
        console.error("Gagal mengirim data:", error.response.data);
      }
    };

    // Panggil fungsi postData
    postData();
  };

  return (
    <>
      <Modal transparent={true} visible={visible} animationType="slide">
        <Pressable
          onPress={onClose}
          className="flex-1 justify-end items-center  "
        />
        <View className="px-2">
          <View className="bg-white p-5 rounded-t-2xl w-full">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-xl font-bold">Update Pendapatan</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close-circle" size={32} color="red" />
              </TouchableOpacity>
            </View>

            <Text>Pendapatan</Text>
            <TextInput
              className="border p-2 rounded mb-3"
              keyboardType="numeric"
              value={jumlah && jumlah.toString()}
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
                kategori === "Pilih Kategori" || jumlah === null || jumlah <= 0
              }
              onPress={handleUpdate}
            >
              <Text className="text-white text-center font-bold text-lg">
                Update Pendapatan
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
      <Popup
        onClose={() => {
          setPopupNotif(false);
          onClose();
        }}
        visible={popupNotif}
        content={contentNotif}
      />
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

        const response = await axios.get(`${API_URL}/kategori/pendapatan`, {
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
      <View className="flex-1 justify-end  items-center  px-2">
        <View className="bg-white p-5 rounded-lg w-full h-80">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold">Pilih Kategori</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={32} color="red" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={kategoriList}
            keyExtractor={(item) => item.id_kategori_pendapatan}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="p-2 border m-1 flex-row items-center justify-between "
                onPress={() => {
                  onSelect(item.id_kategori_pendapatan);
                  onSelectNama(item.nama_kategori);
                  onClose();
                }}
              >
                <View className="p-5 bg-[#15B7B9] rounded-full"></View>
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

export default PopupUpdatePendapatan;
