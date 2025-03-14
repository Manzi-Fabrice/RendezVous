import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './DateStyle';
import { validateEmail } from '../Auth/Validate';
import { AuthContext } from '../../context/AuthContext';

export default function DateScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { restaurant } = route.params;
  const [attendees, setAttendees] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { userToken } = useContext(AuthContext);

  const addAttendee = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a valid name");
      return;
    }

    if (!validateEmail(email)){
      Alert.alert("Error", "Please enter a valid name");
      return;
    }

    setAttendees([...attendees, { id: Date.now(), name, email }]);
    setName('');
    setEmail('');
  };

  const removeAttendee = (id) => {
    setAttendees(attendees.filter(attendee => attendee.id !== id));
  };

  const handleSubmit = async () => {
    if (attendees.length === 0) {
      Alert.alert("Error", "Please add at least one attendee.");
      return;
    }
    try {
      const futureDate = new Date();
      futureDate.setFullYear(2025);

      const createDateResponse = await fetch('//https://project-api-sustainable-waste.onrender.com/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
         },
        body: JSON.stringify({
          title: `Date at ${restaurant.name}`,
          location: restaurant.address,
          dateWith: attendees[0],
          status: 'Pending',
          date: futureDate.toISOString(),
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
      const eventData = await createDateResponse.json();
      const eventId = eventData._id;

      console.log('Created event with ID:', eventId);

      const emailResponse = await fetch('https://project-api-sustainable-waste.onrender.com/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendees,
          username: "Rendezvous",
          eventId: eventId
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
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Connect with your date</Text>
      <Text style={styles.subText}>Add your date's name and email to connect with them.</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity style={styles.addButton} onPress={addAttendee}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={attendees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.attendeeCard}>
            <View style={styles.attendeeInfo}>
              <Text style={styles.attendeeName}>{item.name}</Text>
              <Text style={styles.attendeeEmail}>{item.email}</Text>
            </View>
            <TouchableOpacity onPress={() => removeAttendee(item.id)}>
              <Text style={styles.removeButtonText}>✖</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Send Invite</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
