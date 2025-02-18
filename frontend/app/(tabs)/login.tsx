import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { StackNavigationProp } from '@react-navigation/stack'; // Import StackNavigationProp
import api from '../../api';

// Define the type for your navigation stack
type RootStackParamList = {
    index: undefined; // Define the 'Index' screen
    login: undefined; // Define the 'Login' screen
};

// Define the navigation prop type for this screen
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'login'>;

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [secureText, setSecureText] = useState(true);
    const navigation = useNavigation<LoginScreenNavigationProp>(); // Initialize navigation with proper typing

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Ошибка', 'Пайдаланушы аты және құпия сөзді енгізіңіз');
            return;
        }

        // Simulate login logic
        try {
            // Replace with your actual login API call
            console.log('Logging in with:', username, password);
            Alert.alert('Успех', 'Сіз сәтті кірдіңіз');
        } catch (error) {
            Alert.alert('Ошибка', 'Кіру кезінде қате орын алды');
        }
    };

    const handleBack = () => {
        navigation.navigate('index'); // Navigate to index.tsx
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="#555" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>BALAQAI</Text>
            <Text style={styles.subtitle}>КІРУ</Text>

            {/* Username Input */}
            <Text style={styles.label}>Пайдаланушы аты</Text>
            <TextInput
                placeholder="Пайдаланушы атыңызды енгізіңіз"
                placeholderTextColor="#999" // Gray placeholder text
                style={styles.input}
                value={username}
                onChangeText={setUsername}
            />

            {/* Password Input */}
            <Text style={styles.label}>Құпия сөз</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                    placeholder="Құпия сөзіңізді енгізіңіз"
                    placeholderTextColor="#999" // Gray placeholder text
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secureText}
                />
                <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                    <Ionicons name={secureText ? 'eye-off' : 'eye'} size={24} color="gray" />
                </TouchableOpacity>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>
                    Пайдаланушы аты немесе құпия сөзді ұмыттыңыз ба?
                </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Кіру</Text>
            </TouchableOpacity>

            {/* Register Link */}
            <TouchableOpacity style={styles.registerLink}>
                <Text style={styles.registerLinkText}>Тіркелу</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fdf2e9',
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fbc02d',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#555',
        marginBottom: 20,
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        marginBottom: 15,
    },
    passwordInput: {
        flex: 1,
        height: 50,
    },
    forgotPassword: {
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#555',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#d27856',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 15,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    registerLink: {
        alignSelf: 'center',
    },
    registerLinkText: {
        fontSize: 16,
        color: '#555',
    },
});