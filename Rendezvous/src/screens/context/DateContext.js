import React, { createContext, useState, useContext } from 'react';

// Create the context
const DateContext = createContext();

// Custom hook to use context
export const useDateContext = () => useContext(DateContext);

// Provider component
export const DateProvider = ({ children }) => {
  const [datePlan, setDatePlan] = useState({
    date: null, // Step 1: Selected date
    time: null, // Step 1: Selected time
    type: null, // Step 2: Date type (Couples, Friends, etc.)
    people: null, // Step 2: Number of people
    location: null, // Step 3: User's location
    transport: null, // Step 3: Selected transport
    maxDistance: 10, // Step 3: Maximum travel distance
    restaurantType: null, // Step 4: Restaurant type (Fine Dining, Café, etc.)
    cuisine: null, // Step 4: Cuisine (Italian, Mexican, etc.)
    budget: null, // Step 5: Budget range ($, $$, $$$)
    dietaryRestrictions: [], // Step 5: Dietary restrictions
  });

  // Function to update fields dynamically
  const updateDatePlan = (key, value) => {
    setDatePlan(prev => ({ ...prev, [key]: value }));
  };

  return (
    <DateContext.Provider value={{ datePlan, updateDatePlan }}>
      {children}
    </DateContext.Provider>
  );
};
