import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';

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

const words: { [key: string]: string } = {
    'А': 'Ана',
    'Ә': 'Әке',
    'Б': 'Бала',
    'В': 'Вагон',
    'Г': 'Гүл',
    'Ғ': 'Ғалым',
    'Д': 'Дос',
    'Е': 'Ешкі',
    'Ё': 'Ёлка',
    'Ж': 'Жол',
    'З': 'Заң',
    'И': 'Ит',
    'Й': 'Йога',
    'К': 'Күн',
    'Қ': 'Қала',
    'Л': 'Лас',
    'М': 'Мектеп',
    'Н': 'Нан',
    'Ң': 'Ңұсқа',
    'О': 'Орман',
    'Ө': 'Өзен',
    'П': 'Піл',
    'Р': 'Раушан',
    'С': 'Су',
    'Т': 'Тау',
    'У': 'Ұя',
    'Ұ': 'Үй',
    'Ү': 'Уақыт',
    'Ф': 'Фильм',
    'Х': 'Хат',
    'Һ': 'Һәнтәй',
    'Ц': 'Цирк',
    'Ч': 'Чемпион',
    'Ш': 'Шаң',
    'Щ': 'Щетка',
    'Ы': 'Ыстық',
    'І': 'Ірімшік',
    'Э': 'Энергия',
    'Ю': 'Юла',
    'Я': 'Яхта',
};

function shuffleArray<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
}

const LettersPractice = () => {
    const navigation = useNavigation();
    const [currentKey, setCurrentKey] = useState('');
    const [options, setOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState('');
    const [score, setScore] = useState({ correct: 0, wrong: 0 });
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        loadNewQuestion();
    }, []);

    const loadNewQuestion = () => {
        const keys = Object.keys(words);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const wrongKeys = shuffleArray(keys.filter(k => k !== randomKey)).slice(0, 2);
        const mixedOptions = shuffleArray([randomKey, ...wrongKeys]);

        setCurrentKey(randomKey);
        setOptions(mixedOptions);
        setFeedback('');
        setShowAnswer(false);
    };

    const handleAnswer = (letter: string) => {
        if (letter === currentKey) {
            setFeedback('✅ Дұрыс!');
            setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
        } else {
            setFeedback(`❌ Қате! Дұрыс әріп: ${currentKey}`);
            setScore(prev => ({ ...prev, wrong: prev.wrong + 1 }));
            setShowAnswer(true);
        }

        setTimeout(loadNewQuestion, 1500);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>← Артқа</Text>
            </TouchableOpacity>

            {currentKey && (
                <>
                    <Image source={images[currentKey]} style={styles.image} resizeMode="contain" />
                    <Text style={styles.word}>
                        <Text style={styles.blank}>_</Text>
                        {words[currentKey].slice(1)}
                    </Text>

                    <View style={styles.optionsContainer}>
                        {options.map((opt, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={styles.option}
                                onPress={() => handleAnswer(opt)}
                            >
                                <Text style={styles.optionText}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {feedback !== '' && <Text style={styles.feedback}>{feedback}</Text>}

                    <Text style={styles.score}>
                        ✅ {score.correct}    ❌ {score.wrong}
                    </Text>
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 50,
        alignItems: 'center',
        backgroundColor: '#FDF6EC',
        minHeight: '100%',
    },
    backButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#ddd',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    backButtonText: {
        fontSize: 16,
    },
    image: {
        width: 220,
        height: 220,
        marginBottom: 20,
        borderRadius: 12,
    },
    word: {
        fontSize: 32,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    blank: {
        textDecorationLine: 'underline',
        color: '#888',
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 10,
    },
    option: {
        backgroundColor: '#FFF',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 12,
        margin: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    optionText: {
        fontSize: 20,
    },
    feedback: {
        fontSize: 20,
        marginTop: 20,
        color: '#444',
        fontWeight: '600',
    },
    score: {
        marginTop: 40,
        fontSize: 18,
        color: '#555',
    },
});

export default LettersPractice;
