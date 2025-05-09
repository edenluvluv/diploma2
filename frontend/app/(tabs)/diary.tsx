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

    const baseURL = 'http://localhost:8081/api/notes';


    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await axios.get(baseURL);
            setNotes(res.data);
        } catch (err) {
            Alert.alert('Error', 'Failed to fetch notes.');
        }
    };

    const handleSave = async () => {
        try {
            const userId = "your_user_id_here"; // Replace this with the actual user ID
            if (isEditing && selectedNote?._id) {
                await axios.put(`${baseURL}/${selectedNote._id}`, {
                    userId,
                    title: newTitle,
                    content: newContent
                });
            } else {
                await axios.post(baseURL, {
                    userId,
                    title: newTitle,
                    content: newContent
                });
            }

            setNewTitle('');
            setNewContent('');
            setSelectedNote(null);
            setIsEditing(false);
            fetchNotes();
        } catch (err) {
            Alert.alert('Error', 'Failed to save note.');
        }
    };
    

    const handleDelete = async (id: string | undefined) => {
        if (!id) return;
        try {
            await axios.delete(`${baseURL}/${id}`);
            setSelectedNote(null);
            fetchNotes();
        } catch (err) {
            Alert.alert('Error', 'Failed to delete note.');
        }
    };

    const renderGrid = () => {
        return (
            <ScrollView contentContainerStyle={styles.grid}>
                {notes.map((note) => (
                    <TouchableOpacity
                        key={note._id}
                        style={styles.card}
                        onPress={() => setSelectedNote(note)}
                    >
                        <Text style={styles.cardTitle}>{note.title}</Text>
                        <Text style={styles.cardContent}>
                            {note.content.substring(0, 30)}...
                        </Text>
                    </TouchableOpacity>
                ))}
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
                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    {selectedNote._id && (
                        <TouchableOpacity
                            style={[styles.button, styles.deleteButton]}
                            onPress={() => handleDelete(selectedNote._id)}
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
const cardSize = (screenWidth - 40) / 4;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: cardSize,
        backgroundColor: '#f2f2f2',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
    },
    addCard: {
        backgroundColor: '#d9fdd3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 5,
    },
    cardContent: {
        fontSize: 12,
        color: '#555',
    },
    messageView: {
        padding: 20,
    },
    inputLabel: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    multilineInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#3b82f6',
        padding: 10,
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
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default DiaryPage;
