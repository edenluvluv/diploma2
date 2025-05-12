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
      <Stack.Screen name="achievements" />
      <Stack.Screen name="math" />
      <Stack.Screen name="admin" />
      <Stack.Screen name="diary" />
      <Stack.Screen name="next" />
      <Stack.Screen name="user" />
      <Stack.Screen name="letters" />
      <Stack.Screen name="letterspractice" />
      <Stack.Screen name="forum" />
      <Stack.Screen name="sing" />
    </Stack>
  );
}