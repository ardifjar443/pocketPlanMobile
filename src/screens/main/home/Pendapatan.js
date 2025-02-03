import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PopupTambahPendapatan from "../popup/PopupTambahPendapatan";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";
import PopupPendapatan from "../popup/PopupPendapatan";
import PopupUpdatePendapatan from "../popup/PopupUpdatePendapatan";
const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const iconKategori = [
  "briefcase-outline",
  "laptop-outline",
  "briefcase-outline",
  "accessibility-outline",
];
const formatTanggal = (dateString) => {
  const date = new Date(dateString); // Mengonversi string ke objek Date

  // Menentukan opsi untuk format hari dan tanggal
  const options = {
    weekday: "long", // Menampilkan hari dalam format panjang (misalnya: "Senin")
    day: "numeric", // Menampilkan tanggal (misalnya: 26)
    month: "long", // Menampilkan nama bulan dalam format panjang (misalnya: "Desember")
    year: "numeric", // Menampilkan tahun (misalnya: 2024)
  };

  // Menggunakan toLocaleDateString untuk format tanggal sesuai opsi dan lokal Indonesia
  return date.toLocaleDateString("id-ID", options); // "id-ID" untuk bahasa Indonesia
};

const bulanList = [
  { id: "1", nama: "Januari" },
  { id: "2", nama: "Februari" },
  { id: "3", nama: "Maret" },
  { id: "4", nama: "April" },
  { id: "5", nama: "Mei" },
  { id: "6", nama: "Juni" },
  { id: "7", nama: "Juli" },
  { id: "8", nama: "Agustus" },
  { id: "9", nama: "September" },
  { id: "10", nama: "Oktober" },
  { id: "11", nama: "November" },
  { id: "12", nama: "Desember" },
];

const getTahunList = () => {
  const tahunSekarang = new Date().getFullYear();
  const rangeTahun = Array.from(
    { length: 21 },
    (_, i) => tahunSekarang - 10 + i
  );
  return rangeTahun;
};
const getNamaBulan = (angka) => {
  const date = new Date(2022, angka - 1); // -1 karena bulan di JavaScript mulai dari 0
  return date.toLocaleString("id-ID", { month: "long" });
};
const Pendapatan = ({ updating, update }) => {
  const today = new Date();
  const [modalPopup, setModalPopup] = useState(false);
  const [dataPendapatan, setDataPendapatan] = useState();
  const [dataPendapatanId, setDataPendapatanId] = useState({
    id: null,
    kategori_id: null,
    kategori_name: null,
    pendapatan: null,
    tanggal: null,
  });
  const mm = String(today.getMonth() + 1).padStart(2); // Dapatkan bulan
  const yyyy = today.getFullYear(); // Dapatkan tahun

  const [bulan, setBulan] = useState(getNamaBulan(mm));
  const [bulanId, setBulanId] = useState(mm);
  const [tahun, setTahun] = useState(yyyy);
  const [showBulanPopup, setShowBulanPopup] = useState(false);
  const [showTahunPopup, setShowTahunPopup] = useState(false);

  const [popupPendapatan, setPopupPendapatan] = useState(false);
  const [popupPendapatanUpdate, setPopupPendapatanUpdate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        if (!token) {
          console.log("Token tidak ditemukan");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_URL}/pendapatan?bulan=${bulanId}&tahun=${tahun}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDataPendapatan(response.data.data); // Simpan data ke state
      } catch (error) {
        // console.error("Gagal mengambil data:", error);
        setDataPendapatan(null);
      } finally {
        setLoading(false); // Matikan loading
      }
    };

    fetchData();
  }, [update]);

  return (
    <View className="bg-[#E3F6F5] min-h-screen px-4 pb-60 ">
      <PopupUpdatePendapatan
        visible={popupPendapatanUpdate}
        onClose={() => setPopupPendapatanUpdate(false)}
        closePendapatan={() => setPopupPendapatan(false)}
        data={dataPendapatanId}
        updating={updating}
      />
      <PopupPendapatan
        visible={popupPendapatan}
        onClose={() => setPopupPendapatan(false)}
        updating={updating}
        data={dataPendapatanId}
        formatTanggal={formatTanggal}
        formatRupiah={formatRupiah}
        updateButton={() => setPopupPendapatanUpdate(true)}
      />
      <PopupTambahPendapatan
        visible={modalPopup}
        onClose={() => setModalPopup(false)}
        updating={updating}
      />
      <View className=" h-full">
        <TouchableOpacity
          className="absolute bottom-3 right-3 bg-[#15B7B9] w-16 h-16 rounded-full flex items-center justify-center shadow-lg z-10"
          onPress={() => setModalPopup(true)}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
        <ScrollView>
          <View className="p-2">
            <Text className="text-lg font-bold mb-3">
              Pilih Bulan dan Tahun
            </Text>

            <View className="flex-row justify-center gap-2 w-full">
              {/* Pilih Bulan */}
              <TouchableOpacity
                className="border p-3 rounded-lg mb-3 bg-white w-1/2"
                onPress={() => setShowBulanPopup(true)}
              >
                <Text className="text-xl font-bold">
                  {bulan ? bulan : "Pilih Bulan"}
                </Text>
              </TouchableOpacity>

              {/* Pilih Tahun */}
              <TouchableOpacity
                className="border p-3 rounded-lg bg-white  mb-3 w-1/2"
                onPress={() => setShowTahunPopup(true)}
              >
                <Text className="text-xl font-bold">
                  {tahun ? tahun : "Pilih Tahun"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Modal untuk Pilih Bulan */}
            <Modal
              transparent={true}
              visible={showBulanPopup}
              animationType="slide"
            >
              <View className="flex-1 justify-center items-center bg-black/75 px-6">
                <View className="bg-white p-5 rounded-xl w-full">
                  <Text className="text-lg font-bold mb-3">Pilih Bulan</Text>
                  <FlatList
                    data={bulanList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className={`p-3 border m-1 rounded-lg ${
                          bulan === item.nama && "bg-[#15B7B9]"
                        } `}
                        onPress={() => {
                          setBulan(item.nama);
                          setBulanId(item.id);
                          setShowBulanPopup(false);
                          updating();
                        }}
                      >
                        <Text
                          className={
                            bulan === item.nama && "text-white font-bold"
                          }
                        >
                          {item.nama}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            </Modal>

            {/* Modal untuk Pilih Tahun */}
            <Modal
              transparent={true}
              visible={showTahunPopup}
              animationType="slide"
            >
              <View className="flex-1  justify-center items-center bg-black/75 py-20 px-6">
                <View className="bg-white p-5 rounded-lg w-full">
                  <Text className="text-lg font-bold mb-3">Pilih Tahun</Text>
                  <FlatList
                    data={getTahunList()}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className={`p-3 border m-1 rounded-lg ${
                          tahun === item.toString() && "bg-[#15B7B9]"
                        }`}
                        onPress={() => {
                          setTahun(item.toString());
                          setShowTahunPopup(false);
                          updating();
                        }}
                      >
                        <Text
                          className={
                            tahun === item.toString() && "text-white font-bold"
                          }
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            </Modal>
          </View>
          {dataPendapatan &&
            dataPendapatan.map((data, key) => (
              <Card
                tanggal={formatTanggal(data.tanggal)}
                total={formatRupiah(data.total_per_tanggal)}
                data={data.data_pendapatan}
                key={key}
                setPopupPendapatan={setPopupPendapatan}
                setDataPendapatanId={setDataPendapatanId}
              />
            ))}
          <View className="mb-10 mt-2">
            <View className="p-[1px] bg-black w-full mb-1"></View>
            <Text className="text-center font-bold">Tidak Ada lagi data</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const Card = ({
  tanggal,
  total,
  updating,
  data,
  setPopupPendapatan,
  setDataPendapatanId,
}) => {
  return (
    <View className="bg-white rounded-xl shadow-lg p-4 my-3">
      <View>
        <View className="flex-row justify-between">
          <Text className="text-xl font-semibold">{tanggal}</Text>
          <Text className="text-gray-600">Total Pendapatan : {total}</Text>
        </View>

        {data &&
          data.map((data, key) => (
            <TouchableOpacity
              className="px-4 py-2 rounded-lg mt-10"
              key={key}
              onPress={() => {
                setPopupPendapatan(true);
                setDataPendapatanId({
                  id: data.id_pendapatan,
                  kategori_id: data.kategori_pendapatan.id_kategori_pendapatan,
                  kategori_name: data.kategori_pendapatan.nama_kategori,
                  pendapatan: data.pendapatan,
                  tanggal: data.tanggal,
                });
              }}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <View className="bg-[#E3F6F5] p-2 flex justify-center items-center rounded-full mr-2">
                    <Ionicons
                      name={
                        iconKategori[
                          data.kategori_pendapatan.id_kategori_pendapatan - 1
                        ]
                      }
                      size={24}
                      color="#15B7B9"
                      className=""
                    />
                  </View>
                  <View>
                    <Text className="text-black font-bold text-xl">
                      {data.kategori_pendapatan.nama_kategori}
                    </Text>
                  </View>
                </View>
                <Text className="text-[#15B7B9] font-bold text-lg">
                  +{formatRupiah(data.pendapatan)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
};

export default Pendapatan;
