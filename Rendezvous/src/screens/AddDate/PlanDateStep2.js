import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from './styles';
import { StyleSheet } from 'react-native';

const PlanDateStep2 = () => {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState(null);
  const [items, setItems] = useState([...Array(10).keys()].map((num) => ({
    label: String(num + 1),
    value: String(num + 1),
  })).concat([{ label: 'More than 10', value: 'More than 10' }]));

  const dateTypes = ['Couples Date', 'Friend Date', 'Family Date', 'Kids Date', 'Casual Meetup', 'Business Meetup'];

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.navigate('PlanDateStep1')} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.headerText}>Let’s plan your date</Text>

      {/* Question */}
      <Text style={step2Styles.questionText}>What type of date are you going on?</Text>

      {/* Date Type Selection */}
      <View style={step2Styles.bubbleContainer}>
  {dateTypes.map((type) => (
    <TouchableOpacity
      key={type}
      style={[step2Styles.bubble, selectedType === type && step2Styles.selectedBubble]}
      onPress={() => setSelectedType(type)}
    >
      <Text style={[step2Styles.bubbleText, selectedType === type && step2Styles.selectedText]}>
        {type}
      </Text>
    </TouchableOpacity>
  ))}
</View>


      {/* New Question: How many people are you inviting? */}
      <Text style={step2Styles.questionText}>How many people are you inviting to the date?</Text>
      
      <DropDownPicker
  open={open}
  value={selectedPeople}
  items={items}
  setOpen={setOpen}
  setValue={setSelectedPeople}
  setItems={setItems}
  placeholder="Select number of people"
  containerStyle={step2Styles.dropdownContainer}
  style={step2Styles.picker}
  dropDownContainerStyle={[step2Styles.dropDownBox, { height: open ? 90 : 0 }]} // Ensures only 2 items are visible
/>



      {/* Next Button */}
      <TouchableOpacity onPress={() => navigation.navigate('PlanDateStep3')} style={styles.nextButton}>
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

const step2Styles = StyleSheet.create({
  questionText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 20,
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
    backgroundColor: '#E6D6F2', // Keeps the original color
    borderWidth: 2, // Adds a highlight effect
    borderColor: 'rgba(106, 13, 173, 0.6)', // Purple border
    opacity: 0.9, // Slight transparency
  },
  bubbleText: {
    fontSize: 16,
    color: '#6A0DAD',
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#4A0072', // Darker purple to show selection
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
});
