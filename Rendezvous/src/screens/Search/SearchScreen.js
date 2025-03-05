import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const navigation = useNavigation();

  // Hard-coded location
  const userLocation = { lat: 40.7128, lng: -74.0060 };
  const LOCAL_BACKEND_URL = 'http://localhost:9090';
const fetchRestaurants = async () => {
  try {
    const response = await fetch(
      `${LOCAL_BACKEND_URL}/api/recommendations/test/places`,
      //'https://project-api-sustainable-waste.onrender.com/api/recommendations/test/places',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: userLocation,
          restaurantName: searchText.trim() || '' // Send empty string if no input
        })
      }
    );
    const data = await response.json();
    setRestaurants(data.results || []);
    console.log('Restaurants from server:', data);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
  }
};


  const renderRestaurant = ({ item }) => {
    const photoUrl = item.photos && item.photos[0] ? item.photos[0].url : null;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('RecommendedDetails', { restaurant: item })
        }
      >
        {photoUrl && <Image source={{ uri: photoUrl }} style={styles.cardImage} />}
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>
            {item.priceRange} • {item.rating}⭐
          </Text>
          <Text style={styles.cardSubtitle}>{item.address}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <Button title="Search" onPress={fetchRestaurants} />

      <FlatList
        data={restaurants}
        keyExtractor={(item, index) => item.name + index}
        renderItem={renderRestaurant}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(106, 13, 173, 0.6)'
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333'
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  cardImage: {
    width: '100%',
    height: 150
  },
  cardInfo: {
    padding: 10
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666'
  }
});
