const { View, Text, Image, StyleSheet, Platform } = require("react-native");
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Svg, { Circle, Path } from "react-native-svg";
import { API_URL } from "@env";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const getNamaBulan = (angka) => {
  const date = new Date(2022, angka - 1); // -1 karena bulan di JavaScript mulai dari 0
  return date.toLocaleString("id-ID", { month: "short" });
};
const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};
const RekomendasiScreen = () => {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2);

  const [rekomendasi, setRekomendasi] = useState();
  const [update, setUpdate] = useState(false);

  const fetchRekomendasi = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("Token tidak ditemukan");
        setLoading(false);
        return;
      }
      const response = await axios.get(`${API_URL}/rekomendasi`, {
        headers: {
          Authorization: `Bearer ${token}`, // Bearer token di header
        },
      });
      console.log(response.data.data);

      setRekomendasi(response.data.data);
    } catch (error) {
      // console.error("Gagal mengambil data:", error);
      setRekomendasi(null);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRekomendasi();
    }, [update])
  );

  const data = [
    {
      nama: "Category 1",
      value: rekomendasi ? rekomendasi.perbandingan.pendapatan : 10,
      warna: "#15B7B9",
    },
    {
      nama: "Category 2",
      value: rekomendasi ? rekomendasi.perbandingan.pengeluaran : 10,
      warna: "#F57170",
    },
  ];

  const CustomHeader = () => (
    <View className=" ">
      <View className="pt-12 bg-[#FFFFFE]  rounded-b-xl  z-20 ">
        <View className="p-2 flex flex-row items-center gap-2">
          <Text className="text-3xl font-bold w-3/4">Rekomendasi</Text>
        </View>
      </View>
      <View className="h-[85px] w-full bg-black opacity-10 absolute z-10 rounded-b-xl"></View>
    </View>
  );

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  // Fungsi untuk membuat arc dengan parameter sudut awal dan akhir
  const createArc = (startAngle, endAngle) => {
    const centerX = 100; // Pusat X di tengah viewBox
    const centerY = 200; // Pusat Y di bagian bawah untuk efek setengah donat
    const radius = 90; // Radius luar

    // Koordinat titik awal dan akhir arc
    const startX = centerX + radius * Math.cos(startAngle);
    const startY = centerY - radius * Math.sin(startAngle);
    const endX = centerX + radius * Math.cos(endAngle);
    const endY = centerY - radius * Math.sin(endAngle);

    // Flag untuk arc besar (lebih dari 180 derajat)
    const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;

    return `M ${centerX},${centerY} L ${startX},${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX},${endY} L ${centerX},${centerY} Z`;
  };

  let currentAngle = Math.PI; // Mulai dari sudut π (sisi kiri)

  return (
    <>
      <CustomHeader />
      <View className="">
        <ScrollView className="h-5/4">
          {rekomendasi ? (
            <View className="flex min-h-screen justify-start items-center bg-[#E3F6F5] w-full p-3 gap-4">
              <View className="bg-white  w-full flex justify-end items-center rounded-2xl p-2">
                <View className="w-full  flex-row justify-between">
                  <View className=" p-3">
                    <Text className="text-2xl font-bold">Perbandingan</Text>
                    <Text className="text-xl ">Pendapatan dan Penghasilan</Text>
                  </View>
                  <View className=" p-3">
                    <Text className="text-5xl font-bold">
                      {getNamaBulan(mm)}
                    </Text>
                  </View>
                </View>
                <Svg width="500" height="180" viewBox="0 100 200 100">
                  {/* Lingkaran tengah untuk membuat efek lubang donat */}

                  {/* Membuat segmen-segmen donat */}
                  {data.map((item, index) => {
                    const angle = (item.value / totalValue) * Math.PI;
                    const endAngle = currentAngle - angle;
                    const arc = createArc(currentAngle, endAngle);
                    currentAngle = endAngle;

                    return <Path key={index} d={arc} fill={item.warna} />;
                  })}
                  <Circle cx="100" cy="200" r="78" fill="white" />
                </Svg>
                <View className="flex-col justify-center items-center">
                  <View className="w-full flex-row justify-center">
                    <View className=" flex-col justify-center items-center p-3">
                      <View className="flex-row gap-2 items-center justify-center">
                        <View className="bg-[#15B7B9] w-9 h-9 rounded-full"></View>
                        <Text className="text-xl ">Pendapatan</Text>
                        <Text className="text-xl font-bold">
                          {(
                            (rekomendasi.perbandingan.pendapatan /
                              (rekomendasi.perbandingan.pendapatan +
                                rekomendasi.perbandingan.pengeluaran)) *
                            100
                          ).toFixed(1)}
                          %
                        </Text>
                      </View>
                      <Text className="text-2xl font-bold">
                        {formatRupiah(rekomendasi.perbandingan.pendapatan)}
                      </Text>
                    </View>
                    <View
                      style={{
                        borderRightWidth: 2,
                        borderRightColor: "black",
                        borderStyle: "dashed",
                        height: 70,
                        marginHorizontal: 10,
                      }}
                    />

                    <View className="flex-col justify-center items-center  p-3">
                      <View className="flex-row gap-2 items-center justify-center">
                        <Text className="text-xl ">Pengeluaran</Text>
                        <Text className="text-xl font-bold">
                          {(
                            (rekomendasi.perbandingan.pengeluaran /
                              (rekomendasi.perbandingan.pendapatan +
                                rekomendasi.perbandingan.pengeluaran)) *
                            100
                          ).toFixed(1)}
                          %
                        </Text>
                        <View className="bg-[#F57170] w-9 h-9 rounded-full"></View>
                      </View>
                      <Text className="text-2xl font-bold">
                        {formatRupiah(rekomendasi.perbandingan.pengeluaran)}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row gap-2">
                    <Text className="text-center text-xl">selisih</Text>
                    <Text className="text-center text-xl font-bold">
                      {formatRupiah(
                        rekomendasi.perbandingan.pendapatan -
                          rekomendasi.perbandingan.pengeluaran
                      )}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    borderBottomWidth: 2,
                    borderBottomColor: "black",
                    borderStyle: "dashed",
                    width: "100%",
                    marginVertical: 10,
                  }}
                />
                <View className="w-full p-2">
                  <View className="flex-row w-full justify-start items-center mb-3">
                    <Image
                      source={require("../../../assets/lampu.png")}
                      className="w-12 h-12 rounded-full"
                    />
                    <Text>Rekomendasi</Text>
                  </View>
                  <View className="px-4">
                    <Text>{rekomendasi.rekomendasi[0]}</Text>
                  </View>
                </View>
              </View>

              <View className="bg-white w-full flex justify-end items-center rounded-2xl p-2">
                <View className="w-full  ">
                  <Text className="text-2xl font-bold p-2">
                    Pengeluaran Tertinggi
                  </Text>
                </View>

                <View className="flex-col justify-center items-center w-full">
                  <View className="w-full flex-row justify-start items-center">
                    <Ionicons
                      name="wallet"
                      size={50}
                      color="black"
                      className="mr-2 m-5"
                    />
                    <View className="ms-10">
                      <Text className="text-xl font-bold">
                        {rekomendasi.kategori_pengeluaran_tertinggi &&
                          rekomendasi.kategori_pengeluaran_tertinggi
                            .nama_kategori}
                      </Text>
                      <Text className="text-lg">
                        Total yang dikeluarkan bulan ini:
                      </Text>
                      <Text className="text-xl font-bold">
                        {rekomendasi.kategori_pengeluaran_tertinggi &&
                          formatRupiah(
                            rekomendasi.kategori_pengeluaran_tertinggi
                              .total_pengeluaran
                          )}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    borderBottomWidth: 2,
                    borderBottomColor: "black",
                    borderStyle: "dashed",
                    width: "100%",
                    marginVertical: 10,
                  }}
                />
                <View className="w-full p-2">
                  <View className="flex-row w-full justify-start items-center mb-3">
                    <Image
                      source={require("../../../assets/lampu.png")}
                      className="w-12 h-12 rounded-full"
                    />
                    <Text>Rekomendasi</Text>
                  </View>
                  <View className="px-4">
                    <Text>{rekomendasi.rekomendasi[1]}</Text>
                  </View>
                </View>
              </View>

              <View className="bg-white w-full flex justify-end items-center rounded-2xl p-2 mb-32">
                <View className="w-full  ">
                  <Text className="text-2xl font-bold p-2">
                    Pendapatan Tertinggi
                  </Text>
                </View>

                <View className="flex-col justify-center items-center w-full">
                  <View className="w-full flex-row justify-start items-center">
                    <Ionicons
                      name="wallet"
                      size={50}
                      color="black"
                      className="mr-2 m-5"
                    />
                    <View className="ms-10">
                      <Text className="text-xl font-bold">
                        {rekomendasi.kategori_pendapatan_tertinggi &&
                          rekomendasi.kategori_pendapatan_tertinggi
                            .nama_kategori}
                      </Text>
                      <Text className="text-lg">
                        Total yang dikeluarkan bulan ini:
                      </Text>
                      <Text className="text-xl font-bold">
                        {rekomendasi.kategori_pendapatan_tertinggi &&
                          formatRupiah(
                            rekomendasi.kategori_pendapatan_tertinggi
                              .total_pendapatan
                          )}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    borderBottomWidth: 2,
                    borderBottomColor: "black",
                    borderStyle: "dashed",
                    width: "100%",
                    marginVertical: 10,
                  }}
                />
                <View className="w-full p-2">
                  <View className="flex-row w-full justify-start items-center mb-3">
                    <Image
                      source={require("../../../assets/lampu.png")}
                      className="w-12 h-12 rounded-full"
                    />
                    <Text>Rekomendasi</Text>
                  </View>
                  <View className="px-4">
                    <Text>{rekomendasi.rekomendasi[2]}</Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View className="flex-col min-h-screen justify-start items-center bg-[#E3F6F5] w-full p-3 gap-4">
              <View className="bg-white p-10 rounded-xl ">
                <Text className="text-xl font-bold">
                  belum ada data rekomendasi
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default RekomendasiScreen;
