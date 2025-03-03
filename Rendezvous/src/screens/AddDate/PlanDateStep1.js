import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDateContext } from '../context/DateContext'; // Import context
import styles from './styles';
import { StyleSheet } from 'react-native';

const PlanDateStep1 = () => {
  const navigation = useNavigation();
  const { datePlan, updateDatePlan } = useDateContext(); // Get context values

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Check if the selected date is valid (today or future)
  const isDateValid = datePlan.date && datePlan.date >= today;

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.headerText}>Let’s plan your date</Text>

      {/* Question */}
      <Text style={step1Styles.questionText}>What are your preferred availabilities for a date?</Text>

      {/* Calendar */}
      <View style={step1Styles.calendarContainer}>
        <Calendar
          onDayPress={(day) => updateDatePlan('date', day.dateString)}
          markedDates={{
            [datePlan.date]: { selected: true, selectedColor: '#0066FF' },
          }}
          minDate={today} // Prevents past date selection
          theme={{
            todayTextColor: '#6A0DAD',
            arrowColor: '#6A0DAD',
            selectedDayBackgroundColor: '#0066FF',
          }}
        />
      </View>

      {/* Time Selector */}
      <View style={step1Styles.timeSelector}>
        <TouchableOpacity
          onPress={() =>
            updateDatePlan('time', {
              ...datePlan.time,
              hour: datePlan.time?.hour === '12' ? '01' : String(Number(datePlan.time?.hour || '10') + 1).padStart(2, '0')
            })
          }
          style={step1Styles.timeBox}
        >
          <Text style={step1Styles.timeText}>{datePlan.time?.hour || '10'}</Text>
        </TouchableOpacity>
        <Text style={step1Styles.colon}>:</Text>
        <TouchableOpacity
          onPress={() =>
            updateDatePlan('time', {
              ...datePlan.time,
              minute: datePlan.time?.minute === '45' ? '00' : String(Number(datePlan.time?.minute || '00') + 15).padStart(2, '0')
            })
          }
          style={step1Styles.timeBox}
        >
          <Text style={step1Styles.timeText}>{datePlan.time?.minute || '00'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            updateDatePlan('time', {
              ...datePlan.time,
              period: datePlan.time?.period === 'AM' ? 'PM' : 'AM'
            })
          }
          style={step1Styles.timeBox}
        >
          <Text style={step1Styles.timeText}>{datePlan.time?.period || 'AM'}</Text>
        </TouchableOpacity>
      </View>

      {/* Next Button */}
      <TouchableOpacity
        onPress={() => isDateValid && navigation.navigate('PlanDateStep2')}
        style={[styles.nextButton, !isDateValid && step1Styles.disabledButton]} // Disable styling
        disabled={!isDateValid} // Disable if no valid date selected
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {[...Array(5)].map((_, index) => (
          <View key={index} style={[styles.paginationDot, index === 0 && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
};

export default PlanDateStep1;

// 🔹 Screen-Specific Styles for Step 1 (Placed at the bottom)
const step1Styles = StyleSheet.create({
  questionText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10,
    color: '#666',
  },
  calendarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeBox: {
    backgroundColor: '#F8F8F8',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 50,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  colon: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  disabledButton: {
    backgroundColor: '#ddd',
  },
});
