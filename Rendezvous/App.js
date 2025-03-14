import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { EventProvider } from './src/context/EventContext';
export default function App() {
  return (
    <AuthProvider>
      <EventProvider>
      <AppNavigator />
      </EventProvider>
    </AuthProvider>
  );
}
