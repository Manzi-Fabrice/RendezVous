import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import { StyleSheet } from 'react-native';

const PlanDateStep5 = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Retrieve previous selections from route params (if available)
  const [selectedBudget, setSelectedBudget] = useState(route.params?.selectedBudget || null);
  const [selectedRestrictions, setSelectedRestrictions] = useState(route.params?.selectedRestrictions || []);

  const budgetOptions = ['$','$$','$$$','$$$$'];
  const dietaryRestrictions = ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'];

  // Toggle selection for dietary restrictions
  const toggleRestriction = (restriction) => {
    setSelectedRestrictions((prev) =>
      prev.includes(restriction)
        ? prev.filter((r) => r !== restriction)
        : [...prev, restriction]
    );
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('PlanDateStep4', { 
          isGoingBack: true,
          selectedBudget,
          selectedRestrictions
        })}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.headerText}>Let’s plan your date</Text>

      {/* Budget Selection */}
      <Text style={step5Styles.questionText}>What is your budget?</Text>
      <View style={step5Styles.bubbleContainer}>
        {budgetOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[step5Styles.bubble, selectedBudget === option && step5Styles.selectedBubble]}
            onPress={() => setSelectedBudget(option)}
          >
            <Text style={[step5Styles.bubbleText, selectedBudget === option && step5Styles.selectedText]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dietary Restrictions Selection */}
      <Text style={step5Styles.questionText}>Do you have any dietary restrictions?</Text>
      <View style={step5Styles.bubbleContainer}>
        {dietaryRestrictions.map((restriction) => (
          <TouchableOpacity
            key={restriction}
            style={[
              step5Styles.bubble,
              selectedRestrictions.includes(restriction) && step5Styles.selectedBubble
            ]}
            onPress={() => toggleRestriction(restriction)}
          >
            <Text style={[
              step5Styles.bubbleText,
              selectedRestrictions.includes(restriction) && step5Styles.selectedText
            ]}>
              {restriction}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Request a Date Button */}
      <TouchableOpacity 
  onPress={() => navigation.navigate('ConnectWithDate')} 
  style={styles.requestButton}
>
  <Text style={styles.requestButtonText}>Request a Date</Text>
</TouchableOpacity>


      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {[...Array(6)].map((_, index) => (
          <View key={index} style={[styles.paginationDot, index === 4 && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
};

export default PlanDateStep5;

// 🔹 Screen-Specific Styles for Step 5
const step5Styles = StyleSheet.create({
  questionText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
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
    backgroundColor: '#6A0DAD', // Matches selected style from screen 3
    opacity: 0.9, // Slight transparency
  },
  bubbleText: {
    fontSize: 16,
    color: '#6A0DAD',
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#FFF', // White text for contrast
  },
  requestButton: {
    backgroundColor: '#6A0DAD',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 40,
    marginBottom: 50,
  },
  requestButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
