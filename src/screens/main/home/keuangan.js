import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Keuangan = ({ updating, update }) => {
  const [dataPendapatan, setDataPendapatan] = useState();
  const fetchPendapatan = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("Token tidak ditemukan");
        setLoading(false);
        return;
      }
      const response = await axios.get(`${API_URL}/pendapatan`, {
        headers: {
          Authorization: `Bearer ${token}`, // Bearer token di header
        },
      });
      const data = response.data.data;
      const formattedData = data.map((item) => ({
        x: new Date(item.tanggal).getTime(), // Konversi ke timestamp
        y: item.total_per_tanggal,
      }));
      setDataPendapatan(formattedData);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  const [dataPengeluaran, setDataPengeluaran] = useState();
  const fetchPengeluaran = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("Token tidak ditemukan");
        setLoading(false);
        return;
      }
      const response = await axios.get(`${API_URL}/pengeluaran`, {
        headers: {
          Authorization: `Bearer ${token}`, // Bearer token di header
        },
      });
      const data = response.data.data;
      const formattedData = data.map((item) => ({
        x: new Date(item.tanggal).getTime(), // Konversi ke timestamp
        y: item.total_per_tanggal,
      }));
      setDataPengeluaran(formattedData);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchPendapatan();
    fetchPengeluaran();
  }, [update]);

  return (
    <View className="bg-[#E3F6F5] min-h-screen p-2 rounded-2xl">
      {dataPendapatan && (
        <View className="bg-white rounded-2xl mb-5 shadow ">
          <View className="p-4 ">
            <Text className="text-3xl font-bold text-[#15B7B9]">
              Pendapatan
            </Text>
          </View>
          <LineChart
            data={{
              labels: dataPendapatan.map((item) =>
                new Date(item.x).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                })
              ), // Format tanggal
              datasets: [{ data: dataPendapatan.map((item) => item.y) }],
            }}
            width={Dimensions.get("window").width - 20} // Sesuaikan ukuran
            height={220}
            yAxisLabel="Rp"
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(21, 183, 185, ${opacity})`,
              labelColor: () => "#000",
              style: { borderRadius: 16 },
              propsForDots: { r: "4", strokeWidth: "2", stroke: "#15B7B9" },
            }}
            bezier // Membuat garis lebih halus
            style={{ marginVertical: 10, borderRadius: 16 }}
          />
        </View>
      )}

      {dataPengeluaran && (
        <View className="bg-white rounded-2xl shadow">
          <View className="p-4">
            <Text className="text-3xl font-bold text-[#F57170]">
              Pengeluaran
            </Text>
          </View>
          <LineChart
            data={{
              labels: dataPengeluaran.map((item) =>
                new Date(item.x).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                })
              ), // Format tanggal
              datasets: [{ data: dataPengeluaran.map((item) => item.y) }],
            }}
            width={Dimensions.get("window").width - 20} // Sesuaikan ukuran
            height={220}
            yAxisLabel="Rp"
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: () => `#F57170`,
              labelColor: () => "#000",
              style: { borderRadius: 16 },
              propsForDots: { r: "4", strokeWidth: "2", stroke: "#F57170" },
            }}
            bezier // Membuat garis lebih halus
            style={{ marginVertical: 10, borderRadius: 16 }}
          />
        </View>
      )}
    </View>
  );
};

export default Keuangan;
