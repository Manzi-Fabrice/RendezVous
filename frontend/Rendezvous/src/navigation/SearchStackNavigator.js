// SearchStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from '../screens/Search/SearchScreen';
import RecommendedDetails from '../screens/RecommendedDetails/RecommendedScreen';
import DateScreen from '../screens/RecommendedDetails/DateScreen';

const Stack = createStackNavigator();

export default function SearchStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchMain" component={SearchScreen} />
      <Stack.Screen name="RecommendedDetails" component={RecommendedDetails} />
      <Stack.Screen name="DateScreen" component={DateScreen} />
    </Stack.Navigator>
  );
}
