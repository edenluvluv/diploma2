import React from "react";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="explore" />
      <Stack.Screen name="register" />
      <Stack.Screen name="login" />
      <Stack.Screen name="games" />
    </Stack>
  );
}