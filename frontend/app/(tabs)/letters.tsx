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
    { letter: 'А', latin: 'A', example: 'Ана' },
    { letter: 'Ә', latin: 'Á', example: 'Әке' },
    { letter: 'Б', latin: 'B', example: 'Бала' },
    { letter: 'В', latin: 'V', example: 'Вагон' },
    { letter: 'Г', latin: 'G', example: 'Гүл' },
    { letter: 'Ғ', latin: 'Ǵ', example: 'Ғалым' },
    { letter: 'Д', latin: 'D', example: 'Дос' },
    { letter: 'Е', latin: 'E', example: 'Ешкі' },
    { letter: 'Ё', latin: 'Yo', example: 'Ёлка' },
    { letter: 'Ж', latin: 'J', example: 'Жол' },
    { letter: 'З', latin: 'Z', example: 'Заң' },
    { letter: 'И', latin: 'I', example: 'Ит' },
    { letter: 'Й', latin: 'I', example: 'Йога' },
    { letter: 'К', latin: 'K', example: 'Күн' },
    { letter: 'Қ', latin: 'Q', example: 'Қала' },
    { letter: 'Л', latin: 'L', example: 'Лай' },
    { letter: 'М', latin: 'M', example: 'Мектеп' },
    { letter: 'Н', latin: 'N', example: 'Нан' },
    { letter: 'Ң', latin: 'Ń', example: 'Ңұсқа' },
    { letter: 'О', latin: 'O', example: 'Орман' },
    { letter: 'Ө', latin: 'Ó', example: 'Өзен' },
    { letter: 'П', latin: 'P', example: 'Піл' },
    { letter: 'Р', latin: 'R', example: 'Раушан' },
    { letter: 'С', latin: 'S', example: 'Су' },
    { letter: 'Т', latin: 'T', example: 'Тау' },
    { letter: 'У', latin: 'Ý', example: 'Уақыт' },
    { letter: 'Ұ', latin: 'U', example: 'Ұя' },
    { letter: 'Ү', latin: 'Ú', example: 'Үй' },
    { letter: 'Ф', latin: 'F', example: 'Фильм' },
    { letter: 'Х', latin: 'H', example: 'Хат' },
    { letter: 'Һ', latin: 'H', example: 'Гауһар' },
    { letter: 'Ц', latin: 'Ts', example: 'Цирк' },
    { letter: 'Ч', latin: 'Ch', example: 'Чемпион' },
    { letter: 'Ш', latin: 'Sh', example: 'Шаң' },
    { letter: 'Щ', latin: 'Sch', example: 'Щетка' },
    { letter: 'Ы', latin: 'Y', example: 'Ыстық' },
    { letter: 'І', latin: 'I', example: 'Ірімшік' },
    { letter: 'Э', latin: 'E', example: 'Энергия' },
    { letter: 'Ю', latin: 'Yu', example: 'Юла' },
    { letter: 'Я', latin: 'Ya', example: 'Яхта' },
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

    const getImageForLetter = (letter: string) => {
        const images: { [key: string]: any } = {
            'А': require('@/assets/images/mom.jpg'),
            'Ә': require('@/assets/images/dad.png'),
            'Б': require('@/assets/images/child.png'),
            'В': require('@/assets/images/wagon.png'),
            'Г': require('@/assets/images/flower.png'),
            'Ғ': require('@/assets/images/scientist.jpg'),
            'Д': require('@/assets/images/friend.png'),
            'Е': require('@/assets/images/lamb.jpg'),
            'Ё': require('@/assets/images/tree.png'),
            'Ж': require('@/assets/images/road.png'),
            'З': require('@/assets/images/law.jpg'),
            'И': require('@/assets/images/dog1.png'),
            'Й': require('@/assets/images/yoga.jpg'),
            'К': require('@/assets/images/sun.jpg'),
            'Қ': require('@/assets/images/city.jpg'),
            'Л': require('@/assets/images/dirt.png'),
            'М': require('@/assets/images/school.jpg'),
            'Н': require('@/assets/images/bread.png'),
            'Ң': require('@/assets/images/option.png'),
            'О': require('@/assets/images/forest.png'),
            'Ө': require('@/assets/images/river.png'),
            'П': require('@/assets/images/elephant.png'),
            'Р': require('@/assets/images/rose.jpg'),
            'С': require('@/assets/images/water.jpg'),
            'Т': require('@/assets/images/mountain.png'),
            'У': require('@/assets/images/nest.png'),
            'Ұ': require('@/assets/images/house.png'),
            'Ү': require('@/assets/images/time.png'),
            'Ф': require('@/assets/images/film.png'),
            'Х': require('@/assets/images/letter.png'),
            'Һ': require('@/assets/images/brilliant.png'),
            'Ц': require('@/assets/images/circus.png'),
            'Ч': require('@/assets/images/champion.png'),
            'Ш': require('@/assets/images/dust.jpg'),
            'Щ': require('@/assets/images/brush.jpg'),
            'Ы': require('@/assets/images/hot.png'),
            'І': require('@/assets/images/cheese.jpg'),
            'Э': require('@/assets/images/energy.jpg'),
            'Ю': require('@/assets/images/yula.png'),
            'Я': require('@/assets/images/yacht.jpg'),
        };

        return images[letter] || require('@/assets/images/a.png'); // fallback
    };

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
                    <Image source={getImageForLetter(current.letter)} style={styles.learnImage} />
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
