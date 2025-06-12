import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDailyTimer, BlockedMessage } from './timer';

const images = [
    require('@/assets/images/doll.png'),
    require('@/assets/images/cat.png'),
    require('@/assets/images/dog.png'),
    require('@/assets/images/sofa.png'),
    require('@/assets/images/lego.png'),
];

const sequenceCounts = [3, 4, 5];

const shuffle = (array: any[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

const MemoryGame = () => {
    // 1. CALL ALL HOOKS FIRST
    const router = useRouter();
    const { isBlocked, beginTracking, endTracking } = useDailyTimer();
    const [level, setLevel] = useState(0);
    const [gameState, setGameState] = useState<'start' | 'show' | 'countdown' | 'play' | 'success' | 'fail' | 'feedback'>('start');
    const [sequence, setSequence] = useState<any[]>([]);
    const [shuffled, setShuffled] = useState<any[]>([]);
    const [selected, setSelected] = useState<any[]>([]);
    const [countdown, setCountdown] = useState(3);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [scaleAnims, setScaleAnims] = useState<Animated.Value[]>([]);

    const screenWidth = Dimensions.get('window').width;
    const cardSize = screenWidth * 0.18;

    // 2. ALL useEffect HOOKS
    useEffect(() => {
        beginTracking();
        return () => endTracking();
    }, []);

    useEffect(() => {
        // Initialize scale animations for each card
        setScaleAnims(shuffled.map(() => new Animated.Value(1)));
    }, [shuffled]);

    // 3. CONDITIONAL RETURNS AFTER ALL HOOKS
    if (isBlocked) {
        return <BlockedMessage />;
    }

    // 4. REST OF YOUR COMPONENT LOGIC
    const startGame = () => {
        const count = sequenceCounts[level];
        const newSeq = shuffle(images).slice(0, count);
        setSequence(newSeq);
        setGameState('show');
        setSelected([]);
        setSelectedIndex(null);
        setShowFeedback(false);

        setTimeout(() => {
            setGameState('countdown');
            let counter = 3;
            const interval = setInterval(() => {
                setCountdown(counter);
                counter--;
                if (counter < 0) {
                    clearInterval(interval);
                    setShuffled(shuffle([...newSeq]));
                    setGameState('play');
                }
            }, 1000);
        }, 6000);
    };

    const handlePress = (img: any, index: number) => {
        if (gameState !== 'play') return;

        setSelectedIndex(index);
        const updated = [...selected, img];
        setSelected(updated);

        setTimeout(() => {
            if (updated.length === sequence.length) {
                const correct = updated.every((item, idx) => item === sequence[idx]);
                setGameState('feedback');
                setShowFeedback(true);

                setTimeout(() => {
                    setGameState(correct ? 'success' : 'fail');
                    setShowFeedback(false);
                }, 3000);
            } else {
                setSelectedIndex(null);
            }
        }, 300);
    };

    const nextLevel = () => {
        if (level < 2) {
            setLevel(level + 1);
            setGameState('start');
        }
    };

    const restart = () => {
        setLevel(0);
        setGameState('start');
    };

    const getImageStyle = (index: number) => {
        const isSelected = selectedIndex === index;
        const isInUserSequence = selected.includes(shuffled[index]);

        return [
            styles.image,
            {
                width: cardSize,
                height: cardSize,
            },
            isSelected && styles.selectedImage,
            isInUserSequence && !isSelected && styles.previouslySelected,
        ];
    };

    const renderFeedbackComparison = () => {
        return (
            <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackTitle}>Нәтиже салыстыруы</Text>

                <View style={styles.comparisonRow}>
                    <View style={styles.answerSection}>
                        <Text style={styles.answerLabel}>Дұрыс жауап:</Text>
                        <View style={styles.answerImages}>
                            {sequence.map((img, i) => (
                                <View key={i} style={styles.answerImageContainer}>
                                    <Image source={img} style={styles.answerImage} />
                                    <Text style={styles.orderNumber}>{i + 1}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.answerSection}>
                        <Text style={styles.answerLabel}>Сіздің жауабыңыз:</Text>
                        <View style={styles.answerImages}>
                            {selected.map((img, i) => (
                                <View key={i} style={styles.answerImageContainer}>
                                    <Image source={img} style={[
                                        styles.answerImage,
                                        sequence[i] === img ? styles.correctAnswer : styles.incorrectAnswer
                                    ]} />
                                    <Text style={[
                                        styles.orderNumber,
                                        sequence[i] === img ? styles.correctNumber : styles.incorrectNumber
                                    ]}>{i + 1}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color="#8B7EDB" />
                </TouchableOpacity>

                <View style={styles.levelIndicator}>
                    {Array.from({ length: 3 }, (_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.levelDot,
                                i <= level ? styles.activeLevelDot : styles.inactiveLevelDot
                            ]}
                        />
                    ))}
                </View>
            </View>

            <Text style={styles.title}>Жаттап ал</Text>
            <Text style={styles.subtitle}>Деңгей {level + 1} - {sequenceCounts[level]} элемент</Text>

            {gameState === 'start' && (
                <View style={styles.startContainer}>
                    <View style={styles.instructionCard}>
                        <Ionicons name="eye" size={32} color="#A29BDE" style={styles.instructionIcon} />
                        <Text style={styles.instructionText}>
                            Көрсетілген ретті есте сақтаңыз және дұрыс тәртіпте таңдаңыз
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.startButton} onPress={startGame}>
                        <Text style={styles.startButtonText}>Бастау</Text>
                        <Ionicons name="play" size={20} color="#fff" style={styles.playIcon} />
                    </TouchableOpacity>
                </View>
            )}

            {gameState === 'show' && (
                <View style={styles.showContainer}>
                    <Text style={styles.phaseTitle}>Ретті есте сақтаңыз</Text>
                    <View style={styles.sequenceContainer}>
                        {sequence.map((img, i) => (
                            <View key={i} style={styles.sequenceItem}>
                                <Image source={img} style={[styles.image, { width: cardSize, height: cardSize }]} />
                                <View style={styles.sequenceNumber}>
                                    <Text style={styles.sequenceNumberText}>{i + 1}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {gameState === 'countdown' && (
                <View style={styles.countdownContainer}>
                    <Text style={styles.countdownTitle}>Дайындалыңыз</Text>
                    <Text style={styles.countdown}>{countdown}</Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${((3 - countdown) / 3) * 100}%` }]} />
                    </View>
                </View>
            )}

            {gameState === 'play' && (
                <View style={styles.playContainer}>
                    <Text style={styles.phaseTitle}>Дұрыс ретпен таңдаңыз</Text>
                    <Text style={styles.progressText}>{selected.length} / {sequence.length}</Text>
                    <ScrollView horizontal contentContainerStyle={styles.gameGrid} showsHorizontalScrollIndicator={false}>
                        {shuffled.map((img, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => handlePress(img, i)}
                                style={styles.cardContainer}
                            >
                                <View style={getImageStyle(i)}>
                                    <Image source={img} style={styles.cardImage} />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {gameState === 'feedback' && showFeedback && renderFeedbackComparison()}

            {gameState === 'success' && (
                <View style={styles.resultContainer}>
                    <Ionicons name="checkmark-circle" size={80} color="#81C784" />
                    <Text style={styles.successText}>Керемет!</Text>
                    <Text style={styles.resultSubtext}>Дұрыс орындадыңыз</Text>
                    {level < 2 ? (
                        <TouchableOpacity style={styles.nextButton} onPress={nextLevel}>
                            <Text style={styles.nextButtonText}>Келесі деңгей</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.completionContainer}>
                            <Text style={styles.completionText}>Барлық деңгей аяқталды!</Text>
                            <TouchableOpacity style={styles.restartButton} onPress={restart}>
                                <Text style={styles.restartButtonText}>Қайтадан ойнау</Text>
                                <Ionicons name="refresh" size={20} color="#A29BDE" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}

            {gameState === 'fail' && (
                <View style={styles.resultContainer}>
                    <Ionicons name="close-circle" size={80} color="#E6A3A3" />
                    <Text style={styles.failText}>Дұрыс емес</Text>
                    <Text style={styles.resultSubtext}>Қайтадан көріңіз</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={restart}>
                        <Text style={styles.retryButtonText}>Қайталау</Text>
                        <Ionicons name="refresh" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9FF',
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: '#F0EFFF',
        padding: 8,
        borderRadius: 90,
    },
    levelIndicator: {
        flexDirection: 'row',
        gap: 6,
    },
    levelDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    activeLevelDot: {
        backgroundColor: '#A29BDE',
    },
    inactiveLevelDot: {
        backgroundColor: '#E6E1F7',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        textAlign: 'center',
        color: '#6B5B95',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#9C88C4',
        marginBottom: 30,
    },
    startContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    instructionCard: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#A29BDE',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    instructionIcon: {
        marginBottom: 16,
    },
    instructionText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#7B6F9D',
        lineHeight: 24,
    },
    startButton: {
        backgroundColor: '#A29BDE',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        shadowColor: '#A29BDE',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginRight: 8,
    },
    playIcon: {
        marginLeft: 4,
    },
    showContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    phaseTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#6B5B95',
        marginBottom: 20,
        textAlign: 'center',
    },
    sequenceContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },
    sequenceItem: {
        position: 'relative',
    },
    sequenceNumber: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#A29BDE',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sequenceNumberText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    countdownContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    countdownTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#6B5B95',
        marginBottom: 20,
    },
    countdown: {
        fontSize: 72,
        fontWeight: '800',
        color: '#A29BDE',
        marginBottom: 20,
    },
    progressBar: {
        width: 200,
        height: 6,
        backgroundColor: '#E6E1F7',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#A29BDE',
        borderRadius: 3,
    },
    playContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    progressText: {
        fontSize: 16,
        color: '#9C88C4',
        marginBottom: 20,
        fontWeight: '500',
    },
    gameGrid: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 10,
    },
    cardContainer: {
        margin: 4,
    },
    image: {
        borderRadius: 16,
        backgroundColor: '#fff',
        borderWidth: 3,
        borderColor: '#F0EFFF',
        shadowColor: '#A29BDE',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        borderRadius: 13,
        resizeMode: 'contain',
    },
    selectedImage: {
        borderColor: '#A29BDE',
        backgroundColor: '#F8F7FF',
        shadowColor: '#A29BDE',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    previouslySelected: {
        borderColor: '#D6CEE8',
        backgroundColor: '#FCFCFF',
        opacity: 0.7,
    },
    feedbackContainer: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 20,
        padding: 24,
        shadowColor: '#A29BDE',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    feedbackTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#6B5B95',
        textAlign: 'center',
        marginBottom: 20,
    },
    comparisonRow: {
        gap: 20,
    },
    answerSection: {
        alignItems: 'center',
    },
    answerLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: '#7B6F9D',
    },
    answerImages: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    answerImageContainer: {
        position: 'relative',
        alignItems: 'center',
    },
    answerImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#F0EFFF',
    },
    correctAnswer: {
        borderColor: '#81C784',
        backgroundColor: '#F1F8E9',
    },
    incorrectAnswer: {
        borderColor: '#E6A3A3',
        backgroundColor: '#FFEBEE',
    },
    orderNumber: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
        color: '#9C88C4',
    },
    correctNumber: {
        color: '#66BB6A',
    },
    incorrectNumber: {
        color: '#E57373',
    },
    resultContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 40,
    },
    successText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#66BB6A',
        marginTop: 16,
        marginBottom: 8,
    },
    failText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#E57373',
        marginTop: 16,
        marginBottom: 8,
    },
    resultSubtext: {
        fontSize: 16,
        color: '#9C88C4',
        marginBottom: 30,
    },
    nextButton: {
        backgroundColor: '#81C784',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        shadowColor: '#81C784',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginRight: 8,
    },
    retryButton: {
        backgroundColor: '#E6A3A3',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        shadowColor: '#E6A3A3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginRight: 8,
    },
    completionContainer: {
        alignItems: 'center',
    },
    completionText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#6B5B95',
        marginBottom: 20,
        textAlign: 'center',
    },
    restartButton: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#A29BDE',
    },
    restartButtonText: {
        color: '#A29BDE',
        fontSize: 18,
        fontWeight: '600',
        marginRight: 8,
    },
});

export default MemoryGame;