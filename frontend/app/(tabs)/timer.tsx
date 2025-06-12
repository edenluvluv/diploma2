// timer.tsx
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const MAX_TIME_MS = 1 * 60 * 1000;
const STORAGE_KEY = 'dailyUsageTimer';

export const useDailyTimer = () => {
    const [isBlocked, setIsBlocked] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number>(0);
    const isTrackingRef = useRef(false);

    const todayKey = () => new Date().toISOString().split('T')[0];

    const loadTime = async () => {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            const today = todayKey();

            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.date === today) {
                    const currentTime = parsed.time || 0;
                    setTimeSpent(currentTime);
                    if (currentTime >= MAX_TIME_MS) {
                        setIsBlocked(true);
                        return currentTime;
                    }
                    return currentTime;
                }
            }

            // New day or no data
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, time: 0 }));
            setTimeSpent(0);
            setIsBlocked(false);
            return 0;
        } catch (error) {
            console.error('Error loading time:', error);
            return 0;
        }
    };

    const saveTime = async (newTime: number) => {
        try {
            const today = todayKey();
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, time: newTime }));
        } catch (error) {
            console.error('Error saving time:', error);
        }
    };

    const startTimer = () => {
        if (isBlocked || isTrackingRef.current || timerRef.current) return;

        startTimeRef.current = Date.now();
        isTrackingRef.current = true;

        timerRef.current = setInterval(async () => {
            if (!isTrackingRef.current) return;

            const now = Date.now();
            const sessionElapsed = now - startTimeRef.current;
            const totalTime = timeSpent + sessionElapsed;

            if (totalTime >= MAX_TIME_MS) {
                clearInterval(timerRef.current!);
                timerRef.current = null;
                isTrackingRef.current = false;
                startTimeRef.current = 0;
                await saveTime(MAX_TIME_MS);
                setTimeSpent(MAX_TIME_MS);
                setIsBlocked(true);
            } else {
                await saveTime(totalTime);
                setTimeSpent(totalTime);
            }
        }, 1000);
    };

    const stopTimer = async () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        if (isTrackingRef.current && startTimeRef.current > 0) {
            const now = Date.now();
            const sessionElapsed = now - startTimeRef.current;
            const newTotalTime = timeSpent + sessionElapsed;

            isTrackingRef.current = false;
            startTimeRef.current = 0;
            setTimeSpent(newTotalTime);
            await saveTime(newTotalTime);

            if (newTotalTime >= MAX_TIME_MS) {
                setIsBlocked(true);
            }
        }
    };

    useEffect(() => {
        loadTime();
    }, []);

    useEffect(() => {
        const checkInterval = setInterval(async () => {
            if (!isTrackingRef.current) {
                const currentTime = await loadTime();
                if (currentTime >= MAX_TIME_MS) {
                    setIsBlocked(true);
                }
            }
        }, 5000);

        return () => clearInterval(checkInterval);
    }, []);

    useEffect(() => {
        const sub = AppState.addEventListener('change', (state) => {
            if (state === 'background' || state === 'inactive') {
                stopTimer();
            } else if (state === 'active') {
                startTimer();
            }
        });

        return () => {
            sub.remove();
            stopTimer();
        };
    }, []);

    const beginTracking = () => {
        if (isBlocked) return;
        startTimer();
    };

    const endTracking = () => {
        stopTimer();
    };

    const resetTimer = async () => {
        await AsyncStorage.removeItem(STORAGE_KEY);
        setTimeSpent(0);
        setIsBlocked(false);
    };

    return {
        isBlocked,
        timeSpent,
        timeRemaining: Math.max(0, MAX_TIME_MS - timeSpent),
        beginTracking,
        endTracking,
        resetTimer,
    };
};

export const BlockedMessage = () => {
    const router = useRouter();

    return (
        <View style={styles.overlay}>
            <View style={styles.messageBox}>
                <Text style={styles.title}>⏰ Уақытыңыз бітті!</Text>
                <Text style={styles.text}>1 минуттық лимитке жеттіңіз. Ертең қайта келіңіз.</Text>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/games')}>
                    <Text style={styles.buttonText}>Ойындар бетіне оралу</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    messageBox: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        width: '80%',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#17696F',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
