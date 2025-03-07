import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      alert('Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('https://project-api-sustainable-waste.onrender.com/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: 'Sample User'
        })
      });
      const data = await response.json();

      if (response.ok) {
        alert('User registered successfully!');
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
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20
  },
  backArrow: {
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    color: '#6A0DAD',
    fontWeight: 'bold',
    marginBottom: 30
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    marginBottom: 15
  },
  signUpButton: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
  signInLink: {
    marginTop: 20,
    alignSelf: 'center'
  },
  signInText: {
    fontSize: 14,
    color: '#333'
  },
  signInTextBold: {
    color: '#6A0DAD',
    fontWeight: '600'
  },
  paginationContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 30
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 4
  },
  dotActive: {
    backgroundColor: '#6A0DAD'
  }
});
