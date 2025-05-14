import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface KazakhLetter {
    letter: string;
    latin: string;
    example: string;
}

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
    games: undefined;
};

type LettersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'letters'>;

const LettersPage: React.FC = () => {
    const navigation = useNavigation<LettersScreenNavigationProp>();
    const [learnMode, setLearnMode] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextLetter = () => setCurrentIndex((prev) => (prev + 1) % kazakhAlphabet.length);
    const prevLetter = () =>
        setCurrentIndex((prev) => (prev - 1 + kazakhAlphabet.length) % kazakhAlphabet.length);

    const current = kazakhAlphabet[currentIndex];

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('games')}>
                <Ionicons name="arrow-back" size={26} color="#555" />
            </TouchableOpacity>

            <Text style={styles.title}>Қазақ Әліпбиі</Text>

            {!learnMode ? (
                <ScrollView contentContainerStyle={styles.alphabetContainer}>
                    {kazakhAlphabet.map((letter, index) => (
                        <View key={index} style={styles.letterCard}>
                            <Text style={styles.letter}>{letter.letter}</Text>
                            <Text style={styles.latin}>{letter.latin}</Text>
                            <Text style={styles.example}>{letter.example}</Text>
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <View style={styles.learnContainer}>
                    <Text style={styles.learnLetter}>{current.letter}</Text>
                    <Text style={styles.learnLatin}>{current.latin}</Text>
                    <Text style={styles.learnExample}>{current.example}</Text>
                    <Image source={require('@/assets/images/a.png')} style={styles.learnImage} />
                    <View style={styles.arrowContainer}>
                        <TouchableOpacity onPress={prevLetter}>
                            <Ionicons name="arrow-back-circle" size={50} color="#4C9EEB" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={nextLetter}>
                            <Ionicons name="arrow-forward-circle" size={50} color="#4C9EEB" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.bottomButton, { backgroundColor: '#6A5ACD' }]}
                    onPress={() => setLearnMode(!learnMode)}
                >
                    <Text style={styles.bottomButtonText}>{learnMode ? 'Көру' : 'Үйрену'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.bottomButton, { backgroundColor: '#20B2AA' }]}
                    onPress={() => navigation.navigate('letterspractice')}
                >
                    <Text style={styles.bottomButtonText}>Жаттығу</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FAFC',
        paddingTop: 60,
        paddingHorizontal: 10,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center',
        color: '#2A4D69',
    },
    alphabetContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingBottom: 20,
    },
    letterCard: {
        backgroundColor: '#E0F7FA',
        width: width / 3.2,
        height: 120,
        margin: 6,
        borderRadius: 16,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 4,
    },
    letter: {
        fontSize: 28,
        fontWeight: '700',
        color: '#007AFF',
    },
    latin: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    example: {
        fontSize: 12,
        textAlign: 'center',
        color: '#333',
        marginTop: 4,
    },
    learnContainer: {
        alignItems: 'center',
        marginTop: 30,
    },
    learnLetter: {
        fontSize: 100,
        fontWeight: 'bold',
        color: '#6A5ACD',
    },
    learnLatin: {
        fontSize: 28,
        color: '#4C9EEB',
        marginTop: -10,
    },
    learnExample: {
        fontSize: 18,
        marginVertical: 12,
        color: '#444',
        textAlign: 'center',
        paddingHorizontal: 12,
    },
    learnImage: {
        width: 160,
        height: 160,
        marginVertical: 20,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    arrowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
        marginTop: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
        paddingBottom: 20,
    },
    bottomButton: {
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        elevation: 3,
    },
    bottomButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default LettersPage;
