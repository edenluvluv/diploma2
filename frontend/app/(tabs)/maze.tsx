import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
    Modal,
    Platform,
    Animated,
    Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const numRows = 10;
const numCols = 10;
const OBSTACLE_COUNT = 25;

type Position = { row: number; col: number };
type Direction = 'up' | 'down' | 'left' | 'right';

const getRandomPosition = (): Position => ({
    row: Math.floor(Math.random() * numRows),
    col: Math.floor(Math.random() * numCols),
});

const isReachable = (start: Position, goal: Position, obstacles: Position[]): boolean => {
    const visited = Array.from({ length: numRows }, () => Array(numCols).fill(false));
    const queue: Position[] = [start];
    const isObstacle = (r: number, c: number) => obstacles.some(o => o.row === r && o.col === c);
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    while (queue.length) {
        const { row, col } = queue.shift()!;
        if (row === goal.row && col === goal.col) return true;
        for (let [dr, dc] of directions) {
            const nr = row + dr, nc = col + dc;
            if (nr >= 0 && nr < numRows && nc >= 0 && nc < numCols && !visited[nr][nc] && !isObstacle(nr, nc)) {
                visited[nr][nc] = true;
                queue.push({ row: nr, col: nc });
            }
        }
    }
    return false;
};

const generateObstaclesWithPath = (start: Position, goal: Position): Position[] => {
    let obstacles: Position[] = [];
    let attempts = 0;
    do {
        obstacles = [];
        while (obstacles.length < OBSTACLE_COUNT) {
            const pos = getRandomPosition();
            if (
                (pos.row !== start.row || pos.col !== start.col) &&
                (pos.row !== goal.row || pos.col !== goal.col) &&
                !obstacles.some(o => o.row === pos.row && o.col === pos.col)
            ) {
                obstacles.push(pos);
            }
        }
        attempts++;
    } while (!isReachable(start, goal, obstacles) && attempts < 100);
    return obstacles;
};

const MazePage: React.FC = () => {
    const navigation = useNavigation();

    const [player, setPlayer] = useState<Position>({ row: 0, col: 0 });
    const [goal, setGoal] = useState<Position>({ row: numRows - 1, col: numCols - 1 });
    const [obstacles, setObstacles] = useState<Position[]>(() =>
        generateObstaclesWithPath({ row: 0, col: 0 }, { row: numRows - 1, col: numCols - 1 })
    );
    const [goalReached, setGoalReached] = useState(false);
    const [steps, setSteps] = useState(0);
    const [gameTime, setGameTime] = useState(0);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const sparkleAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;
    const modalScaleAnim = useRef(new Animated.Value(0)).current;

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const cellSize = Math.min(
        Math.floor((screenWidth - 60) / numCols),
        Math.floor((screenHeight - 400) / numRows)
    );

    useEffect(() => {
        // Entrance animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 1200,
                easing: Easing.elastic(1.2),
                useNativeDriver: true,
            }),
        ]).start();

        // Continuous animations
        const pulseLoop = () => {
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ]).start(() => pulseLoop());
        };

        const sparkleLoop = () => {
            Animated.sequence([
                Animated.timing(sparkleAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
                Animated.timing(sparkleAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
            ]).start(() => sparkleLoop());
        };

        const rotateLoop = () => {
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 8000,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => {
                rotateAnim.setValue(0);
                rotateLoop();
            });
        };

        const floatLoop = () => {
            Animated.sequence([
                Animated.timing(floatAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                Animated.timing(floatAnim, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            ]).start(() => floatLoop());
        };

        pulseLoop();
        sparkleLoop();
        rotateLoop();
        floatLoop();
    }, []);

    useEffect(() => {
        if (goalReached) {
            Animated.spring(modalScaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }).start();
        } else {
            modalScaleAnim.setValue(0);
        }
    }, [goalReached]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (!goalReached) setGameTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [goalReached]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key.startsWith('Arrow')) {
                e.preventDefault();
                movePlayer(e.key.replace('Arrow', '').toLowerCase() as Direction);
            }
        };
        if (Platform.OS === 'web') {
            document.addEventListener('keydown', handleKey);
            return () => document.removeEventListener('keydown', handleKey);
        }
    }, [player]);

    const playSound = async (file: any) => {
        try {
            const { sound } = await Audio.Sound.createAsync(file);
            await sound.playAsync();
        } catch (error) {
            console.log('Sound error:', error);
        }
    };

    const movePlayer = (dir: Direction) => {
        let { row, col } = player;
        if (dir === 'up') row = Math.max(0, row - 1);
        else if (dir === 'down') row = Math.min(numRows - 1, row + 1);
        else if (dir === 'left') col = Math.max(0, col - 1);
        else if (dir === 'right') col = Math.min(numCols - 1, col + 1);

        const isBlocked = obstacles.some(o => o.row === row && o.col === col);
        if (!isBlocked) {
            const newPos = { row, col };
            setPlayer(newPos);
            setSteps(prev => prev + 1);
            if (row === goal.row && col === goal.col) {
                setGoalReached(true);
                playSound(require('@/assets/sounds/success.wav'));
            }
        } else {
            playSound(require('@/assets/sounds/hit.wav'));
        }
    };

    const restartGame = () => {
        const newStart = { row: 0, col: 0 };
        const newGoal = { row: numRows - 1, col: numCols - 1 };
        setPlayer(newStart);
        setGoal(newGoal);
        setObstacles(generateObstaclesWithPath(newStart, newGoal));
        setGoalReached(false);
        setSteps(0);
        setGameTime(0);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const renderCell = (row: number, col: number) => {
        const isPlayer = player.row === row && player.col === col;
        const isGoal = goal.row === row && goal.col === col;
        const isObstacle = obstacles.some(o => o.row === row && o.col === col);

        const cellStyle = [
            styles.cell,
            { width: cellSize, height: cellSize },
            isPlayer && styles.playerCell,
            isGoal && styles.goalCell,
            isObstacle && styles.obstacleCell,
        ];

        const animatedStyle = isPlayer ? {
            transform: [{ scale: pulseAnim }],
        } : isGoal ? {
            transform: [
                { scale: pulseAnim },
                {
                    rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                    })
                }
            ],
        } : {};

        return (
            <Animated.View key={`${row}-${col}`} style={[cellStyle, animatedStyle]}>
                <LinearGradient
                    colors={
                        isPlayer ? ['#FFB6D9', '#D4BBFF', '#A8E6CF'] :
                            isGoal ? ['#FFEAA7', '#FFD93D', '#74E291'] :
                                isObstacle ? ['#FFB3BA', '#FFDFDF', '#FF9999'] :
                                    ['#A8E6CF', '#A8E6CF', '#A8E6CF']
                    }
                    style={styles.cellGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {isPlayer && (
                        <View style={styles.playerIcon}>
                            <Image
                                source={require('@/assets/images/man.gif')}
                                style={{
                                    width: cellSize * 0.8,
                                    height: cellSize * 0.8,
                                }}
                                resizeMode="contain"
                            />
                        </View>
                    )}
                    {isGoal && (
                        <Animated.View style={[styles.goalIcon, {
                            transform: [{
                                translateY: floatAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -5],
                                })
                            }]
                        }]}>
                            <Text style={styles.goalEmoji}>🏆</Text>
                            <Animated.View style={[styles.sparkle, {
                                opacity: sparkleAnim,
                                transform: [{ scale: sparkleAnim }]
                            }]}>
                                <Text style={styles.sparkleText}>✨</Text>
                            </Animated.View>
                        </Animated.View>
                    )}
                    {isObstacle && (
                        <View style={styles.obstacleIcon}>
                            <Text style={styles.obstacleEmoji}>💀</Text>
                        </View>
                    )}
                </LinearGradient>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <LinearGradient colors={['#C7A2FF', '#D4BBFF']} style={styles.backButtonGradient}>
                    <Ionicons name="arrow-back" size={28} color="#FFF" />
                </LinearGradient>
            </TouchableOpacity>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Қадамдар</Text>
                    <Text style={styles.statValue}>{steps}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Уақыт</Text>
                    <Text style={styles.statValue}>{formatTime(gameTime)}</Text>
                </View>
            </View>

            <Animated.View style={[styles.mazeContainer, {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
            }]}>
                <View style={styles.mazeWrapper}>
                    {Array.from({ length: numRows }).map((_, row) => (
                        <View key={row} style={styles.mazeRow}>
                            {Array.from({ length: numCols }).map((_, col) => renderCell(row, col))}
                        </View>
                    ))}
                </View>
            </Animated.View>

            <Animated.View style={[styles.controlsContainer, { opacity: fadeAnim }]}>
                <TouchableOpacity onPress={() => movePlayer('up')} style={styles.arrowButton}>
                    <LinearGradient colors={['#B8E6B8', '#A8E6A8']} style={styles.arrowGradient}>
                        <Ionicons name="chevron-up" size={32} color="#FFF" />
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.horizontalControls}>
                    <TouchableOpacity onPress={() => movePlayer('left')} style={styles.arrowButton}>
                        <LinearGradient colors={['#B8E6B8', '#A8E6A8']} style={styles.arrowGradient}>
                            <Ionicons name="chevron-back" size={32} color="#FFF" />
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => movePlayer('down')} style={styles.arrowButton}>
                        <LinearGradient colors={['#B8E6B8', '#A8E6A8']} style={styles.arrowGradient}>
                            <Ionicons name="chevron-down" size={32} color="#FFF" />
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => movePlayer('right')} style={styles.arrowButton}>
                        <LinearGradient colors={['#B8E6B8', '#A8E6A8']} style={styles.arrowGradient}>
                            <Ionicons name="chevron-forward" size={32} color="#FFF" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animated.View>

            <Text style={styles.instructions}>
                ⌨️ Пернетақта көрсеткілерін немесе экранды пайдаланыңыз
            </Text>

            <Modal visible={goalReached} transparent animationType="none">
                <BlurView intensity={20} style={styles.modalOverlay}>
                    <Animated.View style={[styles.modalContent, {
                        transform: [{ scale: modalScaleAnim }]
                    }]}>
                        <LinearGradient colors={['#FFF0F5', '#FFE4E1', '#F0F8FF']} style={styles.modalGradient}>
                            <Text style={styles.successText}>
                                🎉 Жеңіс! 🎯
                            </Text>

                            <View style={styles.achievementStats}>
                                <View style={styles.achievementItem}>
                                    <Text style={styles.achievementLabel}>Қадамдар саны</Text>
                                    <Text style={styles.achievementValue}>{steps}</Text>
                                </View>
                                <View style={styles.achievementItem}>
                                    <Text style={styles.achievementLabel}>Уақыт</Text>
                                    <Text style={styles.achievementValue}>{formatTime(gameTime)}</Text>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
                                <LinearGradient colors={['#FFB6C1', '#FFE4E1']} style={styles.restartGradient}>
                                    <Text style={styles.restartText}>🔄 Қайта ойнау</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </LinearGradient>
                    </Animated.View>
                </BlurView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F0FF', // Very light pastel purple
        paddingTop: 40,
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        borderRadius: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    backButtonGradient: {
        padding: 12,
        borderRadius: 25,
    },
    statsContainer: {
        flexDirection: 'row',
        marginTop: 60,
        marginBottom: 20,
        gap: 15,
    },
    statCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 15,
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
        borderWidth: 1,
        borderColor: 'rgba(196, 181, 253, 0.3)',
    },
    statLabel: {
        color: '#6B46C1',
        fontSize: 12,
        opacity: 0.8,
        fontWeight: '600',
    },
    statValue: {
        color: '#8B5CF6',
        fontSize: 18,
        fontWeight: 'bold',
    },
    mazeContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    mazeWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: 15,
        borderRadius: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 6.27,
        borderWidth: 1,
        borderColor: 'rgba(196, 181, 253, 0.2)',
    },
    mazeRow: {
        flexDirection: 'row',
    },
    cell: {
        margin: 1,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 3,
    },
    cellGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playerCell: {
        elevation: 8,
        shadowColor: '#FFB6D9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
    },
    goalCell: {
        elevation: 8,
        shadowColor: '#FFEAA7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
    },
    obstacleCell: {
        elevation: 6,
        shadowColor: '#FFB3BA',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    playerIcon: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    goalIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    goalEmoji: {
        fontSize: 18,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    sparkle: {
        position: 'absolute',
        top: -5,
        right: -5,
    },
    sparkleText: {
        fontSize: 12,
        color: '#F59E0B',
    },
    obstacleIcon: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    obstacleEmoji: {
        fontSize: 16,
    },
    controlsContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    horizontalControls: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 15,
    },
    arrowButton: {
        margin: 8,
        borderRadius: 25,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    arrowGradient: {
        padding: 15,
        borderRadius: 25,
        minWidth: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    instructions: {
        marginTop: 20,
        fontSize: 16,
        color: '#6B46C1',
        textAlign: 'center',
        paddingHorizontal: 20,
        opacity: 0.8,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        borderRadius: 25,
        marginHorizontal: 20,
        overflow: 'hidden',
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 13.16,
        maxWidth: 400,
        width: '90%',
    },
    modalGradient: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    successText: {
        fontSize: 32,
        color: '#8B5CF6',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        textShadowColor: 'rgba(139, 92, 246, 0.2)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    achievementStats: {
        width: '100%',
        marginBottom: 30,
    },
    achievementItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(139, 92, 246, 0.2)',
    },
    achievementLabel: {
        color: '#6B46C1',
        fontSize: 16,
        opacity: 0.8,
        fontWeight: '500',
    },
    achievementValue: {
        color: '#8B5CF6',
        fontSize: 18,
        fontWeight: 'bold',
    },
    restartButton: {
        borderRadius: 20,
        elevation: 8,
        shadowColor: '#FFB6C1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    restartGradient: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 20,
        alignItems: 'center',
    },
    restartText: {
        fontSize: 18,
        color: '#8B5CF6',
        fontWeight: 'bold',
        textShadowColor: 'rgba(139, 92, 246, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});

export default MazePage;