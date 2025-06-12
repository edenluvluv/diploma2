import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import axios from 'axios';

type Song = {
    _id: string;
    songID: string;
    songTitle: string;
    URL: string;
    lyrics: string;
};

const generateSongID = () => {
    return 'song-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5);
};

const SongsPage = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [songTitle, setSongTitle] = useState('');
    const [URL, setURL] = useState('');
    const [lyrics, setLyrics] = useState('');
    const [editId, setEditId] = useState<string | null>(null);
    const [editSongID, setEditSongID] = useState(''); // keep original songID when editing

    const fetchSongs = async () => {
        try {
            const res = await axios.get('http://192.168.1.69:3000/api/songs');
            setSongs(res.data);
        } catch (err) {
            console.error('Fetch songs error:', err);
        }
    };

    useEffect(() => {
        fetchSongs();
    }, []);

    const clearForm = () => {
        setSongTitle('');
        setURL('');
        setLyrics('');
        setEditId(null);
        setEditSongID('');
    };

    const handleSubmit = async () => {
        if (!songTitle.trim()) {
            alert('Please enter the Song Title');
            return;
        }

        try {
            const songData = {
                songID: editId ? editSongID : generateSongID(),
                songTitle,
                URL,
                lyrics,
            };

            if (editId) {
                await axios.put(`http://192.168.1.69:3000/api/songs/${editId}`, songData);
            } else {
                await axios.post('http://192.168.1.69:3000/api/songs', songData);
            }

            clearForm();
            fetchSongs();
        } catch (err) {
            console.error('Save song error:', err);
            alert('Error saving song. Please try again.');
        }
    };

    const handleEdit = (song: Song) => {
        setEditId(song._id);
        setEditSongID(song.songID);
        setSongTitle(song.songTitle);
        setURL(song.URL);
        setLyrics(song.lyrics);
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`http://192.168.1.69:3000/api/songs/${id}`);
            fetchSongs();
        } catch (err) {
            console.error('Delete song error:', err);
            alert('Error deleting song. Please try again.');
        }
    };

    const renderSong = ({ item }: { item: Song }) => (
        <View style={styles.songCard}>
            <Text style={styles.songTitle}>{item.songTitle}</Text>
            <Text style={styles.songDetail}>
                <Text style={styles.label}>ID:</Text> {item.songID}
            </Text>
            <Text style={styles.songDetail}>
                <Text style={styles.label}>URL:</Text> {item.URL || '-'}
            </Text>
            <Text style={styles.lyrics} numberOfLines={3}>
                <Text style={styles.label}>Lyrics:</Text> {item.lyrics || '-'}
            </Text>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editBtn}>
                    <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteBtn}>
                    <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.select({ ios: 'padding', android: undefined })}
            keyboardVerticalOffset={80}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.header}>{editId ? 'Edit Song' : 'Add New Song'}</Text>

                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Song Title (required)"
                        value={songTitle}
                        onChangeText={setSongTitle}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="URL (optional)"
                        value={URL}
                        onChangeText={setURL}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Lyrics (optional)"
                        multiline
                        value={lyrics}
                        onChangeText={setLyrics}
                        textAlignVertical="top"
                    />

                    <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                        <Text style={styles.submitBtnText}>{editId ? 'Update Song' : 'Add Song'}</Text>
                    </TouchableOpacity>
                    {editId && (
                        <TouchableOpacity style={styles.cancelBtn} onPress={clearForm}>
                            <Text style={styles.cancelBtnText}>Cancel Edit</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <Text style={styles.listHeader}>Song List ({songs.length})</Text>
                <FlatList
                    data={songs}
                    keyExtractor={(item) => item._id}
                    renderItem={renderSong}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default SongsPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
        backgroundColor: '#fafafa',
    },
    scrollContainer: {
        paddingBottom: 40,
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 16,
        color: '#222',
        textAlign: 'center',
    },
    form: {
        marginBottom: 24,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        marginBottom: 12,
        backgroundColor: '#fff',
        color: '#333',
    },
    textArea: {
        height: 100,
    },
    submitBtn: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 10,
    },
    submitBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    cancelBtn: {
        backgroundColor: '#6c757d',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelBtnText: {
        color: '#fff',
        fontWeight: '600',
    },
    listHeader: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
        color: '#444',
    },
    list: {
        paddingBottom: 80,
    },
    songCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    songTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 6,
        color: '#222',
    },
    songDetail: {
        fontSize: 14,
        marginBottom: 4,
        color: '#555',
    },
    lyrics: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#666',
    },
    label: {
        fontWeight: '600',
        color: '#333',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 12,
    },
    editBtn: {
        marginRight: 20,
        paddingVertical: 6,
        paddingHorizontal: 14,
        backgroundColor: '#ffc107',
        borderRadius: 6,
    },
    deleteBtn: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        backgroundColor: '#dc3545',
        borderRadius: 6,
    },
    actionText: {
        color: '#fff',
        fontWeight: '600',
    },
});
