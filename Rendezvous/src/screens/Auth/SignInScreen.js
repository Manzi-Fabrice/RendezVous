import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(AuthContext);

  const handleSignIn = async () => {
    if (!email || !password) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('https://project-api-sustainable-waste.onrender.com/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        signIn(data.token, email); 
      } else {
        alert(data.error || 'Sign in failed');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Something went wrong. Please try again.');
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#6A0DAD" />
        </TouchableOpacity>

        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign In to Continue</Text>

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
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}
          style={styles.signUpLink}
        >
          <Text style={styles.signUpText}>
            First time here?{' '}
            <Text style={styles.signUpTextBold}>Create an account</Text>
          </Text>
        </TouchableOpacity>
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
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
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
  signInButton: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
  signUpLink: {
    marginTop: 20,
    alignSelf: 'center'
  },
  signUpText: {
    fontSize: 14,
    color: '#333'
  },
  signUpTextBold: {
    color: '#6A0DAD',
    fontWeight: '600'
  }
});
