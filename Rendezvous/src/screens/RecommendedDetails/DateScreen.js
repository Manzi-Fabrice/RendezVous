import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';

export default function DateScreen() {
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [attendees, setAttendees] = useState([]);

  const handleNumberChange = (num) => {
    const count = parseInt(num) || 0;
    setNumberOfPeople(num);

    setAttendees(new Array(count).fill().map((_, index) => ({
      id: index + 1,
      name: '',
      email: '',
    })));
  };

  const updateAttendee = (index, field, value) => {
    const updatedAttendees = [...attendees];
    updatedAttendees[index][field] = value;
    setAttendees(updatedAttendees);
  };

  const handleSubmit = async () => {
    if (!attendees.length) {
      Alert.alert("Error", "Please enter at least one attendee.");
      return;
    }

    for (let attendee of attendees) {
      if (!attendee.name || !attendee.email.includes('@')) {
        Alert.alert("Error", "Each attendee must have a valid name and email.");
        return;
      }
    }

    try {
      const response = await fetch('http://localhost:9090/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendees, username: "YourNameHere" }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", "Emails sent successfully!");
      } else {
        Alert.alert("Error", "Failed to send emails.");
      }
    } catch (error) {
      console.error(" Email send error:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Enter Number of People Attending</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={numberOfPeople}
          onChangeText={handleNumberChange}
          placeholder="Number of Attendees"
        />

        {attendees.map((attendee, index) => (
          <View key={attendee.id} style={styles.attendeeContainer}>
            <Text style={styles.attendeeTitle}>Person {index + 1}</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={attendee.name}
              onChangeText={(text) => updateAttendee(index, 'name', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={attendee.email}
              keyboardType="email-address"
              onChangeText={(text) => updateAttendee(index, 'email', text)}
            />
          </View>
        ))}

        <Button title="Send Invitation" onPress={handleSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  attendeeContainer: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  attendeeTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});
