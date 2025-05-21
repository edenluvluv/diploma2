import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
    const router = useRouter();
    const [level, setLevel] = useState(0);
    const [gameState, setGameState] = useState<'start' | 'show' | 'countdown' | 'play' | 'success' | 'fail'>('start');
    const [sequence, setSequence] = useState<any[]>([]);
    const [shuffled, setShuffled] = useState<any[]>([]);
    const [selected, setSelected] = useState<any[]>([]);
    const [countdown, setCountdown] = useState(3);

    const screenWidth = Dimensions.get('window').width;
    const cardSize = screenWidth * 0.2;

    const startGame = () => {
        const count = sequenceCounts[level];
        const newSeq = shuffle(images).slice(0, count);
        setSequence(newSeq);
        setGameState('show');
        setSelected([]);

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
        }, 5000);
    };

    const handlePress = (img: any) => {
        if (gameState !== 'play') return;
        const updated = [...selected, img];
        setSelected(updated);

        if (updated.length === sequence.length) {
            const correct = updated.every((item, idx) => item === sequence[idx]);
            setGameState(correct ? 'success' : 'fail');
        }
    };

    const nextLevel = () => {
        if (level < 2) {
            setLevel(level + 1);
            setGameState('start');
        }
    };

    const restart = () => {
        setGameState('start');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#4A4A4A" />
            </TouchableOpacity>

            <Text style={styles.title}>Жаттап ал - деңгей {level + 1}</Text>

            {gameState === 'start' && (
                <TouchableOpacity style={styles.button} onPress={startGame}>
                    <Text style={styles.buttonText}>Бастау</Text>
                </TouchableOpacity>
            )}

            {gameState === 'show' && (
                <ScrollView horizontal contentContainerStyle={styles.inlineGrid}>
                    {sequence.map((img, i) => (
                        <Image key={i} source={img} style={[styles.image, { width: cardSize, height: cardSize }]} />
                    ))}
                </ScrollView>
            )}

            {gameState === 'countdown' && (
                <Text style={styles.countdown}>Дайындал: {countdown}</Text>
            )}

            {gameState === 'play' && (
                <ScrollView horizontal contentContainerStyle={styles.inlineGrid}>
                    {shuffled.map((img, i) => (
                        <TouchableOpacity key={i} onPress={() => handlePress(img)}>
                            <Image source={img} style={[styles.image, { width: cardSize, height: cardSize }]} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {gameState === 'success' && (
                <View style={styles.result}>
                    <Text style={styles.resultText}>Құттықтаймын!</Text>
                    {level < 2 ? (
                        <TouchableOpacity style={styles.button} onPress={nextLevel}>
                            <Text style={styles.buttonText}>Келесі деңгей</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.resultText}>Ойын аяқталды!</Text>
                    )}
                </View>
            )}

            {gameState === 'fail' && (
                <View style={styles.result}>
                    <Text style={styles.resultText}>Дұрыс емес</Text>
                    <TouchableOpacity style={styles.button} onPress={restart}>
                        <Text style={styles.buttonText}>Қайтадан бастау</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F5F3',
        paddingTop: 60,
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    backButton: {
        position: 'absolute',
        top: 30,
        left: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 20,
        color: '#5C5470',
    },
    inlineGrid: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    image: {
        margin: 10,
        resizeMode: 'contain',
        borderRadius: 12,
        backgroundColor: '#EADFF5',
        borderWidth: 2,
        borderColor: '#D3CCE3',
    },
    countdown: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 40,
        color: '#7D6E83',
    },
    button: {
        backgroundColor: '#A0CED9',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 16,
        marginTop: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
    result: {
        alignItems: 'center',
        marginTop: 40,
    },
    resultText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#6C5B7B',
    },
});

export default MemoryGame;
