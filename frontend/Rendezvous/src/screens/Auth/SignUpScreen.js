import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './SignUpStyles';
import { validateEmail, validatePhoneNumber } from './Validate';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !phoneNumber) {
      alert('Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if(!validateEmail(email)){
      alert('Please enter a valid email');
      return;
    }

    if(!validatePhoneNumber(phoneNumber)){
      alert('Please enter a valid phone Number');
      return;
    }

    try {
      const response = await fetch('https://project-api-sustainable-waste.onrender.com/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name,
          phoneNumber
        })
      });
      const data = await response.json();

      if (response.ok) {
        alert('User registered successfully! Please Sign In');
        navigation.navigate('SignIn');
      } else {
        alert(data.error || 'Sign up failed');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#6A0DAD" />
        </TouchableOpacity>

        <Text style={styles.title}>Let’s learn a little bit about you</Text>

        <TextInput
          style={styles.input}
          placeholder="Input Your Name"
          placeholderTextColor="#999"
          keyboardType="name-phone-pad"
          autoCapitalize="none"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="phone number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          autoCapitalize="none"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        textContentType ="oneTimeCode"
        onChangeText={setPassword}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
      />


        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          textContentType ="oneTimeCode"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
        />

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('SignIn')}
          style={styles.signInLink}
        >
          <Text style={styles.signInText}>
            Already have an account?{' '}
            <Text style={styles.signInTextBold}>Click to Sign In</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.paginationContainer}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </SafeAreaView>
  );
}
