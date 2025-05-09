import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    StyleSheet,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Song {
    _id?: string;
    title: string;
    artist: string;
}

const KaraokePage: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { role } = (route.params as { role?: string }) || { role: 'user' };

    const [songs, setSongs] = useState<Song[]>([]);
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');

    const fetchSongs = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/songs');
            const data = await response.json();
            setSongs(data);
        } catch (err) {
            console.error('Error fetching songs:', err);
        }
    };

    useEffect(() => {
        fetchSongs();
    }, []);

    const addSong = async () => {
        if (!title || !artist) {
            return Alert.alert('Бос жолдар', 'Ән мен орындаушыны толтырыңыз');
        }

        try {
            const response = await fetch('http://localhost:3000/api/songs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, artist }),
            });

            if (!response.ok) throw new Error('Failed to add song');
            setTitle('');
            setArtist('');
            fetchSongs();
        } catch (err) {
            Alert.alert('Қате', 'Ән қосу мүмкін болмады');
        }
    };

    const deleteSong = async (id?: string) => {
        if (!id) return;

        try {
            const response = await fetch(`http://localhost:3000/api/songs/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete song');
            fetchSongs();
        } catch (err) {
            Alert.alert('Қате', 'Әнді өшіру мүмкін болмады');
        }
    };

    const renderSong = ({ item }: { item: Song }) => (
        <View style={styles.songItem}>
            <Text style={styles.songText}>{item.title} - {item.artist}</Text>
            {role === 'admin' && (
                <TouchableOpacity onPress={() => deleteSong(item._id)}>
                    <Ionicons name="trash" size={20} color="#c00" />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.title}>🎤 Караоке</Text>

            {role === 'admin' && (
                <>
                    <TextInput
                        placeholder="Ән атауы"
                        value={title}
                        onChangeText={setTitle}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Орындаушы"
                        value={artist}
                        onChangeText={setArtist}
                        style={styles.input}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={addSong}>
                        <Text style={styles.addButtonText}>Қосу</Text>
                    </TouchableOpacity>
                </>
            )}

            <FlatList
                data={songs}
                keyExtractor={(item) => item._id || item.title}
                renderItem={renderSong}
                style={styles.songList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2F3F5',
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        alignSelf: 'center',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    addButton: {
        backgroundColor: '#28A745',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    songList: {
        flex: 1,
    },
    songItem: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    songText: {
        fontSize: 16,
        color: '#333',
    },
});

export default KaraokePage;
