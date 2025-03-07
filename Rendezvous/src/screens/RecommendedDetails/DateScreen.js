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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function DateScreen() {
  const [attendees, setAttendees] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

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
      const response = await fetch('http://localhost:9090/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendees, username: "YourNameHere" }), // 🔹 Explicitly include username
      });
  
      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", "Emails sent successfully!");
      } else {
        Alert.alert("Error", "Failed to send emails.");
      }
    } catch (error) {
      console.error("Email send error:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* 🔹 Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      {/* 🔹 Header */}
      <Text style={styles.header}>Connect with your date</Text>
      <Text style={styles.subText}>Add your date’s name and email to connect with them.</Text>

      {/* 🔹 Input Fields */}
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

      {/* 🔹 Attendees List */}
      <FlatList
        data={attendees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.attendeeCard}>
            <Ionicons name="person-circle-outline" size={50} color="#666" />
            <View style={styles.attendeeInfo}>
              <Text style={styles.attendeeName}>{item.name}</Text>
              <Text style={styles.attendeeEmail}>{item.email}</Text>
            </View>
            <TouchableOpacity onPress={() => removeAttendee(item.id)}>
              <Ionicons name="close-circle" size={24} color="#DC3545" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* 🔹 Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// 🔹 **Updated Styles**
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
    flexDirection: 'column',
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

