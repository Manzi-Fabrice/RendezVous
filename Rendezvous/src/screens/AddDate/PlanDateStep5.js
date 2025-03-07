import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ActivityIndicator, 
  StyleSheet, 
  InteractionManager 
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDateContext } from '../context/DateContext'; 
import styles from './styles';

const PlanDateStep5 = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { datePlan, updateDatePlan } = useDateContext();
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  const budgetOptions = ['$','$$','$$$','$$$$'];
  const dietaryRestrictions = ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'];

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

    setLoading(true);

    try {
      const response = await fetch(
        'https://project-api-sustainable-waste.onrender.com/api/recommendations/personalized',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...datePlan,
            maxDistance: datePlan.maxDistance ?? 10,
          }),
        }
      );

      const data = await response.json();
      console.log('✅ API Response:', data);

      setLoading(false);

      if (response.ok && data.restaurants && data.restaurants.results.length > 0) {
        navigation.navigate('RecommendedList', { recommendations: data });
      } else {
        // Delay updating error and modal visibility until after interactions complete.
        InteractionManager.runAfterInteractions(() => {
          // Only set error if the screen is still focused.
          if (isFocused) {
            setError('No recommended restaurants found. Please adjust your preferences and try again.');
            setErrorVisible(true);
          }
        });
      }
    } catch (err) {
      console.error('❌ Error sending data to AI:', err);
      setLoading(false);
      InteractionManager.runAfterInteractions(() => {
        if (isFocused) {
          setError('Something went wrong while fetching recommendations. Please try again later.');
          setErrorVisible(true);
        }
      });
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
            style={[
              step5Styles.bubble, 
              datePlan.dietaryRestrictions.includes(restriction) && step5Styles.selectedBubble
            ]}
            onPress={() => toggleRestriction(restriction)}
          >
            <Text style={[
              step5Styles.bubbleText, 
              datePlan.dietaryRestrictions.includes(restriction) && step5Styles.selectedText
            ]}>
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

      {/* Loading Modal */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={step5Styles.modalOverlay}>
          <View style={step5Styles.loadingModalContent}>
            <ActivityIndicator size="large" color="#6A0DAD" />
            <Text style={step5Styles.loadingText}>Generating recommendations! Hang Tight!</Text>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal 
        visible={errorVisible} 
        transparent 
        animationType="fade" 
        onRequestClose={() => {
          setError(null);
          setErrorVisible(false);
        }}
      >
        <View style={step5Styles.modalOverlay}>
          <View style={step5Styles.errorModalContent}>
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => {
                setError(null);
                setErrorVisible(false);
              }}
              style={step5Styles.modalCloseButton}
            >
              <Ionicons name="close-circle" size={28} color="#DC3545" />
            </TouchableOpacity>
            <Text style={step5Styles.modalText}>{error}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PlanDateStep5;

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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingModalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  errorModalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
