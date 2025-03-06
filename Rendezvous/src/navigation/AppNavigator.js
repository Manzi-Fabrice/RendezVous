import React, { useState, useEffect }  from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './TabNavigator';
import { DateProvider } from '../screens/context/DateContext';
import AuthStack from './AuthNavigator';
import { AuthContext } from '../context/AuthContext';

const AppNavigator = () => {

  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const checkToken = async () =>{
      try{
        const token = null;
        setUserToken(token);
      }catch (error){
        console.error('Token check error:', error);
      }finally{
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  const authContextValue = {
    signIn: (token) => {
      setUserToken(token);
    },
    signOut: () => {
      setUserToken(null);
    },
    userToken,
  };

  if (loading){
    return null;
  }
  return (
    <AuthContext.Provider value={authContextValue}>
    <DateProvider>
      <NavigationContainer>
      {userToken ? (
        <TabNavigator />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
    </DateProvider>
    </AuthContext.Provider>
  );
};

export default AppNavigator;
