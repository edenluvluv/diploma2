// app/(tabs)/karaoke.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

type Song = {
    songID: string;
    songTitle: string;
    URL: string;
    lyrics: string;
};

export default function KaraokeScreen() {
    const [songs, setSongs] = useState<Song[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetch('http://localhost:3000/api/songs')
            .then((res) => res.json())
            .then(setSongs)
            .catch(console.error);
    }, []);

    const onSongPress = (song: Song) => {
        router.push({
            pathname: '/sing',
            params: { songID: song.songID },
        });
    };

    const renderItem = ({ item }: { item: Song }) => (
        <TouchableOpacity onPress={() => onSongPress(item)} style={styles.songItem}>
            <Text style={styles.songTitle}>{item.songTitle}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={songs}
                keyExtractor={(item) => item.songID}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    songItem: { padding: 16 },
    songTitle: { fontSize: 18, color: '#333' },
    separator: { height: 1, backgroundColor: '#ccc', marginHorizontal: 16 },
});
