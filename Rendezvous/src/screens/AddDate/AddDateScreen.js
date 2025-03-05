// src/screens/AddDate/AddDateScreen.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlanDateStep1 from './PlanDateStep1';
import PlanDateStep2 from './PlanDateStep2';
import PlanDateStep3 from './PlanDateStep3';
import PlanDateStep4 from './PlanDateStep4';
import PlanDateStep5 from './PlanDateStep5';
import RecommendedListScreen from '../RecommendedList/RecommendedListScreen';
import RecommendedDetails from '../RecommendedDetails/RecommendedScreen';

const Stack = createNativeStackNavigator();

const AddDateScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="PlanDateStep1"
        component={PlanDateStep1}
        options={{
          animation: 'slide_from_left',
        }}
      />
      <Stack.Screen
        name="PlanDateStep2"
        component={PlanDateStep2}
        options={({ route }) => ({
          animation: route.params?.isGoingBack ? 'slide_from_left' : 'slide_from_right',
        })}
      />
      <Stack.Screen
        name="PlanDateStep3"
        component={PlanDateStep3}
        options={({ route }) => ({
          animation: route.params?.isGoingBack ? 'slide_from_left' : 'slide_from_right',
        })}
      />
      <Stack.Screen
        name="PlanDateStep4"
        component={PlanDateStep4}
        options={({ route }) => ({
          animation: route.params?.isGoingBack ? 'slide_from_left' : 'slide_from_right',
        })}
      />
      <Stack.Screen
        name="PlanDateStep5"
        component={PlanDateStep5}
        options={({ route }) => ({
          animation: route.params?.isGoingBack ? 'slide_from_left' : 'slide_from_right',
        })}
      />
      {/* New screens */}
      <Stack.Screen
        name="RecommendedList"
        component={RecommendedListScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="RecommendedDetails"
        component={RecommendedDetails}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

export default AddDateScreen;
