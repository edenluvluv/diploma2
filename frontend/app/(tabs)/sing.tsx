import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';

type Song = {
    songID: string;
    songTitle: string;
    URL: string;
    lyrics: string;
};

export default function SingScreen() {
    const { songID } = useLocalSearchParams();
    const router = useRouter();

    const [song, setSong] = useState<Song | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!songID || typeof songID !== 'string') {
            router.back();
            return;
        }

        fetch(`http://192.168.1.69:3000/api/songs/${songID}`)
            .then((res) => res.json())
            .then(setSong)
            .catch(() => router.back());

        return () => {
            sound?.unloadAsync();
        };
    }, [songID]);

    const playPause = async () => {
        if (!sound && song?.URL) {
            const { sound: loadedSound } = await Audio.Sound.createAsync({ uri: song.URL });
            setSound(loadedSound);
            await loadedSound.playAsync();
            setIsPlaying(true);
        } else if (sound) {
            const status = await sound.getStatusAsync();
            if ('isLoaded' in status && status.isLoaded) {
                if (status.isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
                } else {
                    await sound.playAsync();
                    setIsPlaying(true);
                }
            }
        }
    };

    if (!song) {
        return (
            <View style={styles.center}>
                <Text>Loading song...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{song.songTitle}</Text>
            <Button title={isPlaying ? 'Pause' : 'Play'} onPress={playPause} />
            <ScrollView style={styles.lyricsContainer}>
                <Text style={styles.lyricsText}>{song.lyrics}</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    lyricsContainer: { marginTop: 20, backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8 },
    lyricsText: { fontSize: 16, lineHeight: 24 },
});
