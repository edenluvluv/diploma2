import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert,
    Modal,
    TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
const API_BASE = process.env.EXPO_PUBLIC_API_BASE!;

type RootStackParamList = {
    songs: undefined;
    // other routes can be added here if needed
};

type AdminScreenNavigationProp = StackNavigationProp<RootStackParamList, 'songs'>;

type User = {
    _id: string;
    fullName: string;
    email: string;
    role: string;
};

const AdminPage: React.FC = () => {
    const navigation = useNavigation<AdminScreenNavigationProp>();
    const [users, setUsers] = useState<User[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [newFullName, setNewFullName] = useState('');
    const [newRole, setNewRole] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://192.168.1.69:3000/api/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const deleteUser = async (userId: string) => {
        Alert.alert(
            'Delete User',
            'Are you sure you want to delete this user?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`http://192.168.1.69:3000/api/users/${userId}`, {
                                method: 'DELETE',
                            });

                            if (!response.ok) throw new Error('Failed to delete user');

                            setUsers(users.filter(user => user._id !== userId));
                        } catch (error) {
                            console.error('Error deleting user:', error);
                            Alert.alert('Error', 'Failed to delete user.');
                        }
                    }
                }
            ]
        );
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setNewFullName(user.fullName);
        setNewRole(user.role);
        setModalVisible(true);
    };

    const saveEditUser = async () => {
        if (!editingUser) return;

        try {
            const response = await fetch(`http://192.168.1.69:3000/api/users/${editingUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName: newFullName, role: newRole }),
            });

            if (!response.ok) throw new Error('Failed to update user');

            const updatedUser = await response.json();
            setUsers(users.map(user => (user._id === editingUser._id ? updatedUser : user)));
            setModalVisible(false);
        } catch (error) {
            console.error('Error updating user:', error);
            Alert.alert('Error', 'Failed to update user.');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color="black" />
            </TouchableOpacity>

            <Text style={styles.title}>Admin Panel</Text>

            <FlatList
                data={users}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.userItem}>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{item.fullName}</Text>
                            <Text style={styles.userEmail}>{item.email}</Text>
                            <Text style={styles.userRole}>Role: {item.role}</Text>
                        </View>
                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => deleteUser(item._id)}
                            >
                                <Text style={styles.actionButtonText}>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => openEditModal(item)}
                            >
                                <Text style={styles.actionButtonText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.noUsers}>No users found.</Text>}
            />

            <TouchableOpacity style={styles.songsButton} onPress={() => navigation.navigate('songs')}>
                <Text style={styles.songsButtonText}>Go to Songs</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit User</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            value={newFullName}
                            onChangeText={setNewFullName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Role"
                            value={newRole}
                            onChangeText={setNewRole}
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={saveEditUser}>
                                <Text style={styles.modalButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fdf2e9', padding: 20, paddingTop: 60 },
    backButton: { position: 'absolute', top: 40, left: 20, zIndex: 1 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#fbc02d', textAlign: 'center', marginBottom: 20 },
    userItem: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginVertical: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    userInfo: { flex: 1 },
    userName: { fontSize: 18, fontWeight: 'bold' },
    userEmail: { fontSize: 14, color: '#555' },
    userRole: { fontSize: 14, color: '#888' },
    actions: { flexDirection: 'row' },
    actionButton: { backgroundColor: '#d27856', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, marginLeft: 5 },
    actionButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
    noUsers: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#555' },

    // Modal Styles
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
    modalButton: { backgroundColor: '#d27856', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5 },
    modalButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

    // Songs Button
    songsButton: {
        marginTop: 10,
        backgroundColor: '#fbc02d',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    songsButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AdminPage;
