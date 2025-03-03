import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './TabNavigator';
import { DateProvider } from '../screens/context/DateContext'; 

const AppNavigator = () => {
  return (
    <DateProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </DateProvider>
  );
};

export default AppNavigator;
