import React, { useState, useEffect } from 'react';
import { Alert, 
         SafeAreaView, 
         StyleSheet, 
         Text, 
         TextInput, 
         Pressable, 
         View, 
         ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

export default function App() {
  let [weigth, setWeight] = useState(0.0);
  let [height, setHeight] = useState(0.0);
  let [message, setMessage] = useState('');
  let [calculatedValue, setCalculatedValue] = useState(0.0);
  let [storedResult, setStoredResult] = useState(0.0);
  const standards = { 
      'Underweight' : 18.5, 
      'HealthyStarts' : 18.5,
      'HealthyEnds' : 24.9,
      'OverweightStarts' : 25.0,
      'OverweightEnds' : 29.9,
      "Obese" : 30.0
    }

    const resultKey = '@result:key';
    const heightKey = '@hight:key';

    useEffect(() => {
      getValues();  
    }, [])

    const onChangeWeight = (text) => {      
      setWeight(text);
    }

    const onChangeHeight = (text) => {
      setHeight(text);
    }

    const getValues = async() => {
      try {                   
        setStoredResult(parseFloat(JSON.parse(await AsyncStorage.getItem(resultKey))));   
        setHeight(JSON.parse(await AsyncStorage.getItem(heightKey)));
      } catch (error) {
        console.log(error.message)
        Alert.alert('Error', 'There was an error while loading the data');
      }
    }

    const computeCalculation = async() => { 
      let result = 0;      
      let messageResult = '' ;
      
      result = ((weigth/(height * height)) * 703)
      setCalculatedValue(result.toFixed(1));
      
      getMessage(result);      

      try {
        await AsyncStorage.setItem(resultKey, JSON.stringify(result.toFixed(1)));
        await AsyncStorage.setItem(heightKey, JSON.stringify(height));
      } catch (error) {
        Alert.alert('Error', 'There was an error in the Calculation');
        console.log(error.message);
      }
    }

    const getMessage = (results) => {
      
      if(results < standards.Underweight){
        setMessage('Underweight!');
      }
      else if (results >= standards.HealthyStarts && results <= standards.HealthyEnds)
      {
        setMessage('You have a Healthy Person!');
      }
      else if (results >= standards.OverweightStarts && results <= standards.OverweightEnds)
      {
        setMessage('Overweight is here');
      }
      else
      {
        setMessage('Obese, let\'s eat healthier');
      }  
    }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.toolbar}>BMI Calculator</Text>
        <ScrollView style={styles.scrollView}>
          <View style={styles.box}>
              <TextInput
                style={styles.input}
                onChangeText={onChangeWeight}
                value={weigth ? weigth : ""}
                keyboardType='numeric'
                placeholder="Weight in Pounds"
              />
              <TextInput
                style={styles.input}
                onChangeText={onChangeHeight}
                value={height ? height : ''}
                keyboardType='numeric'
                placeholder="Height in Inches"
              />
              <Pressable
                onPress={() => computeCalculation()}                   
                style={styles.Calculate}>
                <Text style={styles.btnText}>Calculate BMI</Text>
              </Pressable>
              <Text style={styles.results}>
                {calculatedValue != '' ? 'Body Mass Index is ' + calculatedValue : storedResult != 0 ? 'Body Mass Index is ' + storedResult : ''}
              </Text>
              <Text style={styles.Message}>
                  {message ? message : ''}
              </Text>
            <View style={styles.assessingContainer}>
              <Text style={styles.assessingHeader}>Assessing Your BMI</Text>
              <View style={styles.assessingDescription}>
                <Text>Underweight: less than {standards.Underweight}</Text>
                <Text>Healthy: {standards.HealthyStarts} to {standards.HealthyEnds}</Text>
                <Text>Overweight: {standards.OverweightStarts} to {standards.OverweightEnds}</Text>
                <Text>Obese: {standards.Obese} or higher</Text>
              </View>
            </View>
          </View>        
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 0,
  },
  toolbar: {
    backgroundColor: '#f4511e',
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    paddingTop: 20,
    paddingBottom: 20,
    textAlign: 'center',
  },
  input :{
    fontSize: 24,
    backgroundColor: '#ECECEC',
    padding: 5,
    marginBottom: 10,
    borderRadius: 5
  },
  Calculate :{
    backgroundColor : '#34495e',
    borderRadius: 5,
  },
  assessingContainer: {
    marginTop: 60
  },
  assessingHeader: {
    fontSize: 20,
  },
  assessingDescription:{
    marginLeft: 20
  },
  btnText: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  box: {
    margin: 15,
  },
  results: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: 80 
  },
  Message: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 25
  }
});
