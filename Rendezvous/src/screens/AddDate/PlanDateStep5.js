import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import { StyleSheet } from 'react-native';

const PlanDateStep5 = () => {
  const navigation = useNavigation();
  
  // Budget Selection
  const [selectedBudget, setSelectedBudget] = useState(null);
  const budgetOptions = ['$','$$','$$$','$$$$'];

  // Date Duration Selection
  const [selectedDuration, setSelectedDuration] = useState(null);
  const durationOptions = ['30 min', '1 hour', '2 hours', '3+ hours'];

  // Allergy-Free Option
  const [allergyFree, setAllergyFree] = useState(false);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('PlanDateStep4', { isGoingBack: true })}
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

      {/* Date Duration Selection */}
      <Text style={step5Styles.questionText}>How long do you want the date to last?</Text>
      <View style={step5Styles.bubbleContainer}>
        {durationOptions.map((duration) => (
          <TouchableOpacity
            key={duration}
            style={[step5Styles.bubble, selectedDuration === duration && step5Styles.selectedBubble]}
            onPress={() => setSelectedDuration(duration)}
          >
            <Text style={[step5Styles.bubbleText, selectedDuration === duration && step5Styles.selectedText]}>
              {duration}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Allergy-Free Option */}
      <Text style={step5Styles.questionText}>Do you want an allergy-free restaurant?</Text>
      <TouchableOpacity
        style={[
          step5Styles.allergyToggle,
          { backgroundColor: allergyFree ? '#6A0DAD' : '#ddd' },
        ]}
        onPress={() => setAllergyFree(!allergyFree)}
      >
        <Text style={step5Styles.allergyToggleText}>
          {allergyFree ? 'Yes' : 'No'}
        </Text>
      </TouchableOpacity>

      {/* Next Button */}
      <TouchableOpacity onPress={() => navigation.navigate('PlanDateSummary')} style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Next</Text>
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
    backgroundColor: '#6A0DAD', // Matches the selected style from screen 3
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
  allergyToggle: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 70,
  },
  allergyToggleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
