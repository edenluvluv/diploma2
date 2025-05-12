import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Define the interface for a Kazakh letter
interface KazakhLetter {
    letter: string;
    latin: string;
    example: string;
}

// Use the interface to type the kazakhAlphabet array
const kazakhAlphabet: KazakhLetter[] = [
    { letter: 'А', latin: 'A', example: 'Ана (Mother)' },
    { letter: 'Ә', latin: 'Á', example: 'Әке (Father)' },
    { letter: 'Б', latin: 'B', example: 'Бала (Child)' },
    { letter: 'В', latin: 'V', example: 'Вагон (Wagon)' },
    { letter: 'Г', latin: 'G', example: 'Гүл (Flower)' },
    { letter: 'Ғ', latin: 'Ǵ', example: 'Ғалым (Scientist)' },
    { letter: 'Д', latin: 'D', example: 'Дала (Steppe)' },
    { letter: 'Е', latin: 'E', example: 'Ел (Country)' },
    { letter: 'Ё', latin: 'Yo', example: 'Ёлка (Tree)' },
    { letter: 'Ж', latin: 'J', example: 'Жол (Road)' },
    { letter: 'З', latin: 'Z', example: 'Заман (Era)' },
    { letter: 'И', latin: 'I', example: 'Ине (Needle)' },
    { letter: 'Й', latin: 'I', example: 'Йога (Yoga)' },
    { letter: 'К', latin: 'K', example: 'Күн (Sun)' },
    { letter: 'Қ', latin: 'Q', example: 'Қала (City)' },
    { letter: 'Л', latin: 'L', example: 'Лимон (Lemon)' },
    { letter: 'М', latin: 'M', example: 'Мектеп (School)' },
    { letter: 'Н', latin: 'N', example: 'Нан (Bread)' },
    { letter: 'Ң', latin: 'Ń', example: 'Ңұсқа (Option)' },
    { letter: 'О', latin: 'O', example: 'Отан (Homeland)' },
    { letter: 'Ө', latin: 'Ó', example: 'Өзен (River)' },
    { letter: 'П', latin: 'P', example: 'Піл (Elephant)' },
    { letter: 'Р', latin: 'R', example: 'Рақмет (Thanks)' },
    { letter: 'С', latin: 'S', example: 'Су (Water)' },
    { letter: 'Т', latin: 'T', example: 'Тау (Mountain)' },
    { letter: 'У', latin: 'Ý', example: 'Уақыт (Time)' },
    { letter: 'Ұ', latin: 'U', example: 'Ұя (Nest)' },
    { letter: 'Ү', latin: 'Ú', example: 'Үй (House)' },
    { letter: 'Ф', latin: 'F', example: 'Фильм (Film)' },
    { letter: 'Х', latin: 'H', example: 'Хат (Letter)' },
    { letter: 'Һ', latin: 'H', example: 'Һау (Bless you)' },
    { letter: 'Ц', latin: 'Ts', example: 'Цирк (Circus)' },
    { letter: 'Ч', latin: 'Ch', example: 'Чемпион (Champion)' },
    { letter: 'Ш', latin: 'Sh', example: 'Шаң (Dust)' },
    { letter: 'Щ', latin: 'Sch', example: 'Щетка (Brush)' },
    { letter: 'Ы', latin: 'Y', example: 'Ыстық (Hot)' },
    { letter: 'І', latin: 'I', example: 'Ілім (Knowledge)' },
    { letter: 'Э', latin: 'E', example: 'Энергия (Energy)' },
    { letter: 'Ю', latin: 'Yu', example: 'Юла (Spinning top)' },
    { letter: 'Я', latin: 'Ya', example: 'Яхта (Yacht)' },
];

type RootStackParamList = {
    letters: undefined;
    letterspractice: undefined;
    games:undefined;
};

type LettersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'letters'>;

const LettersPage: React.FC = () => {
    const navigation = useNavigation<LettersScreenNavigationProp>();
    const handleLettersPracticeNavigation = () => {
        navigation.navigate('letterspractice');
    };
    const handleBack = () => {
        navigation.navigate('games'); 
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="#555" />
            </TouchableOpacity>
            <Text style={styles.title}>Қазақ Әліпбиі</Text>
            <ScrollView contentContainerStyle={styles.alphabetContainer}>
                {kazakhAlphabet.map((letter, index) => (
                    <View key={index} style={styles.letterBox}>
                        <Text style={styles.letter}>{letter.letter}</Text>
                        <Text style={styles.latin}>{letter.latin}</Text>
                        <Text style={styles.example}>{letter.example}</Text>
                    </View>
                ))}
            </ScrollView>
            <TouchableOpacity
                style={styles.practiceButton}
                onPress={handleLettersPracticeNavigation} // Use the new navigation here
            >
                <Text style={styles.practiceButtonText}>Жаттығу</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAF6FF',
        paddingTop: 60,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2A4D69',
    },
    alphabetContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    letterBox: {
        backgroundColor: '#4FC3F7',
        width: 120,
        height: 120,
        margin: 8,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    letter: {
        fontSize: 28,
        color: 'white',
        fontWeight: 'bold',
    },
    latin: {
        fontSize: 16,
        color: 'white',
    },
    example: {
        fontSize: 14,
        color: 'white',
    },
    practiceButton: {
        marginTop: 30,
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    practiceButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default LettersPage;
