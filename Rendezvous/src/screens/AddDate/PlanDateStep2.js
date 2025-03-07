import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDateContext } from '../context/DateContext'; // Import DateContext
import styles from './styles';
import { StyleSheet } from 'react-native';

const PlanDateStep2 = () => {
  const navigation = useNavigation();
  const { datePlan, updateDatePlan } = useDateContext(); // Get context values
  const [open, setOpen] = React.useState(false);
  // Use local state for the dropdown value and initialize with context value
  const [peopleValue, setPeopleValue] = React.useState(datePlan.people || null);

  const dateTypes = [
    'Couples Date',
    'Friend Date',
    'Family Date',
    'Kids Date',
    'Casual Meetup',
    'Business Meetup'
  ];
  const items = [...Array(10).keys()].map((num) => ({
    label: String(num + 1),
    value: String(num + 1),
  })).concat([{ label: 'More than 10', value: 'More than 10' }]);

  // Check if all required fields are filled
  const isNextDisabled = !(datePlan.type && datePlan.people);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('PlanDateStep1', { isGoingBack: true })}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.headerText}>Let’s plan your date</Text>

      {/* Question: Date Type */}
      <Text style={step2Styles.questionText}>What type of date are you going on?</Text>

      {/* Date Type Selection */}
      <View style={step2Styles.bubbleContainer}>
        {dateTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[step2Styles.bubble, datePlan.type === type && step2Styles.selectedBubble]}
            onPress={() => updateDatePlan('type', type)}
          >
            <Text style={[step2Styles.bubbleText, datePlan.type === type && step2Styles.selectedText]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Question: Number of People */}
      <Text style={step2Styles.questionText}>How many people are you inviting to the date?</Text>

      <DropDownPicker
        open={open}
        value={peopleValue}
        items={items}
        setOpen={setOpen}
        // Use the setter to update both local state and the context value.
        setValue={(callback) => {
          const newValue = callback(peopleValue);
          setPeopleValue(newValue);
          updateDatePlan('people', newValue);
        }}
        setItems={() => {}}
        placeholder="Select number of people"
        containerStyle={step2Styles.dropdownContainer}
        style={step2Styles.picker}
        dropDownContainerStyle={[
          step2Styles.dropDownBox,
          { height: open ? 90 : 0 } // Ensures only 2 items are visible at a time
        ]}
      />

      {/* Next Button (Disabled until selections are made) */}
      <TouchableOpacity
        onPress={() => navigation.navigate('PlanDateStep3')}
        style={[styles.nextButton, isNextDisabled && step2Styles.disabledButton]}
        disabled={isNextDisabled}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {[...Array(5)].map((_, index) => (
          <View key={index} style={[styles.paginationDot, index === 1 && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
};

export default PlanDateStep2;

// 🔹 Screen-Specific Styles for Step 2
const step2Styles = StyleSheet.create({
  questionText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 30,
    color: '#666',
  },
  bubbleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  bubble: {
    backgroundColor: '#E6D6F2',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 20,
    margin: 5,
  },
  selectedBubble: {
    backgroundColor: '#6A0DAD', // Keeps the selected style from before
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
  dropdownContainer: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: 120,
  },
  picker: {
    backgroundColor: '#FFF',
    borderColor: '#ddd',
  },
  dropDownBox: {
    backgroundColor: '#FFF',
    borderColor: '#ddd',
    maxHeight: 90, // Allows only 2 visible items, the rest are scrollable
  },
  disabledButton: {
    backgroundColor: '#ddd', // Greyed-out button
  },
});
