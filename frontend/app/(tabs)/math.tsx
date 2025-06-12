import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
    Animated,
    StatusBar,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const colors = {
    primary: '#FFB3E6',    // Soft pink
    secondary: '#B3E5FC',  // Light blue
    accent: '#C8E6C9',     // Mint green
    success: '#81C784',    // Soft green
    danger: '#FFAB91',     // Soft coral
    background: '#FFF8E1', // Cream white
    cardBg: 'rgba(255, 255, 255, 0.9)',
    textPrimary: '#5D4037', // Warm brown
    textSecondary: '#8D6E63', // Light brown
    textTertiary: '#A1887F', // Very light brown
    pastelPink: '#FFD1DC',  // Pastel pink for restart button
};

type RootStackParamList = {
    math: undefined;
    games: undefined;
};

type MathScreenNavigationProp = StackNavigationProp<RootStackParamList, 'math'>;

const generateQuestion = () => {
    const operations = ['+', '-'];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let num1, num2, question, correctAnswer;

    if (operation === '+') {
        // Simple addition: 1-5 + 1-5
        num1 = Math.floor(Math.random() * 5) + 1;
        num2 = Math.floor(Math.random() * 5) + 1;
        question = `${num1} + ${num2}`;
        correctAnswer = num1 + num2;
    } else {
        // Simple subtraction: result will be 1-5
        correctAnswer = Math.floor(Math.random() * 5) + 1;
        num2 = Math.floor(Math.random() * 5) + 1;
        num1 = correctAnswer + num2;
        question = `${num1} - ${num2}`;
    }

    let options = new Set<number>();
    options.add(correctAnswer);

    // Generate simple wrong answers
    while (options.size < 4) {
        let wrongAnswer = Math.max(1, correctAnswer + Math.floor(Math.random() * 6) - 3);
        if (wrongAnswer !== correctAnswer && wrongAnswer <= 10) {
            options.add(wrongAnswer);
        }
    }

    return {
        question: `${question} = ?`,
        options: Array.from(options).sort(() => Math.random() - 0.5),
        answer: correctAnswer,
    };
};

const MathPage: React.FC = () => {
    const navigation = useNavigation<MathScreenNavigationProp>();
    const [questions, setQuestions] = useState(() => Array.from({ length: 5 }, generateQuestion));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [answers, setAnswers] = useState<(number | null)[]>(Array(5).fill(null));
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        StatusBar.setBarStyle('dark-content');
        StatusBar.setBackgroundColor(colors.background, true);

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        // Animate progress bar
        Animated.timing(progressAnim, {
            toValue: (currentIndex + 1) / questions.length,
            duration: 300,
            useNativeDriver: false,
        }).start();

    }, [currentIndex]);

    const handleAnswer = (selectedAnswer: number) => {
        setSelectedAnswer(selectedAnswer);
        setShowFeedback(true);

        const newAnswers = [...answers];
        newAnswers[currentIndex] = selectedAnswer;
        setAnswers(newAnswers);

        if (selectedAnswer === questions[currentIndex].answer) {
            setScore(prev => prev + 1);
        }

        setTimeout(() => {
            setShowFeedback(false);
            setSelectedAnswer(null);

            if (currentIndex + 1 < questions.length) {
                setCurrentIndex(currentIndex + 1);
            } else {
                setShowResult(true);
            }
        }, 1500);
    };

    const handleRestart = () => {
        setQuestions(Array.from({ length: 5 }, generateQuestion));
        setCurrentIndex(0);
        setScore(0);
        setShowResult(false);
        setAnswers(Array(5).fill(null));
        setSelectedAnswer(null);
        setShowFeedback(false);
        progressAnim.setValue(0);
    };

    const getScoreMessage = () => {
        const percentage = (score / questions.length) * 100;
        if (percentage >= 90) return { text: "🌟 Өте жақсы!", color: colors.success };
        if (percentage >= 70) return { text: "⭐ Жақсы!", color: colors.accent };
        if (percentage >= 50) return { text: "👍 Жарайды!", color: colors.secondary };
        return { text: "💪 Тағы да тырысайық!", color: colors.danger };
    };

    return (
        <LinearGradient
            colors={[colors.background, '#FFECB3']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        >
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
            >
                <BlurView intensity={20} style={styles.backButtonBlur}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </BlurView>
            </TouchableOpacity>

            {!showResult && (
                <View style={styles.progressContainer}>
                    <View style={styles.progressBarBg}>
                        <Animated.View
                            style={[
                                styles.progressBar,
                                {
                                    width: progressAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0%', '100%'],
                                    }),
                                },
                            ]}
                        />
                    </View>
                    <Text style={styles.progressText}>
                        {currentIndex + 1} / {questions.length}
                    </Text>
                </View>
            )}

            {showResult ? (
                <ScrollView
                    contentContainerStyle={styles.resultContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View
                        style={[
                            styles.resultCard,
                            {
                                opacity: fadeAnim,
                            },
                        ]}
                    >
                        <BlurView intensity={30} style={styles.resultCardBlur}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                                style={styles.resultCardGradient}
                            >
                                <Text style={styles.resultTitle}>Нәтиже</Text>
                                <View style={styles.scoreDisplay}>
                                    <Text style={styles.resultScore}>{score}</Text>
                                    <Text style={styles.scoreDivider}>/</Text>
                                    <Text style={styles.resultTotal}>{questions.length}</Text>
                                </View>
                                <Text style={[styles.scoreMessage, { color: getScoreMessage().color }]}>
                                    {getScoreMessage().text}
                                </Text>

                                <View style={styles.statsContainer}>
                                    <View style={styles.statItem}>
                                        <Text style={styles.statNumber}>
                                            {Math.round((score / questions.length) * 100)}%
                                        </Text>
                                        <Text style={styles.statLabel}>Дұрыс</Text>
                                    </View>
                                    <View style={styles.statDivider} />
                                    <View style={styles.statItem}>
                                        <Text style={styles.statNumber}>{score}</Text>
                                        <Text style={styles.statLabel}>Дұрыс жауап</Text>
                                    </View>
                                    <View style={styles.statDivider} />
                                    <View style={styles.statItem}>
                                        <Text style={styles.statNumber}>{questions.length - score}</Text>
                                        <Text style={styles.statLabel}>Қате жауап</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </BlurView>
                    </Animated.View>

                    {questions.map((q, idx) => (
                        <Animated.View
                            key={idx}
                            style={[
                                styles.reviewCard,
                                {
                                    opacity: fadeAnim,
                                },
                            ]}
                        >
                            <View style={styles.reviewContent}>
                                <Text style={styles.reviewQuestion}>{q.question}</Text>
                                <View style={styles.answerComparison}>
                                    <View style={styles.answerItem}>
                                        <Text style={styles.answerLabel}>Сіздікі:</Text>
                                        <Text style={[
                                            styles.answerValue,
                                            { color: answers[idx] === q.answer ? colors.success : colors.danger }
                                        ]}>
                                            {answers[idx] ?? 'Жоқ'}
                                        </Text>
                                    </View>
                                    <View style={styles.answerItem}>
                                        <Text style={styles.answerLabel}>Дұрыс:</Text>
                                        <Text style={[styles.answerValue, { color: colors.success }]}>
                                            {q.answer}
                                        </Text>
                                    </View>
                                </View>
                                <View style={[
                                    styles.resultIndicator,
                                    { backgroundColor: answers[idx] === q.answer ? colors.success : colors.danger }
                                ]} />
                            </View>
                        </Animated.View>
                    ))}

                    <TouchableOpacity
                        style={styles.restartButton}
                        onPress={handleRestart}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.restartText}>Қайтадан бастау</Text>
                        <Ionicons name="refresh" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                </ScrollView>
            ) : (
                <View style={styles.quizContainer}>
                    <Animated.View
                        style={[
                            styles.quizCard,
                            {
                                opacity: fadeAnim,
                            },
                        ]}
                    >
                        <BlurView intensity={25} style={styles.quizCardBlur}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                                style={styles.quizCardGradient}
                            >
                                <Text style={styles.questionText}>
                                    {questions[currentIndex].question}
                                </Text>

                                {showFeedback && (
                                    <View style={styles.feedbackContainer}>
                                        <Text style={[
                                            styles.feedbackText,
                                            {
                                                color: selectedAnswer === questions[currentIndex].answer
                                                    ? colors.success
                                                    : colors.danger
                                            }
                                        ]}>
                                            {selectedAnswer === questions[currentIndex].answer
                                                ? '🌟 Дұрыс!'
                                                : `💫 Дұрыс жауап: ${questions[currentIndex].answer}`}
                                        </Text>
                                    </View>
                                )}

                                <View style={styles.optionsGrid}>
                                    {questions[currentIndex].options.map((option, index) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={[
                                                styles.option,
                                                selectedAnswer === option && styles.selectedOption,
                                                showFeedback && option === questions[currentIndex].answer && styles.correctOption,
                                                showFeedback && selectedAnswer === option && option !== questions[currentIndex].answer && styles.wrongOption,
                                            ]}
                                            onPress={() => !showFeedback && handleAnswer(option)}
                                            disabled={showFeedback}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={[
                                                styles.optionText,
                                                {
                                                    color: colors.textPrimary
                                                }
                                            ]}>
                                                {option}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </LinearGradient>
                        </BlurView>
                    </Animated.View>
                </View>
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 20,
        zIndex: 100,
        borderRadius: 25,
        overflow: 'hidden',
    },
    backButtonBlur: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    progressContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: colors.accent,
        borderRadius: 3,
    },
    progressText: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 8,
        fontWeight: '600',
    },
    quizContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    quizCard: {
        width: '100%',
        borderRadius: 32,
        overflow: 'hidden',
    },
    quizCardBlur: {
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    quizCardGradient: {
        padding: 40,
        alignItems: 'center',
        minHeight: 350,
        justifyContent: 'center',
    },
    questionText: {
        fontSize: 36,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: 40,
        textAlign: 'center',
    },
    feedbackContainer: {
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    feedbackText: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
    },
    option: {
        width: (width - 80) / 2 - 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        backgroundColor: '#FFFFFF',
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 80,
    },
    selectedOption: {
        borderColor: colors.accent,
        borderWidth: 2,
    },
    correctOption: {
        borderColor: colors.success,
        borderWidth: 2,
        backgroundColor: colors.success,
    },
    wrongOption: {
        borderColor: colors.danger,
        borderWidth: 2,
        backgroundColor: colors.danger,
    },
    optionText: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
    },
    resultContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 20,
    },
    resultCard: {
        marginBottom: 30,
        borderRadius: 32,
        overflow: 'hidden',
    },
    resultCardBlur: {
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    resultCardGradient: {
        padding: 40,
        alignItems: 'center',
    },
    resultTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: colors.textPrimary,
        marginBottom: 20,
    },
    scoreDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    resultScore: {
        fontSize: 64,
        fontWeight: '900',
        color: colors.accent,
    },
    scoreDivider: {
        fontSize: 48,
        color: colors.textSecondary,
        marginHorizontal: 10,
    },
    resultTotal: {
        fontSize: 48,
        fontWeight: '700',
        color: colors.textSecondary,
    },
    scoreMessage: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 30,
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: '900',
        color: colors.textPrimary,
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    reviewCard: {
        marginBottom: 15,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        overflow: 'hidden',
    },
    reviewContent: {
        padding: 20,
        position: 'relative',
    },
    reviewQuestion: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 15,
        textAlign: 'center',
    },
    answerComparison: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    answerItem: {
        alignItems: 'center',
        flex: 1,
    },
    answerLabel: {
        fontSize: 12,
        color: colors.textTertiary,
        marginBottom: 5,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    answerValue: {
        fontSize: 24,
        fontWeight: '900',
    },
    resultIndicator: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 6,
        height: '100%',
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
    },
    restartButton: {
        marginTop: 30,
        borderRadius: 25,
        backgroundColor: colors.pastelPink,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 40,
        gap: 10,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    restartText: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.textPrimary,
    },
});

export default MathPage;