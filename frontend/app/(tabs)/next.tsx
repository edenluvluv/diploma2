
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDailyTimer, BlockedMessage } from './timer';

// Define item type
type Item = {
  id: number;
  name: string;
  image: any;
  category: string;
};

// Categories of items with category names
const categories: { [key: string]: { items: Item[], displayName: string, color: string, icon: string } } = {
  animals: {
    displayName: 'Жануарлар',
    color: '#FFB3E6',
    icon: 'paw',
    items: [
      { id: 1, name: 'cat', image: require('../../assets/images/cat.png'), category: 'animals' },
      { id: 2, name: 'dog', image: require('../../assets/images/dog.png'), category: 'animals' },
      { id: 3, name: 'rabbit', image: require('../../assets/images/rabbit.png'), category: 'animals' },
    ]
  },
  furniture: {
    displayName: 'Жиһаз',
    color: '#B3E5FF',
    icon: 'home',
    items: [
      { id: 4, name: 'chair', image: require('../../assets/images/chair.png'), category: 'furniture' },
      { id: 5, name: 'table', image: require('../../assets/images/table.png'), category: 'furniture' },
      { id: 6, name: 'sofa', image: require('../../assets/images/sofa.png'), category: 'furniture' },
    ]
  },
  toys: {
    displayName: 'Ойыншықтар',
    color: '#FFE5B3',
    icon: 'game-controller',
    items: [
      { id: 7, name: 'car', image: require('../../assets/images/toy-car.png'), category: 'toys' },
      { id: 8, name: 'doll', image: require('../../assets/images/doll.png'), category: 'toys' },
      { id: 9, name: 'lego', image: require('../../assets/images/lego.png'), category: 'toys' },
    ]
  },
};

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const getRandomCategory = (): { items: Item[], displayName: string, color: string, icon: string } => {
  const keys = Object.keys(categories);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const category = categories[randomKey];
  return {
    ...category,
    items: shuffleArray(category.items)
  };
};

const screenWidth = Dimensions.get('window').width;
const itemSpacing = 20;
const totalSpacing = itemSpacing * 4;
const itemSize = (screenWidth - totalSpacing) / 3;

const NextItemGame: React.FC = () => {
  // 1. CALL ALL HOOKS FIRST
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { isBlocked, beginTracking, endTracking } = useDailyTimer();
  const [currentCategory, setCurrentCategory] = useState(getRandomCategory());
  const [sequence, setSequence] = useState<number[]>([0, 1, 2]);
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [options, setOptions] = useState<Item[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  // Animation values
  const [sequenceAnims] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]);
  const [optionAnims] = useState([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1)
  ]);
  const [scoreAnim] = useState(new Animated.Value(1));
  const [questionMarkAnim] = useState(new Animated.Value(1));

  const correctNextItem = currentCategory.items[sequence[2] + 1] ?? currentCategory.items[0];

  // 2. ALL useEffect HOOKS
  useEffect(() => {
    beginTracking();
    return () => endTracking();
  }, []);

  // 3. OTHER useEffect HOOKS
  useEffect(() => {
    setOptions(generateOptions());
    animateSequenceEntry();
    animateQuestionMark();
  }, [currentCategory]);

  // 4. CONDITIONAL RETURNS AFTER ALL HOOKS
  if (isBlocked) {
    return <BlockedMessage />;
  }

  // 5. ANIMATION FUNCTIONS
  const animateSequenceEntry = () => {
    const animations = sequenceAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 200,
        useNativeDriver: true,
      })
    );
    Animated.stagger(200, animations).start();
  };

  const animateQuestionMark = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(questionMarkAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(questionMarkAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const animateScoreIncrease = () => {
    Animated.sequence([
      Animated.timing(scoreAnim, {
        toValue: 1.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scoreAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 6. REST OF YOUR COMPONENT LOGIC
  const generateOptions = () => {
    const optionsSet = new Map<number, Item>();
    optionsSet.set(correctNextItem.id, correctNextItem);

    while (optionsSet.size < 3) {
      const randomIndex = Math.floor(Math.random() * currentCategory.items.length);
      const randomItem = currentCategory.items[randomIndex];
      if (!optionsSet.has(randomItem.id)) {
        optionsSet.set(randomItem.id, randomItem);
      }
    }

    return shuffleArray(Array.from(optionsSet.values()));
  };

  const handleAnswer = (item: Item, index: number) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);

    // Animate the selected option
    Animated.sequence([
      Animated.timing(optionAnims[index], {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(optionAnims[index], {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(optionAnims[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (item.id === correctNextItem.id) {
      setScore(score + 1);
      setMessage('🎉 Керемет!');
      animateScoreIncrease();
    } else {
      setMessage('💭 Қайтадан ойлап көр!');
    }

    setShowFeedback(true);
  };

  const nextSequence = () => {
    // Reset animations
    sequenceAnims.forEach(anim => anim.setValue(0));
    optionAnims.forEach(anim => anim.setValue(1));

    setCurrentCategory(getRandomCategory());
    setSequence([0, 1, 2]);
    setMessage('');
    setSelectedOption(null);
    setIsAnswered(false);
    setShowFeedback(false);
  };

  const resetGame = () => {
    setScore(0);
    nextSequence();
  };

  return (
    <View style={[styles.container, { backgroundColor: currentCategory.color }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#4A4A4A" />
        </TouchableOpacity>

        <View style={styles.categoryBadge}>
          <Ionicons name={currentCategory.icon as any} size={20} color="#fff" />
          <Text style={styles.categoryText}>{currentCategory.displayName}</Text>
        </View>
      </View>

      {/* Title and Score */}
      <Text style={styles.title}>Келесі қайсысы?</Text>
      <Animated.View style={[styles.scoreContainer, { transform: [{ scale: scoreAnim }] }]}>
        <Ionicons name="star" size={24} color="#FFD700" />
        <Text style={styles.score}>{score}</Text>
      </Animated.View>

      {/* Game Instructions */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>Ретті жалғастыр</Text>
      </View>

      {/* Sequence Container */}
      <View style={styles.sequenceContainer}>
        <View style={styles.sequenceWrapper}>
          {sequence.map((idx, i) =>
            currentCategory.items[idx] ? (
              <Animated.View
                key={i}
                style={[
                  styles.sequenceItem,
                  {
                    transform: [
                      { scale: sequenceAnims[i] },
                      {
                        translateY: sequenceAnims[i].interpolate({
                          inputRange: [0, 1],
                          outputRange: [50, 0],
                        })
                      }
                    ],
                    opacity: sequenceAnims[i]
                  }
                ]}
              >
                <View style={styles.imageContainer}>
                  <Image source={currentCategory.items[idx].image} style={styles.sequenceImage} />
                </View>
                <View style={styles.orderBadge}>
                  <Text style={styles.orderText}>{i + 1}</Text>
                </View>
              </Animated.View>
            ) : null
          )}

          <Animated.View style={[
            styles.questionMarkContainer,
            { transform: [{ scale: questionMarkAnim }] }
          ]}>
            <Text style={styles.questionMark}>?</Text>
            <View style={styles.orderBadge}>
              <Text style={styles.orderText}>4</Text>
            </View>
          </Animated.View>
        </View>
      </View>

      {/* Options Container */}
      <View style={styles.optionsContainer}>
        <Text style={styles.optionsTitle}>Таңда:</Text>
        <View style={styles.optionsGrid}>
          {options.map((item, index) => (
            <Animated.View
              key={item.id}
              style={[
                { transform: [{ scale: optionAnims[index] }] }
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.option,
                  selectedOption === index && (item.id === correctNextItem.id ? styles.correctOption : styles.incorrectOption),
                  isAnswered && item.id === correctNextItem.id && styles.correctOption,
                ]}
                onPress={() => handleAnswer(item, index)}
                disabled={isAnswered}
              >
                <Image source={item.image} style={styles.optionImage} resizeMode="contain" />
                {selectedOption === index && (
                  <View style={styles.selectionIndicator}>
                    <Ionicons
                      name={item.id === correctNextItem.id ? "checkmark-circle" : "close-circle"}
                      size={24}
                      color={item.id === correctNextItem.id ? "#4CAF50" : "#F44336"}
                    />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Feedback Section */}
      {showFeedback && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.feedbackButtons}>
            <TouchableOpacity style={styles.nextButton} onPress={nextSequence}>
              <Text style={styles.buttonText}>Келесі</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>

            {score >= 5 && (
              <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
                <Ionicons name="refresh" size={20} color="#6366F1" />
                <Text style={styles.resetButtonText}>Қайталау</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Floating Elements */}
      <View style={styles.floatingElements}>
        <Ionicons name="star-outline" size={20} color="rgba(255,255,255,0.3)" style={[styles.floatingIcon, { top: '20%', left: '10%' }]} />
        <Ionicons name="heart-outline" size={16} color="rgba(255,255,255,0.3)" style={[styles.floatingIcon, { top: '30%', right: '15%' }]} />
        <Ionicons name="happy-outline" size={18} color="rgba(255,255,255,0.3)" style={[styles.floatingIcon, { bottom: '25%', left: '20%' }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2D1B69',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 8,
  },
  score: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D1B69',
  },
  instructionContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 30,
  },
  instructionText: {
    fontSize: 16,
    color: '#4A4A4A',
    fontWeight: '500',
    textAlign: 'center',
  },
  sequenceContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sequenceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  sequenceItem: {
    position: 'relative',
  },
  imageContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  sequenceImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  orderBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  orderText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  questionMarkContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    width: 86,
    height: 86,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#6366F1',
    borderStyle: 'dashed',
    position: 'relative',
  },
  questionMark: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  optionsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  optionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D1B69',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  option: {
    width: itemSize * 0.8,
    height: itemSize * 0.8,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 3,
    borderColor: 'transparent',
    position: 'relative',
  },
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  incorrectOption: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  optionImage: {
    width: '70%',
    height: '70%',
    borderRadius: 12,
  },
  selectionIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
  },
  feedbackContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  message: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#2D1B69',
    textAlign: 'center',
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: 15,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  nextButton: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#6366F1',
    gap: 8,
  },
  resetButtonText: {
    color: '#6366F1',
    fontSize: 16,
    fontWeight: '600',
  },
  floatingElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  floatingIcon: {
    position: 'absolute',
  },
});

export default NextItemGame;