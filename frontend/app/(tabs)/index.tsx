import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../../api'; 

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !age) {
      Alert.alert('Ошибка', 'Все поля должны быть заполнены');
      return;
    }

    try {
      const response = await api.post('/register', { name, email, age });
      console.log('Register response:', response.data);
      Alert.alert('Успех', response.data.message);
    } catch (error: any) {
      console.error('Error during registration:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Registration failed. Please try again.');
    }
  }    

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BALAQAI</Text>
      <Text style={styles.subtitle}>ТІРКЕЛУ</Text>

      <TextInput 
        placeholder="Аты-жөні" 
        style={styles.input} 
        value={name} 
        onChangeText={setName} 
      />
      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address"
      />
      <TextInput 
        placeholder="Жасы" 
        style={styles.input} 
        value={age} 
        onChangeText={setAge} 
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Тіркелу</Text>
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
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#fbc02d',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
