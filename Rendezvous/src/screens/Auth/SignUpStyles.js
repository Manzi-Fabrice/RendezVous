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

export default styles;