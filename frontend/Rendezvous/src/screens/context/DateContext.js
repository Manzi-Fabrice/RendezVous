import React, { createContext, useState, useContext } from 'react';

const DateContext = createContext();

export const useDateContext = () => useContext(DateContext);

export const DateProvider = ({ children }) => {
  const [datePlan, setDatePlan] = useState({
    date: null, // Selected date
    time: null, // Selected time
    type: null, // Date type (Couples, Friends, etc.)
    people: null, // Number of people
    location: null, // User's location
    transport: null, // Selected transport
    maxDistance: 10, // travel distance
    restaurantType: null, // Restaurant type (Fine Dining, Café, etc.)
    cuisine: null, //  Cuisine type (Italian, Mexican, etc.)
    budget: null, // Budget range ($, $$, $$$)
    dietaryRestrictions: [], // Dietary restrictions
  });


  const updateDatePlan = (key, value) => {
    setDatePlan(prev => ({ ...prev, [key]: value }));
  };

  return (
    <DateContext.Provider value={{ datePlan, updateDatePlan }}>
      {children}
    </DateContext.Provider>
  );
};
