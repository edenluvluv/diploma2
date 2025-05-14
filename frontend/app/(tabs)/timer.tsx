// timer.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const MAX_TIME_MS = 10 * 60 * 1000; // 10 minutes
const STORAGE_KEY = 'dailyUsageTimer';

export const useDailyTimer = () => {
    const [isBlocked, setIsBlocked] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef(0);
    const router = useRouter();

    const todayKey = () => new Date().toISOString().split('T')[0];

    const loadTime = async () => {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const today = todayKey();

        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.date === today) {
                setTimeSpent(parsed.time);
                if (parsed.time >= MAX_TIME_MS) {
                    setIsBlocked(true);
                }
                return;
            }
        }

        // If it's a new day or no data
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, time: 0 }));
        setTimeSpent(0);
        setIsBlocked(false);
    };

    const saveTime = async (newTime: number) => {
        const today = todayKey();
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, time: newTime }));
    };

    const startTimer = () => {
        startTimeRef.current = Date.now();

        timerRef.current = setInterval(async () => {
            const now = Date.now();
            const elapsed = now - startTimeRef.current;
            const total = timeSpent + elapsed;

            if (total >= MAX_TIME_MS) {
                clearInterval(timerRef.current!);
                timerRef.current = null;
                setIsBlocked(true);
                await saveTime(MAX_TIME_MS);
                router.push("/");
            } else {
                await saveTime(total);
            }
        }, 1000);
    };

    const stopTimer = async () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            const now = Date.now();
            const newTime = timeSpent + (now - startTimeRef.current);
            setTimeSpent(newTime);
            await saveTime(newTime);
        }
    };

    useEffect(() => {
        loadTime();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const beginTracking = () => {
        if (isBlocked) {
            router.push("/");
            return;
        }
        startTimer();
    };

    const endTracking = () => {
        stopTimer();
    };

    return {
        isBlocked,
        beginTracking,
        endTracking,
    };
};

// Optional UI component for block message
export const BlockedMessage = () => (
    <Text style={{ padding: 20, fontSize: 16, textAlign: 'center', color: 'red' }}>
        You've reached your 10-minute play limit for today. Come back tomorrow!
    </Text>
);