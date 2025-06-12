import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
    'У': 'Уақыт',
    'Ұ': 'Ұя',
    'Ү': 'Үй',
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
    const [pulseAnim] = useState(new Animated.Value(1));

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
    };

    const handleAnswer = (letter: string) => {
        // Subtle pulse animation for feedback
        Animated.sequence([
            Animated.timing(pulseAnim, {
                toValue: 1.05,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();

        if (letter === currentKey) {
            setFeedback('Керемет! Дұрыс жауап!');
            setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
        } else {
            setFeedback(`Қате! Дұрыс әріп: ${currentKey}`);
            setScore(prev => ({ ...prev, wrong: prev.wrong + 1 }));
        }

        setTimeout(loadNewQuestion, 1800);
    };

    return (
        <LinearGradient
            colors={['#F8F9FF', '#FFF5F8']}
            style={styles.gradientContainer}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.8}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                {currentKey && (
                    <View style={styles.contentContainer}>
                        <Animated.View
                            style={[
                                styles.imageContainer,
                                { transform: [{ scale: pulseAnim }] }
                            ]}
                        >
                            <Image
                                source={images[currentKey]}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </Animated.View>

                        <View style={styles.wordContainer}>
                            <Text style={styles.word}>
                                <Text style={styles.blank}>_</Text>
                                <Text style={styles.restOfWord}>{words[currentKey].slice(1)}</Text>
                            </Text>
                        </View>

                        <View style={styles.optionsContainer}>
                            {options.map((opt, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={styles.option}
                                    onPress={() => handleAnswer(opt)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.optionText}>{opt}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {feedback && (
                            <View style={styles.feedbackContainer}>
                                <Text style={styles.feedback}>{feedback}</Text>
                            </View>
                        )}

                        <View style={styles.scoreContainer}>
                            <View style={styles.scoreItem}>
                                <View style={styles.scoreCircle}>
                                    <Text style={styles.scoreNumber}>{score.correct}</Text>
                                </View>
                                <Text style={styles.scoreLabel}>Дұрыс</Text>
                            </View>
                            <View style={styles.scoreDivider} />
                            <View style={styles.scoreItem}>
                                <View style={styles.scoreCircleWrong}>
                                    <Text style={styles.scoreNumber}>{score.wrong}</Text>
                                </View>
                                <Text style={styles.scoreLabel}>Қате</Text>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },
    container: {
        padding: 24,
        paddingTop: 60,
        alignItems: 'center',
        minHeight: '100%',
    },
    backButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#B8A9FF',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#B8A9FF',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    contentContainer: {
        alignItems: 'center',
        width: '100%',
    },
    imageContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 8,
        marginBottom: 32,
        shadowColor: '#C8B5FF',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 10,
    },
    image: {
        width: 260,
        height: 260,
        borderRadius: 18,
    },
    wordContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 32,
        paddingVertical: 20,
        borderRadius: 20,
        marginBottom: 40,
        shadowColor: '#FFB8E1',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#FFF0F7',
    },
    word: {
        fontSize: 42,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    blank: {
        textDecorationLine: 'underline',
        color: '#FF9FC7',
        textDecorationColor: '#FF9FC7',
    },
    restOfWord: {
        color: '#4A5568',
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 32,
    },
    option: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 18,
        paddingHorizontal: 28,
        borderRadius: 18,
        minWidth: 80,
        alignItems: 'center',
        shadowColor: '#C8B5FF',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 2,
        borderColor: '#F5F2FF',
    },
    optionText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4A5568',
    },
    feedbackContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 28,
        paddingVertical: 16,
        borderRadius: 16,
        marginBottom: 28,
        shadowColor: '#FFB8E1',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#FFF0F7',
    },
    feedback: {
        fontSize: 22,
        color: '#4A5568',
        fontWeight: '600',
        textAlign: 'center',
    },
    scoreContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 32,
        paddingVertical: 24,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#C8B5FF',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#F5F2FF',
    },
    scoreItem: {
        alignItems: 'center',
        flex: 1,
    },
    scoreCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#B8F5CD',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#B8F5CD',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    scoreCircleWrong: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFCDD2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#FFCDD2',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    scoreNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4A5568',
    },
    scoreLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#718096',
    },
    scoreDivider: {
        width: 1,
        height: 50,
        backgroundColor: '#E2E8F0',
        marginHorizontal: 20,
    },
});

export default LettersPractice;