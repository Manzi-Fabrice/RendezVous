import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import styles from './SearchStyle';

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission Denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          lat: location.coords.latitude,
          lng: location.coords.longitude
        });
        console.log('User Location:', location.coords);
      } catch (error) {
        console.log("Failed to get location:", error);
      }
    };

    getLocation();
  }, []);

  const fetchRestaurants = async () => {
    if (!userLocation) {
      console.warn("⚠️ Waiting for location...");
      return;
    }

    try {
      const response = await fetch(
        'https://project-api-sustainable-waste.onrender.com/api/recommendations/test/places',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: userLocation,
            restaurantName: searchText.trim() || ''
          })
        }
      );
      const data = await response.json();
      setRestaurants(data.results || []);
      console.log('🍽️ Restaurants from server:', data);

      Keyboard.dismiss();
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const renderRestaurant = ({ item }) => {
    const photoUrl = item.photos?.[0]?.url || null;
    const ratingText = item.rating ? `${item.rating.toFixed(1)}/5` : 'N/A';
    const priceRange = item.priceRange || '$$';
    const distanceText = item.distance?.value ? `• ${item.distance.value.toFixed(2)} km away` : '';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('RecommendedDetails', { restaurant: item })}
        activeOpacity={0.9}
      >
        {photoUrl && <Image source={{ uri: photoUrl }} style={styles.cardImage} />}
        <View style={styles.cardContent}>
          <View style={styles.topRow}>
            <Text style={styles.restaurantName} numberOfLines={1}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{ratingText}</Text>
              <Ionicons name="star" size={16} color="#6A0DAD" style={styles.starIcon} />
            </View>
          </View>
          <View style={styles.secondRow}>
            <Text style={styles.priceRange}>{priceRange}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.shortDesc}>Great food & ambiance</Text>
            {distanceText ? (
              <>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.distanceText}>{distanceText}</Text>
              </>
            ) : null}
          </View>
          <Text style={styles.addressText}>{item.address}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Find Restaurants</Text>

      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={fetchRestaurants}
          autoComplete="off"
          returnKeyType="search"
        />
        <TouchableOpacity onPress={fetchRestaurants} style={styles.searchButton}>
          <Ionicons name="search-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={restaurants}
        keyExtractor={(item, index) => item.name + index}
        renderItem={renderRestaurant}
        contentContainerStyle={styles.listContainer}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}
