import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Categories of items
const categories: { [key: string]: { id: number; name: string; image: any }[] } = {
  animals: [
    { id: 1, name: 'cat', image: require('../../assets/images/cat.png') },
    { id: 2, name: 'dog', image: require('../../assets/images/dog.png') },
    { id: 3, name: 'rabbit', image: require('../../assets/images/rabbit.png') },
  ],
  furniture: [
    { id: 4, name: 'chair', image: require('../../assets/images/chair.png') },
    { id: 5, name: 'table', image: require('../../assets/images/table.png') },
    { id: 6, name: 'sofa', image: require('../../assets/images/sofa.png') },
  ],
  toys: [
    { id: 7, name: 'car', image: require('../../assets/images/toy-car.png') },
    { id: 8, name: 'doll', image: require('../../assets/images/doll.png') },
    { id: 9, name: 'lego', image: require('../../assets/images/lego.png') },
  ],
};

const shuffleArray = <T,>(array: T[]): T[] => {
  return array.sort(() => Math.random() - 0.5);
};

const getRandomCategory = () => {
  const keys = Object.keys(categories);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return shuffleArray(categories[randomKey]);
};

const NextItemGame: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any, any>>();
  
  const [currentCategory, setCurrentCategory] = useState<{ id: number; name: string; image: any }[]>(getRandomCategory());
  const [sequence, setSequence] = useState<number[]>([0, 1, 2]);
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [options, setOptions] = useState<{ id: number; name: string; image: any }[]>([]);
  
  const correctNextItem = currentCategory[sequence[2] + 1] ?? currentCategory[0];

  const generateOptions = () => {
    const optionsSet = new Set<{ id: number; name: string; image: any }>();
    optionsSet.add(correctNextItem);

    while (optionsSet.size < 3) {
      const randomIndex = Math.floor(Math.random() * currentCategory.length);
      const randomItem = currentCategory[randomIndex];

      if (randomItem) {
        optionsSet.add(randomItem);
      }
    }
    return shuffleArray(Array.from(optionsSet));
  };

  useEffect(() => {
    setOptions(generateOptions());
  }, [currentCategory]);

  const handleAnswer = (item: { id: number }) => {
    if (item.id === correctNextItem.id) {
      setScore(score + 1);
      setMessage('✅ Дұрыс!');
    } else {
      setMessage('❌ Қайтадан жасап көр!');
    }
  };

  const nextSequence = () => {
    setCurrentCategory(getRandomCategory()); 
    setSequence([0, 1, 2]); 
    setOptions(generateOptions());
    setMessage('');
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Келесі қайсы?</Text>
      <Text style={styles.score}>Ұпай: {score}</Text>

      <View style={styles.sequenceContainer}>
        {sequence.map((idx, i) => (
          currentCategory[idx] && (
            <Image key={i} source={currentCategory[idx]?.image} style={styles.image} />
          )
        ))}
        <Text style={styles.questionMark}>?</Text>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((item) => (
          <TouchableOpacity key={`${item.id}-${Math.random()}`} style={styles.option} onPress={() => handleAnswer(item)}>
            <Image source={item.image} style={styles.imageOption} />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.message}>{message}</Text>

      <TouchableOpacity style={styles.nextButton} onPress={nextSequence}>
        <Text style={styles.buttonText}>келесі</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A3E7FC',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  score: {
    fontSize: 24,
    color: '#333',
    marginBottom: 20,
  },
  sequenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  questionMark: {
    fontSize: 60,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  image: {
    width: 100,
    height: 100,
    marginHorizontal: 15,
    borderRadius: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  option: {
    padding: 20,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  imageOption: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  message: {
    fontSize: 20,
    marginVertical: 10,
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default NextItemGame;
