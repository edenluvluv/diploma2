import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    index: undefined;
    games: undefined;
    achievements: undefined;
    math: undefined;
    next: undefined;
    maze: undefined;
    pair: undefined;
    diary: undefined;
    karaoke: undefined;
    memory: undefined;
    letters: undefined;
    user: undefined;
};

type GamesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'games'>;

const GamesPage: React.FC = () => {
    const navigation = useNavigation<GamesScreenNavigationProp>();

    const games = [
        { id: 1, name: 'Жеке күнделік', icon: '📔', nav: 'diary' },
        { id: 2, name: 'Ал тауып көр!', icon: '🧠', nav: 'pair' },
        { id: 3, name: 'Келесі не?', icon: '👣', nav: 'next' },
        { id: 4, name: 'Лабиринт', icon: '🌀', nav: 'maze' },
        { id: 5, name: 'Математика', icon: '➕', nav: 'math' },
        { id: 6, name: 'Әріптер', icon: '🔤', nav: 'letters' },
        { id: 7, name: 'Жаттап ал!', icon: '🧩', nav: 'memory' },
        { id: 8, name: 'Ән салайық!', icon: '🎤', nav: 'karaoke' },
    ];

    const handleNavigate = (screen: keyof RootStackParamList) => {
        navigation.navigate(screen);
    };

    return (
        <LinearGradient colors={['#7F7FD5', '#86A8E7', '#91EAE4']} style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => handleNavigate('index')}>
                <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.userIcon} onPress={() => handleNavigate('user')}>
                <Ionicons name="person-circle" size={30} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.title}>Oйнайық!</Text>
            <ScrollView contentContainerStyle={styles.gamesContainer}>
                {games.map((game) => (
                    <Pressable
                        key={game.id}
                        onPress={() => handleNavigate(game.nav as keyof RootStackParamList)}
                        style={({ pressed }) => [
                            styles.card,
                            pressed && { transform: [{ scale: 0.97 }] },
                        ]}
                    >
                        <View style={styles.cardInner}>
                            <Text style={styles.icon}>{game.icon}</Text>
                            <Text style={styles.gameName}>{game.name}</Text>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
    userIcon: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
    },
    gamesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: 100,
    },
    card: {
        width: '48%',
        marginBottom: 20,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
    },
    cardInner: {
        paddingVertical: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: 40,
        marginBottom: 10,
    },
    gameName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
    },
});

export default GamesPage;
