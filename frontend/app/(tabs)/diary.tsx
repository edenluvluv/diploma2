import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    Dimensions
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Note = {
    _id?: string;
    title: string;
    content: string;
};

const DiaryPage = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Update this to match your backend URL
    const baseURL = 'http://localhost:3000/api/notes';

    useEffect(() => {
        // Load auth token and user ID when component mounts
        const loadAuthData = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('authToken');
                const userData = await AsyncStorage.getItem('userData');
                
                if (storedToken) {
                    setToken(storedToken);
                }
                
                if (userData) {
                    const parsedUserData = JSON.parse(userData);
                    setUserId(parsedUserData.id);
                } else {
                    // If no user data, use a default ID
                    setUserId('guest_user');
                }
            } catch (error) {
                console.error('Error loading auth data:', error);
                // Set a default user ID if we can't load from storage
                setUserId('guest_user');
            }
        };

        loadAuthData();
    }, []);

    useEffect(() => {
        // Only fetch notes after we have a userId
        if (userId) {
            fetchNotes();
        }
    }, [userId]);

    const fetchNotes = async () => {
        if (!userId) return;
        
        setIsLoading(true);
        try {
            console.log('Fetching notes from:', baseURL);
            
            const config = token ? {
                headers: { Authorization: `Bearer ${token}` }
            } : {};
            
            const res = await axios.get(baseURL, config);
            console.log('Fetched notes:', res.data);
            
            // Filter notes by userId if needed
            const userNotes = res.data.filter((note: any) => note.userId === userId);
            setNotes(userNotes);
        } catch (err) {
            console.error('Error fetching notes:', err);
            Alert.alert('Error', 'Failed to fetch notes. Please check if the server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!userId) {
            Alert.alert('Error', 'User ID is not available');
            return;
        }

        if (!newTitle.trim() || !newContent.trim()) {
            Alert.alert('Error', 'Title and content cannot be empty');
            return;
        }

        setIsLoading(true);
        try {
            console.log('Saving note...');
            
            const config = token ? {
                headers: { Authorization: `Bearer ${token}` }
            } : {};
            
            if (isEditing && selectedNote?._id) {
                console.log('Updating note with ID:', selectedNote._id);
                await axios.put(`${baseURL}/${selectedNote._id}`, {
                    userId,
                    title: newTitle,
                    content: newContent
                }, config);
                Alert.alert('Success', 'Note updated successfully');
            } else {
                console.log('Creating new note');
                await axios.post(baseURL, {
                    userId,
                    title: newTitle,
                    content: newContent
                }, config);
                Alert.alert('Success', 'Note created successfully');
            }

            setNewTitle('');
            setNewContent('');
            setSelectedNote(null);
            setIsEditing(false);
            fetchNotes();
        } catch (err) {
            console.error('Error saving note:', err);
            Alert.alert('Error', 'Failed to save note. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDelete = async (id: string | undefined) => {
        if (!id) return;
        
        setIsLoading(true);
        try {
            console.log('Deleting note with ID:', id);
            
            const config = token ? {
                headers: { Authorization: `Bearer ${token}` }
            } : {};
            
            await axios.delete(`${baseURL}/${id}`, config);
            Alert.alert('Success', 'Note deleted successfully');
            setSelectedNote(null);
            fetchNotes();
        } catch (err) {
            console.error('Error deleting note:', err);
            Alert.alert('Error', 'Failed to delete note. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderGrid = () => {
        return (
            <ScrollView contentContainerStyle={styles.grid}>
                {isLoading ? (
                    <Text style={styles.loadingText}>Loading notes...</Text>
                ) : notes.length > 0 ? (
                    notes.map((note) => (
                        <TouchableOpacity
                            key={note._id}
                            style={styles.card}
                            onPress={() => setSelectedNote(note)}
                        >
                            <Text style={styles.cardTitle}>{note.title}</Text>
                            <Text style={styles.cardContent}>
                                {note.content.substring(0, 30)}
                                {note.content.length > 30 && '...'}
                            </Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No notes found. Create one!</Text>
                )}
                <TouchableOpacity
                    style={[styles.card, styles.addCard]}
                    onPress={() => {
                        setNewTitle('');
                        setNewContent('');
                        setIsEditing(false);
                        setSelectedNote({ title: '', content: '' });
                    }}
                >
                    <Text style={styles.cardTitle}>+ Add</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    };

    const renderNoteView = () => {
        if (!selectedNote) return null;

        return (
            <ScrollView contentContainerStyle={styles.messageView}>
                <Text style={styles.inputLabel}>Title</Text>
                <TextInput
                    value={newTitle}
                    onChangeText={setNewTitle}
                    style={styles.input}
                    placeholder="Enter title"
                />
                <Text style={styles.inputLabel}>Content</Text>
                <TextInput
                    value={newContent}
                    onChangeText={setNewContent}
                    style={[styles.input, styles.multilineInput]}
                    placeholder="Enter content"
                    multiline
                />
                <View style={styles.buttonRow}>
                    <TouchableOpacity 
                        style={[styles.button, isLoading && styles.disabledButton]} 
                        onPress={handleSave}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Saving...' : 'Save'}
                        </Text>
                    </TouchableOpacity>
                    {selectedNote._id && (
                        <TouchableOpacity
                            style={[styles.button, styles.deleteButton, isLoading && styles.disabledButton]}
                            onPress={() => handleDelete(selectedNote._id)}
                            disabled={isLoading}
                        >
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => {
                            setSelectedNote(null);
                            setIsEditing(false);
                        }}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    };

    useEffect(() => {
        if (selectedNote) {
            setNewTitle(selectedNote.title);
            setNewContent(selectedNote.content);
            setIsEditing(!!selectedNote._id);
        }
    }, [selectedNote]);

    return (
        <View style={styles.container}>
            {selectedNote ? renderNoteView() : renderGrid()}
        </View>
    );
};

const screenWidth = Dimensions.get('window').width;
const cardSize = (screenWidth - 60) / 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: cardSize,
        height: cardSize,
        backgroundColor: '#f2f2f2',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
    },
    addCard: {
        backgroundColor: '#d9fdd3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    cardContent: {
        fontSize: 14,
        color: '#555',
    },
    messageView: {
        padding: 20,
    },
    inputLabel: {
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        fontSize: 16,
    },
    multilineInput: {
        minHeight: 150,
        textAlignVertical: 'top',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#3b82f6',
        padding: 15,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
    },
    deleteButton: {
        backgroundColor: '#ef4444',
    },
    cancelButton: {
        backgroundColor: '#9ca3af',
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loadingText: {
        textAlign: 'center',
        padding: 20,
        color: '#555',
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
        color: '#555',
        width: '100%',
        fontSize: 16,
    },
});

export default DiaryPage;