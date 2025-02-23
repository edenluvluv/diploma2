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


    const handleMathNavigation = () => {
        navigation.navigate('math'); // <-- Navigate to Math screen
    };

    const games = [
        { id: 1, name: 'жеке күнделік', icon: '🎮', onPress: () => console.log('Game 1 Pressed') },
        { id: 2, name: 'Игра 2', icon: '🕹️' },
        { id: 3, name: 'жұптарды табыңыз', icon: '👾', onPress: () => console.log('Game 3 Pressed') },
        { id: 4, name: 'лабиринт', icon: '🃏', onPress: () => console.log('Game 4 Pressed') },
        { id: 5, name: 'математика', icon: '🎲', onPress: handleMathNavigation },
        { id: 6, name: 'әріптер', icon: '🧩' },
        { id: 7, name: 'Игра 7', icon: '♟️' },
        { id: 8, name: 'Игра 8', icon: '🎯' },
    ];

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Achievements Button */}
            <TouchableOpacity style={styles.achievementsButton} onPress={handleAchievements}>
                <Ionicons name="trophy" size={24} color="#fff" />
            </TouchableOpacity>


            <Text style={styles.title}>Oйнайык!</Text>
            <View style={styles.gamesContainer}>
                {games.map((game) => (
                    <TouchableOpacity
                        key={game.id}
                        style={styles.gameCard}
                        onPress={game.onPress} // Use the onPress handler for each game
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
    achievementsButton: {
        position: 'absolute',
        top: 40,
        right: 20,
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
        width: '23%',
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