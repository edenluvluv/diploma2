import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
    _id: string;
    fullName: string;
    email: string;
    role: string;
};

const AdminPage: React.FC = () => {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const deleteUser = async (userId: string) => {
        try {
            await fetch(`http://your-api-url/api/users/${userId}`, { method: 'DELETE' });
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color="black" />
            </TouchableOpacity>

            <Text style={styles.title}>Admin Panel</Text>

            {/* List of Users */}
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
                            {/* Delete Button */}
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() =>
                                    Alert.alert(
                                        'Delete User',
                                        `Are you sure you want to delete ${item.fullName}?`,
                                        [
                                            { text: 'Cancel', style: 'cancel' },
                                            { text: 'Delete', style: 'destructive', onPress: () => deleteUser(item._id) }
                                        ]
                                    )
                                }
                            >
                                <Text style={styles.actionButtonText}>Delete</Text>
                            </TouchableOpacity>
                            {/* Edit Button (Placeholder) */}
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => Alert.alert('Edit User', 'Modify user functionality coming soon!')}
                            >
                                <Text style={styles.actionButtonText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.noUsers}>No users found.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fdf2e9',
        padding: 20,
        paddingTop: 60,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fbc02d',
        textAlign: 'center',
        marginBottom: 20,
    },
    userItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 14,
        color: '#555',
    },
    userRole: {
        fontSize: 14,
        color: '#888',
    },
    actions: {
        flexDirection: 'row',
    },
    actionButton: {
        backgroundColor: '#d27856',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginLeft: 5,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    noUsers: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#555',
    },
});

export default AdminPage;
