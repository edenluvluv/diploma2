import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    karaoke_choose: undefined;
    games: undefined;
};

type Karaoke_chooseScreenNavigationProp = StackNavigationProp<RootStackParamList, 'karaoke_choose'>;

const Karaoke_choosePage: React.FC = () => {
    const navigation = useNavigation<Karaoke_chooseScreenNavigationProp>();

    const handleBack = () => {
        navigation.navigate('games');
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#A3E7FC', // Blue background
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
        color: '#fff', // White text for contrast
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
        width: '23%', // 4 columns (100% / 4 - some margin)
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

export default Karaoke_choosePage;