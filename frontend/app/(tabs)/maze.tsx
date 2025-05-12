import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Dimensions,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
    maze: undefined;
    games: undefined;
};

const numRows = 10;
const numCols = 10;
const OBSTACLE_COUNT = 20;

type Position = { row: number; col: number };

const getRandomPosition = (): Position => ({
    row: Math.floor(Math.random() * numRows),
    col: Math.floor(Math.random() * numCols),
});

const generateObstacles = (start: Position, goal: Position): Position[] => {
    const obstacles: Position[] = [];
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
    return obstacles;
};

const MazePage: React.FC = () => {
    const navigation = useNavigation();
    const [player, setPlayer] = useState<Position>({ row: 0, col: 0 });
    const [goal, setGoal] = useState<Position>({ row: numRows - 1, col: numCols - 1 });
    const [obstacles, setObstacles] = useState<Position[]>(() =>
        generateObstacles({ row: 0, col: 0 }, { row: numRows - 1, col: numCols - 1 })
    );
    const [goalReached, setGoalReached] = useState(false);

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const cellSize = Math.floor(Math.min(screenWidth, screenHeight - 300) / numCols) - 2;

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key.startsWith('Arrow')) {
                e.preventDefault();
                movePlayer(e.key.replace('Arrow', '').toLowerCase() as Direction);
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [player]);

    type Direction = 'up' | 'down' | 'left' | 'right';

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

            if (row === goal.row && col === goal.col) {
                setGoalReached(true);
            }
        }
    };

    const restartGame = () => {
        const newStart = { row: 0, col: 0 };
        const newGoal = { row: numRows - 1, col: numCols - 1 };
        setPlayer(newStart);
        setGoal(newGoal);
        setObstacles(generateObstacles(newStart, newGoal));
        setGoalReached(false);
    };

    const renderCell = (row: number, col: number) => {
        const isPlayer = player.row === row && player.col === col;
        const isGoal = goal.row === row && goal.col === col;
        const isObstacle = obstacles.some(o => o.row === row && o.col === col);

        let backgroundColor = '#fff';
        if (isPlayer) backgroundColor = '#4CAF50';
        else if (isGoal) backgroundColor = '#FFD700';
        else if (isObstacle) backgroundColor = '#444';

        return (
            <View
                key={`${row}-${col}`}
                style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor,
                    borderWidth: 1,
                    borderColor: '#ccc',
                }}
            />
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.title}>Лабиринт</Text>

            <View style={styles.gridAndControls}>
                <ScrollView horizontal>
                    <View>
                        {Array.from({ length: numRows }).map((_, row) => (
                            <View key={row} style={{ flexDirection: 'row' }}>
                                {Array.from({ length: numCols }).map((_, col) => renderCell(row, col))}
                            </View>
                        ))}
                    </View>
                </ScrollView>

                <View style={styles.arrowsContainer}>
                    <TouchableOpacity onPress={() => movePlayer('up')} style={styles.arrowButton}>
                        <Text style={styles.arrowText}>↑</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => movePlayer('left')} style={styles.arrowButton}>
                            <Text style={styles.arrowText}>←</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => movePlayer('down')} style={styles.arrowButton}>
                            <Text style={styles.arrowText}>↓</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => movePlayer('right')} style={styles.arrowButton}>
                            <Text style={styles.arrowText}>→</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {goalReached && (
                <Text style={styles.successText}>🎉 Мақсатқа жеттіңіз!</Text>
            )}

            <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
                <Text style={styles.restartText}>Қайта бастау</Text>
            </TouchableOpacity>

            <Text style={styles.instructions}>Пернетақта немесе оң жақтағы батырмаларды пайдаланыңыз</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#A3E7FC',
        paddingTop: 50,
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
        color: '#333',
        marginBottom: 10,
    },
    gridAndControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 10,
    },
    arrowsContainer: {
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 10,
        margin: 5,
        minWidth: 50,
        alignItems: 'center',
    },
    arrowText: {
        fontSize: 20,
        color: '#fff',
    },
    restartButton: {
        marginTop: 20,
        backgroundColor: '#28A745',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    restartText: {
        fontSize: 18,
        color: '#fff',
    },
    instructions: {
        marginTop: 10,
        fontSize: 16,
        color: '#444',
    },
    successText: {
        fontSize: 20,
        color: '#4CAF50',
        marginTop: 20,
        fontWeight: 'bold',
    },
});

export default MazePage;
