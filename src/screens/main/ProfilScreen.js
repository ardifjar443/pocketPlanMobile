import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons"; // Untuk ikon

const CustomHeader = ({ activeTab, onTabPress }) => (
  <View className="pt-12 bg-[#FFFFFE] pb-5 rounded-b-xl">
    <View className="p-2 flex flex-row items-center gap-2">
      <Text className="text-3xl font-bold w-3/4">Profile</Text>
    </View>
  </View>
);

const ProfilScreen = () => {
  return (
    <View className="flex-1 bg-[#E3F6F5]">
      <CustomHeader />
    <View className="flex-1 bg-[#E3F6F5] p-5">

      {/* Kartu Profil */}
      <View className="bg-white rounded-xl shadow-lg p-4 flex-row items-center">
        {/* Foto Profil */}
        <Image
          source={{ uri: "https://i.imgur.com/OD95U7Z.png" }} // Ganti dengan URL gambar profil
          className="w-16 h-16 rounded-full mr-4"
        />

        {/* Info Pengguna */}
        <View className="flex-1">
          <Text className="text-xl font-bold">Gari Baldi</Text>
          <Text className="text-gray-500">Id : 09832470921407234</Text>
          <Text className="text-gray-500">Bergabung Pada : 12/04/2024</Text>
        </View>
      </View>

      {/* Menu Pilihan */}
      <View className="bg-white rounded-xl shadow-lg mt-4">
        {/* Pengaturan */}
        <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-300">
          <Ionicons name="settings-outline" size={24} color="black" className="mr-3" />
          <Text className="text-lg font-bold flex-1">Pengaturan</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>

        {/* Hubungi Kami */}
        <TouchableOpacity className="flex-row items-center p-4">
          <FontAwesome5 name="pen-alt" size={24} color="black" className="mr-3" />
          <Text className="text-lg font-bold flex-1">Hubungi Kami</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Tombol Logout */}
      <TouchableOpacity className="bg-red-400 rounded-lg py-3 mt-5">
        <Text className="text-white text-center text-lg font-bold">Logout</Text>
      </TouchableOpacity>

    </View>
    </View>
  );
};

export default ProfilScreen;
