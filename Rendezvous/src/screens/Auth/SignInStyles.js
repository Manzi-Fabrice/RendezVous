import { StyleSheet } from "react-native";

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

export default styles;