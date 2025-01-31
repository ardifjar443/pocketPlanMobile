import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MainTab from "./MainTab";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTab} />
    </Stack.Navigator>
  );
}
