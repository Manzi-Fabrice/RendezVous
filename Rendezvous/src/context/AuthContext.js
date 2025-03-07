
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  const signIn = (token, email) => {
    setUserToken(token);
    setUserEmail(email);
  };

  const signOut = () => {
    setUserToken(null);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, userToken, userEmail }}>
      {children}
    </AuthContext.Provider>
  );
};
