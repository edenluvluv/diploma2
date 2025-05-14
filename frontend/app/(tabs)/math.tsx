import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    math: undefined;
    games: undefined;
};

type MathScreenNavigationProp = StackNavigationProp<RootStackParamList, 'math'>;

const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const isAddition = Math.random() > 0.5;

    const question = isAddition
        ? `${num1} + ${num2} = ?`
        : `${num1 + num2} - ${num1} = ?`;
    const correctAnswer = isAddition ? num1 + num2 : num2;

    let options = new Set<number>();
    options.add(correctAnswer);
    while (options.size < 4) {
        options.add(correctAnswer + Math.floor(Math.random() * 5) - 2);
    }

    return {
        question,
        options: Array.from(options).sort(() => Math.random() - 0.5),
        answer: correctAnswer,
    };
};

const MathPage: React.FC = () => {
    const navigation = useNavigation<MathScreenNavigationProp>();
    const [questions, setQuestions] = useState(() =>
        Array.from({ length: 5 }, generateQuestion)
    );
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [answers, setAnswers] = useState<(number | null)[]>(
        Array(5).fill(null)
    );

    const handleAnswer = (selectedAnswer: number) => {
        const newAnswers = [...answers];
        newAnswers[currentIndex] = selectedAnswer;
        setAnswers(newAnswers);

        if (selectedAnswer === questions[currentIndex].answer) {
            setScore((prev) => prev + 1);
        }

        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setShowResult(true);
        }
    };

    const handleRestart = () => {
        setQuestions(Array.from({ length: 5 }, generateQuestion));
        setCurrentIndex(0);
        setScore(0);
        setShowResult(false);
        setAnswers(Array(5).fill(null));
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            {showResult ? (
                <ScrollView contentContainerStyle={styles.resultContainer}>
                    <Text style={styles.resultText}>Қорытынды:</Text>
                    <Text style={styles.scoreText}>
                        {score} / {questions.length}
                    </Text>
                    {questions.map((q, idx) => (
                        <View key={idx} style={styles.reviewItem}>
                            <Text style={styles.reviewQuestion}>{q.question}</Text>
                            <Text
                                style={{
                                    color:
                                        answers[idx] === q.answer ? 'green' : 'red',
                                }}
                            >
                                Сіздің жауабыңыз: {answers[idx]} | Дұрыс жауап: {q.answer}
                            </Text>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
                        <Text style={styles.restartText}>Қайта бастау</Text>
                    </TouchableOpacity>
                </ScrollView>
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.questionContainer}>
                        <Text style={styles.progressText}>
                            {currentIndex + 1} / {questions.length}
                        </Text>
                        <Text style={styles.questionText}>
                            {questions[currentIndex].question}
                        </Text>
                        <View style={styles.inlineOptions}>
                            {questions[currentIndex].options.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.optionButton,
                                        answers[currentIndex] === option && styles.selectedOption,
                                    ]}
                                    onPress={() => handleAnswer(option)}
                                    disabled={answers[currentIndex] !== null}
                                >
                                    <Text style={styles.optionText}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: '5%',
        backgroundColor: '#F7F5F2', // light pastel
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    questionContainer: {
        width: '100%',
        backgroundColor: '#E8F6F3',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    progressText: {
        fontSize: 18,
        color: '#555',
        marginBottom: 10,
    },
    questionText: {
        fontSize: 28,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    inlineOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
    },
    optionButton: {
        backgroundColor: '#FFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        margin: 5,
        borderWidth: 1,
        borderColor: '#DDD',
    },
    selectedOption: {
        backgroundColor: '#CDE7FF',
        borderColor: '#66A6FF',
    },
    optionText: {
        fontSize: 18,
        color: '#333',
    },
    resultContainer: {
        paddingVertical: 40,
        paddingHorizontal: '5%',
        alignItems: 'center',
    },
    resultText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    scoreText: {
        fontSize: 24,
        color: '#555',
        marginBottom: 20,
    },
    reviewItem: {
        width: '100%',
        marginBottom: 15,
        backgroundColor: '#F1F8FF',
        borderRadius: 12,
        padding: 12,
    },
    reviewQuestion: {
        fontSize: 18,
        marginBottom: 5,
        fontWeight: '500',
        color: '#333',
    },
    restartButton: {
        backgroundColor: '#66A6FF',
        padding: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginTop: 20,
    },
    restartText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default MathPage;
