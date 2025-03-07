import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigation = useNavigation();

  // Get User's Location
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
        console.log('📍 User Location:', location.coords);
      } catch (error) {
        console.log("❌ Failed to get location:", error);
      }
    };

    getLocation();
  }, []);

  // Fetch Restaurants
  const fetchRestaurants = async () => {
    if (!userLocation) {
      console.warn("⚠️ Waiting for location...");
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:9090/api/recommendations/test/places',
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

      Keyboard.dismiss(); // Hide keyboard after search
    } catch (error) {
      console.error('❌ Error fetching restaurants:', error);
    }
  };

  // Render Restaurant Card
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
          onSubmitEditing={fetchRestaurants} // 🔹 Search on Enter Key Press
          returnKeyType="search" // 🔹 Show 'Search' button on keyboard
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
        keyboardShouldPersistTaps="handled" // 🔹 Ensures list is tappable when keyboard is open
      />
    </SafeAreaView>
  );
}

// 🔹 Matching Styles with RecommendedListScreen
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6A0DAD',
    marginVertical: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#6A0DAD',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#6A0DAD',
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  // 🔹 CARD STYLES
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#6A0DAD',
  },
  cardImage: {
    width: '100%',
    height: 170,
    backgroundColor: '#eee',
  },
  cardContent: {
    padding: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flexShrink: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#6A0DAD',
    fontWeight: 'bold',
    marginRight: 4,
  },
  starIcon: {
    marginTop: 1,
  },
  secondRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceRange: {
    fontSize: 14,
    color: '#6A0DAD',
    fontWeight: 'bold',
  },
  dot: {
    marginHorizontal: 6,
    fontSize: 14,
    color: '#888',
  },
  shortDesc: {
    fontSize: 14,
    color: '#666',
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
  },
  addressText: {
    fontSize: 13,
    color: '#999',
  },
});
