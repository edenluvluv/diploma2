import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BALAQAI</Text>
      <Text style={styles.subtitle}>КІРУ</Text>
      
      <TextInput placeholder="Пайдаланушы аты" style={styles.input} />
      <TextInput placeholder="Құпия сөз" secureTextEntry style={styles.input} />
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Кіру</Text>
      </TouchableOpacity>

      <Text style={styles.link}>Пайдаланушы аты немесе құпиясөзді ұмыттыңыз ба?</Text>
      <TouchableOpacity>
        <Text style={styles.register}>Тіркелу</Text>
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
  link: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  register: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f57c00',
  },
});
