import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../../../frontend/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
    index: undefined;
    Register: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureText, setSecureText] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation<RegisterScreenNavigationProp>();

    const handleRegister = async () => {
        if (!fullName || !phoneNumber || !email || !password) {
            setErrorMessage('Все поля должны быть заполнены');
            return;
        }

        if (password.length < 8) {
            setErrorMessage('Пароль должен содержать минимум 8 символов');
            return;
        }

        try {
            const response = await api.post('/register', {
                fullName,
                phoneNumber,
                email,
                password,
            });

            await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
            setErrorMessage('');
            navigation.navigate('index');
        } catch (error: any) {
            console.error('Ошибка при регистрации:', error);
            setErrorMessage(error.response?.data?.message || 'Ошибка сети');
        }
    };

    const handleBack = () => {
        navigation.navigate('index');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="#555" />
            </TouchableOpacity>

            <Text style={styles.title}>BALAQAI</Text>
            <Text style={styles.subtitle}>TIPKEY</Text>
            <Text style={styles.description}>Ата-ана туралы ақпарат:</Text>

            <View style={styles.field}>
                <Text style={styles.label}>Аты-жөні</Text>
                <TextInput
                    placeholder="Толық аты-жөніңізді енгізіңіз"
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Телефон нөмірі</Text>
                <TextInput
                    placeholder="+7 000 000 00 00"
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Электрондық пошта</Text>
                <TextInput
                    placeholder="example@email.com"
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Құпия сөз</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        placeholder="Кемінде 8 таңба, әріптер мен сандар"
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
            </View>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Келесі</Text>
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
        marginBottom: 5,
    },
    description: {
        fontSize: 16,
        color: '#777',
        marginBottom: 20,
    },
    field: {
        width: '100%',
        marginBottom: 15,
    },
    label: {
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
        paddingHorizontal: 14,
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
    },
    passwordInput: {
        flex: 1,
        height: 50,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#d27856',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});
