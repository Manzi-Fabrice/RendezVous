import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDateContext } from '../context/DateContext'; 
import styles from './styles';
import { StyleSheet } from 'react-native';

const PlanDateStep4 = () => {
  const navigation = useNavigation();
  const { datePlan, updateDatePlan } = useDateContext(); 

  const restaurantTypes = [
    'Fast Food', 'Casual Dining', 'Fine Dining', 'Café',
    'Buffet', 'Vegan', 'Seafood', 'Steakhouse', 'Dessert'
  ];

  const cuisineTypes = [
    'Jamaican', 'Mexican', 'Italian', 'Chinese',
    'Japanese', 'Indian', 'French', 'Mediterranean', 'Thai'
  ];

  
  const isNextDisabled = !(datePlan.restaurantType && datePlan.cuisine);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('PlanDateStep3', { isGoingBack: true })}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.headerText}>Let’s plan your date</Text>

      {/* Restaurant Type Selection */}
      <Text style={step4Styles.questionText}>What type of restaurant are you looking for?</Text>
      <View style={step4Styles.bubbleContainer}>
        {restaurantTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[step4Styles.bubble, datePlan.restaurantType === type && step4Styles.selectedBubble]}
            onPress={() => updateDatePlan('restaurantType', type)}
          >
            <Text style={[step4Styles.bubbleText, datePlan.restaurantType === type && step4Styles.selectedText]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Cuisine Selection */}
      <Text style={step4Styles.questionText}>What type of cuisine would you like?</Text>
      <View style={step4Styles.bubbleContainer}>
        {cuisineTypes.map((cuisine) => (
          <TouchableOpacity
            key={cuisine}
            style={[step4Styles.bubble, datePlan.cuisine === cuisine && step4Styles.selectedBubble]}
            onPress={() => updateDatePlan('cuisine', cuisine)}
          >
            <Text style={[step4Styles.bubbleText, datePlan.cuisine === cuisine && step4Styles.selectedText]}>
              {cuisine}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Next Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('PlanDateStep5')}
        style={[styles.nextButton, isNextDisabled && step4Styles.disabledButton]} // Disable styling
        disabled={isNextDisabled} // Disable if selections are not made
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {[...Array(5)].map((_, index) => (
          <View key={index} style={[styles.paginationDot, index === 3 && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
};

export default PlanDateStep4;

// Screen-Specific Styles for Step 4
const step4Styles = StyleSheet.create({
  questionText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: '#666',
  },
  bubbleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  bubble: {
    backgroundColor: '#E6D6F2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    margin: 5,
  },
  selectedBubble: {
    backgroundColor: '#6A0DAD', 
    opacity: 0.9, 
  },
  bubbleText: {
    fontSize: 16,
    color: '#6A0DAD',
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#FFF', 
  },
  disabledButton: {
    backgroundColor: '#ddd', 
  },
});
