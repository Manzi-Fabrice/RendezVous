import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDateContext } from '../context/DateContext'; // Import DateContext
import styles from './styles';
import { StyleSheet } from 'react-native';

const PlanDateStep5 = () => {
  const navigation = useNavigation();
  const { datePlan, updateDatePlan } = useDateContext();

  const budgetOptions = ['$','$$','$$$','$$$$'];
  const dietaryRestrictions = ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'];

  // Toggle selection for dietary restrictions
  const toggleRestriction = (restriction) => {
    const updatedRestrictions = datePlan.dietaryRestrictions.includes(restriction)
      ? datePlan.dietaryRestrictions.filter((r) => r !== restriction)
      : [...datePlan.dietaryRestrictions, restriction];
    updateDatePlan('dietaryRestrictions', updatedRestrictions);
  };
  const sendDataToAI = async () => {
    console.log('📊 Checking datePlan before sending:', JSON.stringify(datePlan, null, 2));
  
    if (!datePlan.maxDistance) {
      console.error('🚨 Error: maxDistance is undefined');
      return;
    }
    const LOCAL_BACKEND_URL = 'http://localhost:9090';
    try {
      const response = await fetch(
        `${LOCAL_BACKEND_URL}/api/recommendations/personalized`,
        //'https://project-api-sustainable-waste.onrender.com/api/recommendations/personalized',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...datePlan,
            maxDistance: datePlan.maxDistance ?? 10,  // ✅ Ensure it is set
          }),
        }
      );
  
      const data = await response.json();
      console.log('✅ API Response:', data);
  
      if (response.ok) {
        navigation.navigate('RecommendedList', { recommendations: data });

      } else {
        console.error('❌ API Error:', data);
      }
    } catch (error) {
      console.error('❌ Error sending data to AI:', error);
    }
  };
  

  

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('PlanDateStep4')}
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
            style={[step5Styles.bubble, datePlan.budget === option && step5Styles.selectedBubble]}
            onPress={() => updateDatePlan('budget', option)}
          >
            <Text style={[step5Styles.bubbleText, datePlan.budget === option && step5Styles.selectedText]}>
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
            style={[step5Styles.bubble, datePlan.dietaryRestrictions.includes(restriction) && step5Styles.selectedBubble]}
            onPress={() => toggleRestriction(restriction)}
          >
            <Text style={[step5Styles.bubbleText, datePlan.dietaryRestrictions.includes(restriction) && step5Styles.selectedText]}>
              {restriction}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recommend Date Button */}
      <TouchableOpacity onPress={sendDataToAI} style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Recommend Date</Text>
      </TouchableOpacity>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {[...Array(5)].map((_, index) => (
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
});