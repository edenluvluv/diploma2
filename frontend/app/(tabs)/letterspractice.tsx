// letterspractice.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    letters: undefined;
    letterspractice: undefined;
};

type LettersPracticeNavigationProp = StackNavigationProp<RootStackParamList, 'letterspractice'>;

const LettersPracticePage: React.FC = () => {
    const navigation = useNavigation<LettersPracticeNavigationProp>();
    const [score, setScore] = useState(0);
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);

    const kazakhAlphabet = [
        'А', 'Ә', 'Б', 'В', 'Г', 'Ғ', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й',
        'К', 'Қ', 'Л', 'М', 'Н', 'Ң', 'О', 'Ө', 'П', 'Р', 'С', 'Т', 'У',
        'Ұ', 'Ү', 'Ф', 'Х', 'Һ', 'Ц', 'Ч', 'Ш', 'Щ', 'Ы', 'І', 'Ь', 'Э',
        'Ю', 'Я'
    ];

    const nextLetter = () => {
        setCurrentLetterIndex(prev => (prev + 1) % kazakhAlphabet.length);
    };

    const increaseScore = () => {
        setScore(prev => prev + 1);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Әліпби Жаттығу</Text>
            <Text style={styles.letter}>{kazakhAlphabet[currentLetterIndex]}</Text>

            <TouchableOpacity style={styles.button} onPress={increaseScore}>
                <Text style={styles.buttonText}>Таптым!</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={nextLetter}>
                <Text style={styles.buttonText}>Келесі Әріп</Text>
            </TouchableOpacity>

            <Text style={styles.score}>Сіздің ұпайыңыз: {score}</Text>

            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.buttonText}>Қайту</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2A4D69',
    },
    letter: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#2A4D69',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    score: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2A4D69',
        marginBottom: 30,
    },
    backButton: {
        backgroundColor: '#FF5733',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
});

export default LettersPracticePage;
