import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions
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

const levels = [3, 4, 5];

const shuffleArray = (arr: any[]) => {
    return [...arr].sort(() => Math.random() - 0.5);
};

const MemoryPage = () => {
    const router = useRouter();
    const [level, setLevel] = useState(0);
    const [gameState, setGameState] = useState<'start' | 'show' | 'countdown' | 'play' | 'success' | 'fail'>('start');
    const [sequence, setSequence] = useState<any[]>([]);
    const [shuffled, setShuffled] = useState<any[]>([]);
    const [userSequence, setUserSequence] = useState<any[]>([]);
    const [countdown, setCountdown] = useState(3);

    const screenWidth = Dimensions.get('window').width;
    const cardSize = (screenWidth * 0.9 - 10 * (levels[level] - 1)) / levels[level];

    const startLevel = () => {
        const seq = images.slice(0, levels[level]);
        setSequence(seq);
        setGameState('show');
        setUserSequence([]);
    };

    useEffect(() => {
        if (gameState === 'show') {
            const timeout = setTimeout(() => {
                setGameState('countdown');
                setCountdown(3);
            }, 5000);
            return () => clearTimeout(timeout);
        }
    }, [gameState]);

    useEffect(() => {
        if (gameState === 'countdown') {
            if (countdown > 0) {
                const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                setShuffled(shuffleArray(sequence));
                setGameState('play');
            }
        }
    }, [gameState, countdown]);

    const handlePress = (img: any) => {
        const newSeq = [...userSequence, img];
        setUserSequence(newSeq);

        if (sequence[newSeq.length - 1] !== img) {
            setGameState('fail');
            return;
        }

        if (newSeq.length === sequence.length) {
            setGameState('success');
        }
    };

    const nextLevel = () => {
        if (level < levels.length - 1) {
            setLevel(l => l + 1);
            setGameState('start');
        }
    };

    const renderImages = (imgs: any[], pressable = false) => (
        <View style={styles.grid}>
            {imgs.map((img, idx) => (
                <TouchableOpacity
                    key={idx}
                    disabled={!pressable}
                    onPress={() => pressable && handlePress(img)}
                    style={[styles.card, { width: cardSize, height: cardSize }]}
                >
                    <Image source={img} style={styles.image} />
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.title}>Level {level + 1}</Text>

            {gameState === 'start' && (
                <TouchableOpacity style={styles.button} onPress={startLevel}>
                    <Text style={styles.buttonText}>Бастау</Text>
                </TouchableOpacity>
            )}

            {gameState === 'show' && (
                <>
                    <Text style={styles.subtitle}>Көңіл аударыңыз!</Text>
                    {renderImages(sequence)}
                </>
            )}

            {gameState === 'countdown' && (
                <Text style={styles.countdown}>{countdown}</Text>
            )}

            {gameState === 'play' && renderImages(shuffled, true)}

            {gameState === 'fail' && (
                <View style={styles.result}>
                    <Text style={styles.resultText}>❌ Қате! Қайта көріңіз.</Text>
                    <TouchableOpacity style={styles.button} onPress={() => setGameState('start')}>
                        <Text style={styles.buttonText}>Қайта бастау</Text>
                    </TouchableOpacity>
                </View>
            )}

            {gameState === 'success' && (
                <View style={styles.result}>
                    <Text style={styles.resultText}>🎉 Дұрыс тәртіп!</Text>
                    {level < levels.length - 1 ? (
                        <TouchableOpacity style={styles.button} onPress={nextLevel}>
                            <Text style={styles.buttonText}>Келесі деңгей</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.resultText}>Ойын аяқталды!</Text>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#A3E7FC',
        paddingTop: 60,
        paddingHorizontal: '5%',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 30,
        left: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    countdown: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#17696F',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginVertical: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: {
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
    },
    result: {
        alignItems: 'center',
        marginTop: 20,
    },
    resultText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#17696F',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginTop: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
});

export default MemoryPage;
