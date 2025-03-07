import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './TabNavigator';
import { DateProvider } from '../screens/context/DateContext';
import AuthStack from './AuthNavigator';
import { AuthContext } from '../context/AuthContext';

const AppNavigator = () => {
  const { userToken } = useContext(AuthContext);

  return (
    <DateProvider>
      <NavigationContainer>
        {userToken ? <TabNavigator /> : <AuthStack />}
      </NavigationContainer>
    </DateProvider>
  );
};

export default AppNavigator;
