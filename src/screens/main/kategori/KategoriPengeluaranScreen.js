const { View, Text, ScrollView } = require("react-native");
import CardPie from "./CardPie";
import { Ionicons } from "@expo/vector-icons";

const CardKatPengeluaran = ({}) => {
  return (
    <View className="bg-white rounded-xl shadow-lg p-4 my-3 flex gap-7">
      <ScrollView className="h-[210]">

      <View className="flex-row justify-between items-center">
        
        <View className="flex-row items-center">
          <Ionicons name="wallet" size={35} color="black" className="mr-2" />
          <View>
            <Text className="text-black font-bold text-lg">Kategori</Text>
          </View>
        </View>
        <Text className=" font-bold text-xl">Rp.100.000</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons name="wallet" size={35} color="black" className="mr-2" />
          <View>
            <Text className="text-black font-bold text-lg">Kategori</Text>
          </View>
        </View>
        <Text className=" font-bold text-xl">Rp.100.000</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons name="wallet" size={35} color="black" className="mr-2" />
          <View>
            <Text className="text-black font-bold text-lg">Kategori</Text>
          </View>
        </View>
        <Text className=" font-bold text-xl">Rp.100.000</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons name="wallet" size={35} color="black" className="mr-2" />
          <View>
            <Text className="text-black font-bold text-lg">Kategori</Text>
          </View>
        </View>
        <Text className=" font-bold text-xl">Rp.100.000</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons name="wallet" size={35} color="black" className="mr-2" />
          <View>
            <Text className="text-black font-bold text-lg">Kategori</Text>
          </View>
        </View>
        <Text className=" font-bold text-xl">Rp.100.000</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons name="wallet" size={35} color="black" className="mr-2" />
          <View>
            <Text className="text-black font-bold text-lg">Kategori</Text>
          </View>
        </View>
        <Text className=" font-bold text-xl">Rp.100.000</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons name="wallet" size={35} color="black" className="mr-2" />
          <View>
            <Text className="text-black font-bold text-lg">Kategori</Text>
          </View>
        </View>
        <Text className=" font-bold text-xl">Rp.100.000</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons name="wallet" size={35} color="black" className="mr-2" />
          <View>
            <Text className="text-black font-bold text-lg">Kategori</Text>
          </View>
        </View>
        <Text className=" font-bold text-xl">Rp.100.000</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons name="wallet" size={35} color="black" className="mr-2" />
          <View>
            <Text className="text-black font-bold text-lg">Kategori</Text>
          </View>
        </View>
        <Text className=" font-bold text-xl">Rp.100.000</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons name="wallet" size={35} color="black" className="mr-2" />
          <View>
            <Text className="text-black font-bold text-lg">Kategori</Text>
          </View>
        </View>
        <Text className=" font-bold text-xl">Rp.100.000</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons name="wallet" size={35} color="black" className="mr-2" />
          <View>
            <Text className="text-black font-bold text-lg">Kategori</Text>
          </View>
        </View>
        <Text className=" font-bold text-xl">Rp.100.000</Text>
      </View>
</ScrollView>
    </View>
  );
};

KategoriPengeluaranScreen = () => {
  const widthAndHeight = 250;
  const series = [
    { value: 430, color: "#fbd203", label: { text: "A", fontWeight: "bold" } },
    {
      value: 321,
      color: "#ffb300",
      label: { text: "mobile", offsetY: 10, offsetX: 10 },
    },
    {
      value: 185,
      color: "#ff9100",
      label: {
        text: "%22",
        fontSize: 8,
        fontStyle: "italic",
        outline: "white",
      },
    },
    { value: 123, color: "#ff6c00" },
  ];

  return (
    <View className="bg-[#E3F6F5]">
      <View className="flex  pt-10 items-center mb-10 bg-white p-3 mt-8 m-8 rounded-xl shadow-lg">
        <CardPie data={series} />
      </View>
      <View className="flex-row px-5 gap-5 w-40">
        <View className="bg-white w-full p-2 rounded-xl shadow-lg">
          <Text className="text-center text-lg">Harian</Text>
          <Text className="text-center text-xl font-bold">Rp.5000</Text>
        </View>
        <View className="bg-white w-full p-2 rounded-xl shadow-lg">
          <Text className="text-center text-lg">Mingguan</Text>
          <Text className="text-center text-xl font-bold">Rp.5000</Text>
        </View>
        <View className="bg-white w-full p-2 rounded-xl shadow-lg">
          <Text className="text-center text-lg">Bulanan</Text>
          <Text className="text-center text-xl font-bold">Rp.5000</Text>
        </View>
      </View>

      <View className=" p-4">
        
          <CardKatPengeluaran />
        
      </View>
    </View>
  );
};

export default KategoriPengeluaranScreen;
