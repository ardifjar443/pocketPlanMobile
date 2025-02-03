import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Pendapatan from "./Pendapatan";
import Pengeluaran from "./Pengeluaran";
import { Ionicons } from "@expo/vector-icons";
import Keuangan from "./keuangan";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Tab = createMaterialTopTabNavigator();
const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const CustomHeader = ({ activeTab, saldo, name, pendapatan, pengeluaran }) => {
  return (
    <View className="pt-12 bg-[#FFFFFE]">
      <View className="p-2 flex flex-row items-center gap-2">
        <Image
          source={require("../../../../assets/profile.png")}
          className="w-12 h-12 rounded-full"
        />
        <Text className="text-3xl font-bold w-3/4">Hi, {name}!</Text>
      </View>
      <View>
        {activeTab === "Pendapatan" ? (
          <View>
            <Text className="text-center text-xl">Total Pendapatan Anda :</Text>
            <Text className="text-center text-4xl font-bold">
              {formatRupiah(pendapatan)}
            </Text>
          </View>
        ) : activeTab === "Keuangan" ? (
          <View>
            <Text className="text-center text-xl">Total Saldo Anda :</Text>
            <Text className="text-center text-4xl font-bold">
              {formatRupiah(saldo)}
            </Text>
          </View>
        ) : (
          <View>
            <Text className="text-center text-xl">
              Total Pengeluaran Anda :
            </Text>
            <Text className="text-center text-4xl font-bold">
              {formatRupiah(pengeluaran)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const HomeScreen = ({ update, updating }) => {
  const [dataUser, setDataUser] = useState(null); // Menyimpan data dari API
  const [loading, setLoading] = useState(true); // Loading state
  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        console.log("Token tidak ditemukan");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDataUser(response.data); // Simpan data ke state
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false); // Matikan loading
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [update])
  );

  // State untuk menyimpan tab aktif
  const [activeTab, setActiveTab] = useState("Pendapatan");
  const navigation = useNavigation();

  useEffect(() => {
    // Memastikan selalu menuju ke HomeScreen dan ke tab Pendapatan
    navigation.navigate("Home", { screen: "Keuangan" });
  }, [navigation]);

  console.log(dataUser);

  return (
    <View className="bg-[#E3F6F5] flex-1">
      <CustomHeader
        activeTab={activeTab}
        saldo={dataUser && dataUser.data.saldo}
        name={dataUser && dataUser.data.name}
        pendapatan={dataUser && dataUser.data_keuangan.total_pendapatan}
        pengeluaran={dataUser && dataUser.data_keuangan.total_pengeluaran}
      />
      <Tab.Navigator
        initialRouteName="Keuangan"
        screenListeners={{
          state: (e) => {
            const index = e.data.state.index; // Ambil index tab aktif
            const name = e.data.state.routeNames[index]; // Ambil nama tab aktif
            setActiveTab(name); // Update state activeTab
          },
        }}
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "white",
          tabBarLabelStyle: { fontSize: 12 },
          headerShown: false,
          tabBarLabel: ({ focused }) => {
            if (route.name === "Keuangan") {
              // Jika tab adalah Keuangan, tampilkan ikon
              return <Ionicons name="wallet" size={24} color="black" />;
            } else {
              // Untuk tab lainnya, tampilkan nama rute
              return <Text>{route.name}</Text>;
            }
          },
          tabBarIndicatorStyle: {
            height: 4,
            backgroundColor:
              route.name === "Pendapatan"
                ? "#15B7B9"
                : route.name === "Pengeluaran"
                ? "#F57170"
                : "black",
          },
          tabBarStyle: {
            backgroundColor: "#FFFFFE",
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
            overflow: "hidden",
          },
        })}
      >
        <Tab.Screen name="Pendapatan">
          {(props) => (
            <Pendapatan {...props} updating={updating} update={update} />
          )}
        </Tab.Screen>
        <Tab.Screen name="Keuangan">
          {(props) => (
            <Keuangan {...props} updating={updating} update={update} />
          )}
        </Tab.Screen>
        <Tab.Screen name="Pengeluaran">
          {(props) => (
            <Pengeluaran {...props} updating={updating} update={update} />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

export default HomeScreen;
