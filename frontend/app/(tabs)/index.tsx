import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import axios from 'axios'
export default function HomeScreen() {
  const [hello, setHello] = useState('')
  useEffect(() =>{
    // const getData = async () => {
    //   await axios.get("http://localhost:3000/").then((res=>{
    //     console.log(res.data);
        
    //     setHello(res.data)
    //   }))
    // }
    // getData()
  }, [])
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{hello}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    color: "#ffffff"
  }
});
