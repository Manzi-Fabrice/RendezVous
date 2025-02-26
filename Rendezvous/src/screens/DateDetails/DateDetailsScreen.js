import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DateDetailsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Date Details Screen</Text>
    </View>
  );
};

export default DateDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});
