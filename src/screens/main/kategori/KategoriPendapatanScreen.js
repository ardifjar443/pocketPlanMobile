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

const iconKategori = [
  "briefcase-outline",
  "laptop-outline",
  "briefcase-outline",
  "accessibility-outline",
];

const getTahunList = () => {
  const tahunSekarang = new Date().getFullYear();
  return Array.from({ length: 21 }, (_, i) => tahunSekarang - 10 + i);
};

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const CardPendapatan = ({ nama, total, iconId, color }) => (
  <View className="flex-row justify-between items-center m-2">
    <View className="flex-row items-center">
      <View
        className="mr-2 p-2 rounded-full"
        style={{ backgroundColor: color }}
      >
        <Ionicons name={iconKategori[iconId - 1]} size={35} color="black" />
      </View>
      <Text className="text-black font-bold text-lg">{nama}</Text>
    </View>
    <Text className="font-bold text-xl">{formatRupiah(total)}</Text>
  </View>
);

const getNamaBulan = (angka) => {
  return new Date(2022, Number(angka) - 1).toLocaleString("id-ID", {
    month: "long",
  });
};

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

const getShuffledColors = (size) => {
  return [...colors].sort(() => Math.random() - 0.5).slice(0, size);
};

const KategoriPendapatanScreen = () => {
  const today = new Date();
  const [update, setUpdate] = useState(false);
  const [bulan, setBulan] = useState(getNamaBulan(today.getMonth() + 1));
  const [bulanId, setBulanId] = useState(today.getMonth() + 1);
  const [tahun, setTahun] = useState(today.getFullYear());
  const [showBulanPopup, setShowBulanPopup] = useState(false);
  const [showTahunPopup, setShowTahunPopup] = useState(false);
  const [dataKategoriPendapatan, setDataKategoriPendapatan] = useState(null);

  const fetchKategoriPendapatan = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("Token tidak ditemukan");
        return;
      }
      const response = await axios.get(
        `${API_URL}/kategori/pendapatan?bulan=${bulanId}&tahun=${tahun}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = Object.values(response.data.data);
      const uniqueColors = getShuffledColors(data.length);

      const formattedData = data.map((item, index) => ({
        id: item.id_kategori_pendapatan,
        value: item.total_pendapatan,
        color: uniqueColors[index],
        label: { text: item.nama_kategori, fontWeight: "bold" },
      }));
      console.log(formattedData);
      setDataKategoriPendapatan(formattedData);
    } catch (error) {
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
        <View className="flex-row justify-center gap-2 mb-5">
          <TouchableOpacity
            className="border p-3 rounded-lg bg-white w-1/2"
            onPress={() => setShowBulanPopup(true)}
          >
            <Text className="text-xl font-bold">{bulan}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="border p-3 rounded-lg bg-white w-1/2"
            onPress={() => setShowTahunPopup(true)}
          >
            <Text className="text-xl font-bold">{tahun}</Text>
          </TouchableOpacity>
        </View>
        {dataKategoriPendapatan ? (
          <CardPie data={dataKategoriPendapatan} />
        ) : (
          <Text>Belum ada pendapatan</Text>
        )}
      </View>
      {dataKategoriPendapatan && (
        <View className="p-5">
          <View className="bg-white rounded-xl shadow-lg p-4">
            <ScrollView>
              {dataKategoriPendapatan.map((item, index) => (
                <CardPendapatan
                  key={index}
                  iconId={item.id}
                  total={item.value}
                  nama={item.label.text}
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

export default KategoriPendapatanScreen;
