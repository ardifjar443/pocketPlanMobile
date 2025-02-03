import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Popup = ({ visible, onClose, content, judul, notif }) => {
  const fadeAnim = new Animated.Value(0); // Opacity (dimulai dengan 0)
  const slideAnim = new Animated.Value(200); // Posisi (dimulai di bawah layar)

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animasi keluar
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 200,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Setelah animasi selesai, panggil onClose
        onClose();
      });
    }
  }, [visible]);

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-center items-center bg-black/75"
        onPress={() => {
          // Animasi close sebelum memanggil onClose
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 200,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onClose(); // Menutup setelah animasi selesai
          });
        }}
      ></Pressable>
      <View className="absolute w-3/4 bottom-96 left-16 items-center justify-center bg-white p-5 rounded-2xl shadow-lg">
        <View className="  flex-row justify-start items-center mb-3">
          <Text className="text-xl font-bold ">{judul}</Text>
        </View>
        <View className="flex justify-center items-center">{content}</View>
        {notif && (
          <View className="flex justify-center items-center">
            <TouchableOpacity
              className="bg-[#15B7B9] p-2 w-1/2 rounded-xl mt-10"
              onPress={() => {
                onClose();
              }}
            >
              <Text className="text-center font-bold text-white text-2xl px-8">
                OK
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default Popup;
