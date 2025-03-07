import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function DateScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { restaurant } = route.params;
  
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const addAttendee = () => {
    if (!name.trim() || !email.includes('@')) {
      Alert.alert("Error", "Please enter a valid name and email.");
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
      // Create the date event with full details
      const futureDate = new Date();
      futureDate.setFullYear(2025); // Ensure the date is in the future
      
      const createDateResponse = await fetch('https://project-api-sustainable-waste.onrender.com/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      // Get the created event data including the event ID
      const eventData = await createDateResponse.json();
      const eventId = eventData._id;
      
      console.log('Created event with ID:', eventId);

      // Send invitations with the event ID
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 15,
    padding: 5,
  },
  backButtonText: {
    fontSize: 28,
    color: 'black',
  },
  header: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    color: '#333',
  },
  subText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    marginBottom: 20,
  },
  inputContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  input: {
    width: '90%',
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F8F8F8',
    fontSize: 16,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#E3C16F',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  attendeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  attendeeInfo: {
    flex: 1,
    marginLeft: 10,
  },
  attendeeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  attendeeEmail: {
    fontSize: 14,
    color: '#666',
  },
  removeButtonText: {
    fontSize: 20,
    color: '#DC3545',
  },
  submitButton: {
    backgroundColor: '#E3C16F',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
