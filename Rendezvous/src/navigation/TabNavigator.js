import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDateContext } from '../screens/context/DateContext'; // Import DateContext

// Import screens
import HomeScreen from '../screens/Home/HomeScreen';
import AddDateScreen from '../screens/AddDate/AddDateScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SearchStackNavigator from './SearchStackNavigator';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const navigation = useNavigation();
  const { updateDatePlan } = useDateContext();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Add Date') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6A0DAD', // Active color (Purple)
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Hide default headers
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchStackNavigator} />

      {/* Reset Date Plan when clicking Add Date */}
      <Tab.Screen
        name="Add Date"
        component={AddDateScreen}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // Prevent default navigation
            updateDatePlan({
              date: null,
              time: null,
              type: null,
              people: null,
              location: null,
              transport: null,
              maxDistance: 10, // Default distance
              restaurantType: null,
              cuisine: null,
              budget: null,
              dietaryRestrictions: [],
            });
            navigation.navigate('Add Date'); // Navigate after resetting
          },
        }}
      />

      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
