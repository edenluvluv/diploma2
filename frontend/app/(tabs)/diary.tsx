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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
    diary: undefined;
    games: undefined;
};
type DiaryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'diary'>;
type Note = {
    _id?: string;
    title: string;
    content: string;
};

const DiaryPage = () => {

    const navigation = useNavigation<DiaryScreenNavigationProp>();

    const handleBack = () => {
        navigation.navigate('games'); // Navigate back to the games page
    };

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

    const renderFeed = () => {
        return (
            <ScrollView contentContainerStyle={styles.feed}>
                {isLoading ? (
                    <Text style={styles.loadingText}>Loading notes...</Text>
                ) : notes.length > 0 ? (
                    notes.map((note) => (
                        <TouchableOpacity
                            key={note._id}
                            style={styles.postCard}
                            onPress={() => setSelectedNote(note)}
                        >
                            <Text style={styles.postTitle}>{note.title}</Text>
                            <Text style={styles.postContent}>
                                {note.content.length > 100
                                    ? note.content.substring(0, 100) + '...'
                                    : note.content}
                            </Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No notes found. Create one!</Text>
                )}

                <TouchableOpacity
                    style={styles.addPostButton}
                    onPress={() => {
                        setNewTitle('');
                        setNewContent('');
                        setIsEditing(false);
                        setSelectedNote({ title: '', content: '' });
                    }}
                >
                    <Text style={styles.addPostText}>+ Create a new post</Text>
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
        <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" size={28} color="#1E3A8A" />
            </TouchableOpacity>
            <View style={styles.container}>
                {selectedNote ? renderNoteView() : renderFeed()}
            </View>
        </View>
    );
};

const screenWidth = Dimensions.get('window').width;
const cardSize = (screenWidth - 60) / 4; 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0F2FE',
        padding: 15,
        paddingTop: 80, // <-- add this
    },    
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10, // add this
    },    
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: cardSize,
        height: cardSize,
        backgroundColor: '#FFFFFF',
        padding: 10,
        marginBottom: 10,
        borderRadius: 14,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },    
    addCard: {
        backgroundColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontWeight: '700',
        fontSize: 18,
        color: '#1E3A8A',
        marginBottom: 6,
    },
    cardContent: {
        fontSize: 14,
        color: '#475569',
    },
    messageView: {
        padding: 20,
        backgroundColor: '#F0F9FF',
        borderRadius: 12,
        margin: 10,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputLabel: {
        fontWeight: '600',
        marginBottom: 6,
        fontSize: 16,
        color: '#1E3A8A',
    },
    input: {
        borderWidth: 1,
        borderColor: '#BFDBFE',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
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
        marginTop: 10,
    },
    button: {
        backgroundColor: '#3B82F6',
        padding: 14,
        borderRadius: 12,
        flex: 1,
        marginHorizontal: 5,
    },
    deleteButton: {
        backgroundColor: '#EF4444',
    },
    cancelButton: {
        backgroundColor: '#6B7280',
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 16,
    },
    loadingText: {
        textAlign: 'center',
        padding: 20,
        color: '#475569',
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
        color: '#475569',
        width: '100%',
        fontSize: 16,
    },
    feed: {
    paddingBottom: 20,
},

postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
},

postTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
},

postContent: {
    fontSize: 15,
    color: '#334155',
},

addPostButton: {
    backgroundColor: '#DBEAFE',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
},

addPostText: {
    color: '#1D4ED8',
    fontSize: 16,
    fontWeight: '600',
},

});


export default DiaryPage;