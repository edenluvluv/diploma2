import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function SignUpScreen() {
  useEffect(() => {
    const API_URL = 'https://diploma2-backend1.onrender.com/'; // Замени на свой настоящий URL

    // Функция для проверки подключения к бэкенду
    const checkBackendConnection = async () => {
      try {
        const response = await fetch(`${API_URL}/`);
        const data = await response.text();
        console.log('Response from backend:', data); // Должно вывести: "Hello from the Node.js backend!"
      } catch (error) {
        console.error('Error fetching from backend:', error);
      }
    };

    checkBackendConnection(); // Вызов функции
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput placeholder="Username" style={styles.input} />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fdf2e9',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#f57c00',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: '#f57c00',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
