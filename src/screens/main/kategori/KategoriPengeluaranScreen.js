import {
  View,
  Text,
  ScrollView,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CardPie from "./CardPie";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { API_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";

const iconKategori = [
  "fast-food-outline",
  "bag-outline",
  "drink-outline",
  "sparkles-outline",
  "bag-outline",
  "bicycle-outline",
];
// List bulan
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

// List tahun
const getTahunList = () => {
  const tahunSekarang = new Date().getFullYear();
  return Array.from({ length: 21 }, (_, i) => tahunSekarang - 10 + i);
};

// Format angka ke Rupiah
const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

// Komponen kartu pendapatan
const CardPendapatan = ({ nama, total, iconId, color }) => {
  return (
    <View className="flex-row justify-between items-center m-2">
      <View className="flex-row items-center">
        <View
          className={`mr-2 p-2 rounded-full`}
          style={{ backgroundColor: color }}
        >
          <Ionicons name={iconKategori[iconId - 1]} size={35} color="black" />
        </View>
        <View>
          <Text className="text-black font-bold text-lg">{nama}</Text>
        </View>
      </View>
      <Text className="font-bold text-xl">{formatRupiah(total)}</Text>
    </View>
  );
};

// Ambil nama bulan dari angka
const getNamaBulan = (angka) => {
  const date = new Date(2022, angka - 1);
  return date.toLocaleString("id-ID", { month: "long" });
};

const KategoriPengeluaranScreen = () => {
  const today = new Date();
  const [update, setUpdate] = useState(false);
  const updating = () => setUpdate(!update);

  // Dapatkan bulan & tahun sekarang
  const mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();

  const [bulan, setBulan] = useState(getNamaBulan(mm));
  const [bulanId, setBulanId] = useState(mm.toString());
  const [tahun, setTahun] = useState(yyyy.toString());
  const [showBulanPopup, setShowBulanPopup] = useState(false);
  const [showTahunPopup, setShowTahunPopup] = useState(false);
  const [dataKategoriPendapatan, setDataKategoriPendapatan] = useState();

  const colors = [
    "#9e0142",
    "#d53e4f",
    "#f46d43",
    "#fdae61",
    "#fee08b",
    "#e6f598",
    "#abdda4",
    "#66c2a5",
    "#3288bd",
    "#5e4fa2",
  ];

  // Fungsi untuk mengambil warna unik
  const getShuffledColors = (size) => {
    let shuffledColors = [...colors].sort(() => Math.random() - 0.5);
    return shuffledColors.slice(0, size);
  };

  // Fetch data kategori pendapatan
  const fetchKategoriPendapatan = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("Token tidak ditemukan");
        return;
      }
      const response = await axios.get(
        `${API_URL}/kategori/pengeluaran?bulan=${bulanId}&tahun=${tahun}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = Object.values(response.data.data);
      console.log(data);

      // Ambil warna unik
      const uniqueColors = getShuffledColors(data.length);

      const formattedData = data.map((item, index) => ({
        iconId: item.id_kategori_pengeluaran,
        value: item.total_pengeluaran,
        color: uniqueColors[index],
        label: { text: item.nama_kategori, fontWeight: "bold" },
      }));
      setDataKategoriPendapatan(formattedData);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setDataKategoriPendapatan(null);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchKategoriPendapatan();
    }, [update])
  );

  return (
    <View className="bg-[#E3F6F5] h-full">
      <View className="flex items-center mb-2 bg-white p-3 mt-2 m-8 rounded-xl shadow-lg">
        <View className="flex-row justify-center gap-2 w-full mb-5">
          <TouchableOpacity
            className="border p-3 rounded-lg bg-white w-1/2"
            onPress={() => setShowBulanPopup(true)}
          >
            <Text className="text-xl font-bold">{bulan || "Pilih Bulan"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="border p-3 rounded-lg bg-white w-1/2"
            onPress={() => setShowTahunPopup(true)}
          >
            <Text className="text-xl font-bold">{tahun || "Pilih Tahun"}</Text>
          </TouchableOpacity>
        </View>
        {dataKategoriPendapatan ? (
          <CardPie data={dataKategoriPendapatan} />
        ) : (
          <View className="h-1/2 w-full flex justify-center items-center">
            <Text className="text-center text-4xl font-bold">
              Belum ada pendapatan
            </Text>
          </View>
        )}
      </View>

      {dataKategoriPendapatan && (
        <View className="p-5">
          <View className="bg-white rounded-xl shadow-lg p-4">
            <ScrollView>
              {dataKategoriPendapatan.map((item, index) => (
                <CardPendapatan
                  key={index}
                  total={item.value}
                  nama={item.label.text}
                  iconId={item.iconId}
                  color={item.color}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Modal Pilih Bulan */}
      <Modal transparent visible={showBulanPopup} animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/75 px-6">
          <View className="bg-white p-5 rounded-xl w-full">
            <FlatList
              data={bulanList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="p-3 border rounded-lg"
                  onPress={() => {
                    setBulan(item.nama);
                    setBulanId(item.id);
                    setShowBulanPopup(false);
                    updating();
                  }}
                >
                  <Text>{item.nama}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default KategoriPengeluaranScreen;
