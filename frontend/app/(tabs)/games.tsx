import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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

    const handleBack = () => {
        navigation.navigate('index');
    };

    const handleAchievements = () => {
        navigation.navigate('achievements');
    };

    const handleUserNavigation = () => {
        navigation.navigate('user');
    };

    const handlePairNavigation = () => {
        navigation.navigate('pair');
    };

    const handleMathNavigation = () => {
        navigation.navigate('math');
    };

    const handleMazeNavigation = () => {
        navigation.navigate('maze');
    };

    const handleDiaryNavigation = () => {
        navigation.navigate('diary');
    };

    const handleKaraokeNavigation = () => {
        navigation.navigate('karaoke');
    };

    const handleMemoryNavigation = () => {
        navigation.navigate('memory');
    };

    const handleLettersNavigation = () => {
        navigation.navigate('letters');
    };

    const handleNextNavigation = () => {
        navigation.navigate('next');
    };

    const games = [
        { id: 1, name: 'жеке күнделік', icon: '🎮', onPress: handleDiaryNavigation },
        { id: 2, name: 'Ал тауып көр!', icon: '🕹️', onPress: handlePairNavigation },
        { id: 3, name: 'Келесі не?', icon: '👾', onPress: handleNextNavigation },
        { id: 4, name: 'лабиринт', icon: '🃏', onPress: handleMazeNavigation },
        { id: 5, name: 'Математика', icon: '🎲', onPress: handleMathNavigation },
        { id: 6, name: 'әріптер', icon: '🧩', onPress: handleLettersNavigation },
        { id: 7, name: 'karaoke', icon: '♟️', onPress: handleKaraokeNavigation },
        { id: 8, name: 'memory', icon: '🎯', onPress: handleMemoryNavigation },
    ];

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Achievements + User Buttons */}
            <View style={styles.topRightIcons}>
                <TouchableOpacity onPress={handleAchievements} style={styles.iconButton}>
                    <Ionicons name="trophy" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleUserNavigation} style={styles.iconButton}>
                    <Ionicons name="person-circle" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>Oйнайык!</Text>
            <View style={styles.gamesContainer}>
                {games.map((game) => (
                    <TouchableOpacity
                        key={game.id}
                        style={styles.gameCard}
                        onPress={game.onPress}
                    >
                        <Text style={styles.gameIcon}>{game.icon}</Text>
                        <Text style={styles.gameName}>{game.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#A3E7FC',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
    topRightIcons: {
        position: 'absolute',
        top: 40,
        right: 20,
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: 15,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginTop: 60,
        marginBottom: 20,
    },
    gamesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gameCard: {
        width: '48%',  // Adjusted for two columns
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    gameIcon: {
        fontSize: 40,
        marginBottom: 10,
    },
    gameName: {
        fontSize: 16,
        color: '#555',
    },
});

export default GamesPage;
