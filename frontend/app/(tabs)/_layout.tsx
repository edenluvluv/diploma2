import React, { useEffect } from "react";
import { Stack, usePathname } from "expo-router";
import { useDailyTimer, BlockedMessage } from "./timer"; // adjust path if needed

export default function Layout() {
  const pathname = usePathname();
  const { isBlocked, beginTracking, endTracking } = useDailyTimer();

  // List of pages that should show the blocked message
  const blockedPages = [
    "/pair",
    "/math",
    "/next",
    "/memory",
    "/maze",
    "/letterspractice",
  ];

  useEffect(() => {
    beginTracking();
    return () => endTracking();
  }, []);

  const shouldShowBlockedMessage = blockedPages.includes(pathname);

  return (
    <>
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
        <Stack.Screen name="songs" />
        <Stack.Screen name="pair" />
        <Stack.Screen name="memory" />
        <Stack.Screen name="maze" />
      </Stack>

      {isBlocked && shouldShowBlockedMessage && <BlockedMessage />}
    </>
  );
}
