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
import { useNavigation, useRoute } from '@react-navigation/native';

export default function DateScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { restaurant } = route.params;
  
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
      // Create the date event with full details
      const futureDate = new Date();
      futureDate.setFullYear(2025); // Set to 2025 to ensure it's in the future
      
      const createDateResponse = await fetch('http://localhost:9090/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Date at ${restaurant.name}`,
          location: restaurant.address,
          dateWith: attendees[0],
          status: 'Pending',
          date: futureDate.toISOString(), // Use ISO string format
          restaurant: {
            name: restaurant.name,
            address: restaurant.address,
            rating: restaurant.rating,
            priceRange: restaurant.priceRange,
            imageUrl: restaurant.photos?.[0]?.url || null,
          },
          attendees: attendees,
          numberOfPeople: attendees.length,
        }),
      });

      if (!createDateResponse.ok) {
        const errorData = await createDateResponse.json();
        throw new Error(errorData.message || 'Failed to create date');
      }

      const dateData = await createDateResponse.json();

      // Send invitations with updated format
      const emailResponse = await fetch('http://localhost:9090/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendees,
          username: "Rendezvous"
        }),
      });

      if (emailResponse.ok) {
        Alert.alert(
          "Success",
          "Date created and invitations sent!",
          [
            {
              text: "OK",
              onPress: () => {
                // Navigate back to HomeScreen and force refresh
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home', params: { refresh: true } }],
                });
              }
            }
          ]
        );
      } else {
        Alert.alert(
          "Warning",
          "Date created but failed to send some invitations.",
          [
            {
              text: "OK",
              onPress: () => {
                // Navigate back to HomeScreen and force refresh
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home', params: { refresh: true } }],
                });
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to create date or send invitations.");
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
              textContentType="name"
              autoComplete="name"
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={attendee.email}
              keyboardType="email-address"
              onChangeText={(text) => updateAttendee(index, 'email', text)}
              textContentType="emailAddress"
              autoComplete="email"
              autoCapitalize="none"
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
