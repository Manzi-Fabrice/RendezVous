import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDateContext } from '../context/DateContext'; 
import styles from './styles';
import { StyleSheet } from 'react-native';

const PlanDateStep3 = () => {
  const navigation = useNavigation();
  const { datePlan, updateDatePlan } = useDateContext(); 

  const transportOptions = ['Car', 'Bike', 'Public Transit', 'Walking'];

  
  const increaseDistance = () => {
    updateDatePlan('maxDistance', Math.min(datePlan.maxDistance + 1, 50));
  };

  const decreaseDistance = () => {
    updateDatePlan('maxDistance', Math.max(datePlan.maxDistance - 1, 1));
  };

  
  const toggleDistanceUnit = () => {
    updateDatePlan('distanceUnit', datePlan.distanceUnit === 'Miles' ? 'KM' : 'Miles');
  };

  const isNextDisabled = !datePlan.location || !datePlan.transport;

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('PlanDateStep2', { isGoingBack: true })}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.headerText}>Let’s plan your date</Text>

      {/* Location Input */}
      <Text style={step3Styles.questionText}>Where do you live?</Text>
      <TextInput
        style={step3Styles.input}
        placeholder="City, State"
        placeholderTextColor="#aaa"
        value={datePlan.location}
        onChangeText={(text) => updateDatePlan('location', text)}
      />

      {/* Transportation Selection */}
      <Text style={step3Styles.questionText}>What is your main mode of transportation?</Text>
      <View style={step3Styles.transportContainer}>
        {transportOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[step3Styles.transportButton, datePlan.transport === option && step3Styles.selectedTransport]}
            onPress={() => updateDatePlan('transport', option)}
          >
            <Text style={[step3Styles.transportText, datePlan.transport === option && step3Styles.selectedTransportText]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Distance Stepper */}
      <Text style={step3Styles.questionText}>What is the maximum distance you’re willing to travel for a date?</Text>
      <View style={step3Styles.distanceContainer}>
        <TouchableOpacity onPress={decreaseDistance} style={step3Styles.stepperButton}>
          <Ionicons name="remove-outline" size={24} color="black" />
        </TouchableOpacity>

        <Text style={step3Styles.distanceText}>{datePlan.maxDistance}</Text>

        <TouchableOpacity onPress={increaseDistance} style={step3Styles.stepperButton}>
          <Ionicons name="add-outline" size={24} color="black" />
        </TouchableOpacity>

        {/* Miles/KM Toggle */}
        <TouchableOpacity
          style={[
            step3Styles.unitToggle,
            { backgroundColor: datePlan.distanceUnit === 'Miles' ? '#6A0DAD' : '#ddd' },
          ]}
          onPress={toggleDistanceUnit}
        >
          <Text style={step3Styles.unitToggleText}>{datePlan.distanceUnit}</Text>
        </TouchableOpacity>
      </View>

      {/* Next Button (Disabled until selection is made) */}
      <TouchableOpacity
        onPress={() => navigation.navigate('PlanDateStep4')}
        style={[styles.nextButton, isNextDisabled && step3Styles.disabledButton]}
        disabled={isNextDisabled}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {[...Array(5)].map((_, index) => (
          <View key={index} style={[styles.paginationDot, index === 2 && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
};

export default PlanDateStep3;


// Screen-Specific Styles for Step 3
const step3Styles = StyleSheet.create({
  questionText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: '#666',
  },
  input: {
    width: '85%',
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
    alignSelf: 'center',
    backgroundColor: '#F8F8F8',
    fontSize: 16,
    marginBottom: 20,
  },
  transportContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  transportButton: {
    backgroundColor: '#E6D6F2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    margin: 5,
  },
  selectedTransport: {
    backgroundColor: '#6A0DAD',
  },
  transportText: {
    fontSize: 16,
    color: '#6A0DAD',
    fontWeight: 'bold',
  },
  selectedTransportText: {
    color: '#FFF',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 90,
  },
  stepperButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  distanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
  },
  unitToggle: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  unitToggleText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#ddd', 
  },
});
