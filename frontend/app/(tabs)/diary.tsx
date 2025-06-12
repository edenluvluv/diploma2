import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

type RootStackParamList = {
    diary: undefined;
    games: undefined;
};
type DiaryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'diary'>;
type Note = {
    _id?: string;
    title: string;
    content: string;
    mood?: string;
    createdAt?: Date;
};

const moodOptions = [
    { emoji: '😃', label: 'Бақытты' },
    { emoji: '😊', label: 'Жақсы' },
    { emoji: '😐', label: 'Окей' },
    { emoji: '😢', label: 'Мұңды' },
    { emoji: '😡', label: 'Ашулы' },
    { emoji: '🤔', label: 'Ойлаңқы' },
    { emoji: '😴', label: 'Шаршадым' },
    { emoji: '🤩', label: 'Қуаныштымын' }
];

const API_BASE_URL = 'http://192.168.1.69:3000/api/notes';

const KidDiaryBlog = () => {
    const navigation = useNavigation<DiaryScreenNavigationProp>();
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotes = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE_URL}?userId=anonymous`);
            setNotes(response.data);
        } catch (error) {
            console.error('Error loading notes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [selectedNote]);

    const handleSave = async () => {
        if (!newTitle.trim()) {
            Alert.alert('Ескерту', 'Күнделік жазбаңызға атау қойыңызшы!');
            return;
        }

        setIsLoading(true);
        try {
            const noteData = {
                userId: 'anonymous',
                title: newTitle,
                content: newContent,
                mood: selectedMood
            };

            if (isEditing && selectedNote?._id) {
                await axios.put(`${API_BASE_URL}/${selectedNote._id}`, noteData);
                Alert.alert('Алақай!', 'Күнделік жазбаңыз жаңартылды!');
            } else {
                await axios.post(API_BASE_URL, noteData);
                Alert.alert('Алақай!', 'Жаңа күнделік жазбасы жасалды');
            }

            setNewTitle('');
            setNewContent('');
            setSelectedMood(null);
            setSelectedNote(null);
            setIsEditing(false);
        } catch (err) {
            console.error('Error saving note:', err);
            Alert.alert('Oops!', 'Күнделік жазбасын сақтау сәтсіз. Қайтадан көріңіз!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string | undefined) => {
        if (!id) return;

        Alert.alert(
            "Сенімдісің бе?",
            "Бұл күнделік жазбасын өшіргің келетіндігіне сенімдісің бе?",
            [
                { text: "Жоқ", style: "cancel" },
                {
                    text: "Иә, өшір",
                    style: "destructive",
                    onPress: async () => {
                        setIsLoading(true);
                        try {
                            await axios.delete(`${API_BASE_URL}/${id}`);
                            Alert.alert('Дайын!', 'Күнделік жазбаңыз өшірілді!');
                            setSelectedNote(null);
                        } catch (err) {
                            console.error('Error deleting note:', err);
                            Alert.alert('Қате!', 'Өшіру сәтсіз. Қайта көріңіз!');
                        } finally {
                            setIsLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const formatDate = (dateString: string | Date | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderDiaryHeader = () => (
        <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('games')}>
                <Ionicons name="arrow-back" size={28} color="#1E3A8A" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Менің күнделігім</Text>
                <Text style={styles.headerSubtitle}>Сәлем! Бүгінгі көңіл-күйің қалай?</Text>
            </View>
        </View>
    );

    const renderFeed = () => (
        <ScrollView contentContainerStyle={styles.feed}>
            {renderDiaryHeader()}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text style={styles.loadingText}>Loading your diary entries...</Text>
                </View>
            ) : notes.length > 0 ? (
                notes.map((note) => (
                    <TouchableOpacity
                        key={note._id}
                        style={styles.postCard}
                        onPress={() => setSelectedNote(note)}
                    >
                        <View style={styles.postHeader}>
                            <Text style={styles.postTitle}>{note.title}</Text>
                            {note.mood && (
                                <Text style={styles.moodEmoji}>
                                    {moodOptions.find(m => m.label === note.mood)?.emoji || note.mood}
                                </Text>
                            )}
                        </View>
                        <Text style={styles.postContent}>
                            {note.content.length > 100
                                ? note.content.substring(0, 100) + '...'
                                : note.content}
                        </Text>
                        <Text style={styles.postDate}>{formatDate(note.createdAt)}</Text>
                    </TouchableOpacity>
                ))
            ) : (
                <View style={styles.emptyContainer}>
                    <FontAwesome5 name="book-open" size={60} color="#93C5FD" />
                    <Text style={styles.emptyText}>Күнделік бос тұр!</Text>
                    <Text style={styles.emptySubText}>Бүгін не болды? Жазып қой!</Text>
                </View>
            )}

            <TouchableOpacity
                style={styles.addPostButton}
                onPress={() => {
                    setNewTitle('');
                    setNewContent('');
                    setSelectedMood(null);
                    setIsEditing(false);
                    setSelectedNote({ title: '', content: '' });
                }}
            >
                <MaterialIcons name="add-circle" size={24} color="#FFFFFF" />
                <Text style={styles.addPostText}>Жаңа жазба қосу</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    const renderNoteEditor = () => {
        if (!selectedNote) return null;

        return (
            <ScrollView contentContainerStyle={styles.editorContainer}>
                <View style={styles.editorHeader}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                            setSelectedNote(null);
                            setIsEditing(false);
                        }}
                    >
                        <Ionicons name="close" size={24} color="#1E3A8A" />
                    </TouchableOpacity>
                    <Text style={styles.editorTitle}>
                        {isEditing ? 'Күнделік жазбасын өңдеу' : 'Жаңа жазба'}
                    </Text>
                </View>

                <Text style={styles.inputLabel}>Атауы</Text>
                <TextInput
                    value={newTitle}
                    onChangeText={setNewTitle}
                    style={styles.input}
                    placeholder="Не жайлы жазбақшысың?"
                    placeholderTextColor="#94A3B8"
                />

                <Text style={styles.inputLabel}>Көңіл-күй</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moodSelector}>
                    {moodOptions.map((mood) => (
                        <TouchableOpacity
                            key={mood.label}
                            style={[
                                styles.moodItem,
                                selectedMood === mood.label && styles.selectedMoodItem
                            ]}
                            onPress={() => setSelectedMood(mood.label)}
                        >
                            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                            <Text style={styles.moodLabel}>{mood.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={styles.inputLabel}>Ойларың</Text>
                <TextInput
                    value={newContent}
                    onChangeText={setNewContent}
                    style={[styles.input, styles.multilineInput]}
                    placeholder="Бүгін не болды? Қалай өтті?"
                    placeholderTextColor="#94A3B8"
                    multiline
                />

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.button, styles.saveButton, isLoading && styles.disabledButton]}
                        onPress={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <>
                                <Ionicons name="save" size={20} color="#FFFFFF" />
                                <Text style={styles.buttonText}>Сақтау</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {selectedNote._id && (
                        <TouchableOpacity
                            style={[styles.button, styles.deleteButton]}
                            onPress={() => handleDelete(selectedNote._id)}
                        >
                            <Ionicons name="trash" size={20} color="#FFFFFF" />
                            <Text style={styles.buttonText}>Өшіру</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        );
    };

    useEffect(() => {
        if (selectedNote) {
            setNewTitle(selectedNote.title || '');
            setNewContent(selectedNote.content || '');
            setSelectedMood(selectedNote.mood || null);
            setIsEditing(!!selectedNote._id);
        }
    }, [selectedNote]);

    return <View style={styles.container}>{selectedNote ? renderNoteEditor() : renderFeed()}</View>;
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F9FF' },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 40,
        paddingBottom: 15,
        backgroundColor: '#DBEAFE',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTextContainer: { marginLeft: 15 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E3A8A' },
    headerSubtitle: { fontSize: 16, color: '#3B82F6', marginTop: 5 },
    backButton: { padding: 5 },
    feed: { paddingBottom: 40 },
    loadingContainer: { padding: 30, alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 16, color: '#475569' },
    postCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        margin: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    postHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    postTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
    moodEmoji: { fontSize: 24, marginLeft: 8 },
    postContent: { fontSize: 16, color: '#334155', marginBottom: 12, lineHeight: 22 },
    postDate: { fontSize: 14, color: '#64748B', textAlign: 'right', fontStyle: 'italic' },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 40 },
    emptyText: { fontSize: 20, fontWeight: '600', color: '#3B82F6', marginTop: 20 },
    emptySubText: { fontSize: 16, color: '#64748B', textAlign: 'center', marginTop: 10 },
    addPostButton: {
        backgroundColor: '#3B82F6',
        flexDirection: 'row',
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15,
        marginTop: 10,
        marginBottom: 30,
    },
    addPostText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginLeft: 8 },
    editorContainer: { padding: 20, paddingTop: 40 },
    editorHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    closeButton: { padding: 5 },
    editorTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E3A8A', marginLeft: 10 },
    inputLabel: { fontWeight: '600', marginBottom: 8, fontSize: 16, color: '#1E3A8A' },
    input: {
        borderWidth: 1,
        borderColor: '#BFDBFE',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        marginBottom: 20,
        fontSize: 16,
        color: '#0F172A',
    },
    multilineInput: { minHeight: 150, textAlignVertical: 'top' },
    moodSelector: { flexDirection: 'row', paddingBottom: 10, marginBottom: 20 },
    moodItem: {
        alignItems: 'center',
        marginRight: 15,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    selectedMoodItem: {
        borderColor: '#3B82F6',
        backgroundColor: '#EFF6FF',
    },
    moodLabel: { marginTop: 5, fontSize: 12, color: '#64748B' },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        borderRadius: 12,
        flex: 1,
        marginHorizontal: 5,
    },
    saveButton: { backgroundColor: '#3B82F6' },
    deleteButton: { backgroundColor: '#EF4444' },
    disabledButton: { opacity: 0.6 },
    buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16, marginLeft: 5 },
});

export default KidDiaryBlog;
