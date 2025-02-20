import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    math: undefined;
};

type MathScreenNavigationProp = StackNavigationProp<RootStackParamList, 'math'>;

const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const isAddition = Math.random() > 0.5;

    const question = isAddition ? `${num1} + ${num2} = ?` : `${num1 + num2} - ${num1} = ?`;
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
    const [questions, setQuestions] = useState(() => Array.from({ length: 5 }, generateQuestion));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (selectedAnswer: number) => {
        if (selectedAnswer === questions[currentIndex].answer) {
            setScore((prevScore) => prevScore + 1);
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
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            {showResult ? (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>Қорытынды:</Text>
                    <Text style={styles.scoreText}>{score} / {questions.length}</Text>
                    <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
                        <Text style={styles.restartText}>Қайта бастау</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.questionContainer}>
                    <Text style={styles.progressText}>{currentIndex + 1} / {questions.length}</Text>
                    <Text style={styles.questionText}>{questions[currentIndex].question}</Text>
                    <View style={styles.optionsContainer}>
                        {questions[currentIndex].options.map((option) => (
                            <TouchableOpacity key={option} style={styles.optionButton} onPress={() => handleAnswer(option)}>
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#A3E7FC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
    questionContainer: {
        width: '90%',
        backgroundColor: '#D1F4FF',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    progressText: {
        fontSize: 18,
        color: '#555',
        marginBottom: 10,
    },
    questionText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    optionButton: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        margin: 5,
        elevation: 3,
    },
    optionText: {
        fontSize: 20,
        color: '#333',
    },
    resultContainer: {
        alignItems: 'center',
    },
    resultText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    scoreText: {
        fontSize: 24,
        color: '#333',
        marginVertical: 10,
    },
    restartButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 8,
    },
    restartText: {
        fontSize: 18,
        color: '#fff',
    },
});

export default MathPage;
