import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../../api';

// Определяем тип навигации
type RootStackParamList = {
    index: undefined;
    login: undefined;
    games: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'login'>;

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureText, setSecureText] = useState(true);
    const [errorMessage, setErrorMessage] = useState(''); // 🔹 Состояние ошибки
    const navigation = useNavigation<LoginScreenNavigationProp>();

    const handleLogin = async () => {
        if (!email || !password) {
            setErrorMessage('Введите email и пароль');
            return;
        }

        try {
            const response = await api.post('/login', { email, password });
            console.log('Login response:', response.data);
            setErrorMessage(''); // ✅ Сбрасываем ошибку при успешном входе

            // 🔹 После успешного входа переходим в games.tsx
            navigation.navigate('games');

        } catch (error: any) {
            console.error('Ошибка при входе:', error);
            if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Ошибка сети');
            }
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('index')}>
                <Ionicons name="arrow-back" size={24} color="#555" />
            </TouchableOpacity>

            <Text style={styles.title}>BALAQAI</Text>
            <Text style={styles.subtitle}>КІРУ</Text>

            {/* Email Input */}
            <Text style={styles.label}>Электрондық пошта</Text>
            <TextInput
                placeholder="Email енгізіңіз"
                placeholderTextColor="#999"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            {/* Password Input */}
            <Text style={styles.label}>Құпия сөз</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                    placeholder="Құпия сөзіңізді енгізіңіз"
                    placeholderTextColor="#999"
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secureText}
                />
                <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                    <Ionicons name={secureText ? 'eye-off' : 'eye'} size={24} color="gray" />
                </TouchableOpacity>
            </View>

            {/* 🔴 Текст ошибки (если есть) */}
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Кіру</Text>
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
    errorText: { // 🔴 Стиль ошибки
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
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
});
