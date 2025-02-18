// games.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { StackNavigationProp } from '@react-navigation/stack'; // Import StackNavigationProp
import api from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';


type RootStackParamList = {
    index: undefined; // Define the 'Index' screen
    games: undefined; // Define the 'Login' screen
};

// Define the navigation prop type for this screen
type GamesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'games'>;

const GamesPage: React.FC = () => {
        const navigation = useNavigation<GamesScreenNavigationProp>();
    const handleBack = () => {
        navigation.navigate('index'); // Navigate to index.tsx
    };

    return (
        <View style={styles.container}>
                        {/* Back Button */}
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <Ionicons name="arrow-back" size={24} color="#555" />
                        </TouchableOpacity>
            <Text style={styles.title}>Games</Text>
            <Text style={styles.text}>Welcome to the games page!</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#333',
    },
    text: {
        fontSize: 18,
        color: '#555',
    },
});

export default GamesPage;