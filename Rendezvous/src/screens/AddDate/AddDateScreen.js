import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlanDateStep1 from './PlanDateStep1';
import PlanDateStep2 from './PlanDateStep2';

const Stack = createNativeStackNavigator();

const AddDateScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PlanDateStep1" component={PlanDateStep1} />
      <Stack.Screen name="PlanDateStep2" component={PlanDateStep2} />
    </Stack.Navigator>
  );
};

export default AddDateScreen;
