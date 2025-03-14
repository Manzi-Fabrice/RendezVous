import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userPhone, setUserPhone] = useState(null);

  const signIn = (token, email, name, phone) => {
    setUserToken(token);
    setUserEmail(email);
    setUserName(name);
    setUserPhone(phone);
  };

  const signOut = () => {
    setUserToken(null);
    setUserEmail(null);
    setUserName(null);
    setUserPhone(null);
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        userToken,
        userEmail,
        userName,
        userPhone,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
