// src/screens/RecommendedList/RecommendedListScreen.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function RecommendedListScreen({ route }) {
  const navigation = useNavigation();
  const { recommendations } = route.params;
  
  // Extract the array of restaurant objects
  const rawRestaurants = recommendations.restaurants?.results || [];
  
  // Sort restaurants: highest-rated first, then by distance (ascending)
  const sortedRestaurants = [...rawRestaurants].sort((a, b) => {
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    // Ensure that if a.distance.value or b.distance.value is undefined, treat it as a very high number.
    const aDistance = a.distance?.value ?? Number.MAX_VALUE;
    const bDistance = b.distance?.value ?? Number.MAX_VALUE;
    return aDistance - bDistance;
  });
  
  const [restaurants] = useState(sortedRestaurants);

  // Render a card for each restaurant.
  const renderRestaurant = ({ item }) => {
    const photoUrl = item.photos?.[0]?.url || null;
    const ratingText = item.rating ? `${item.rating.toFixed(1)}/5` : 'N/A';
    const priceRange = item.priceRange || '$$';
    // Display just the numeric distance value (e.g., "8.80 km away")
    const distanceVal = item.distance?.value != null ? item.distance.value.toFixed(2) : null;
    const distanceText = distanceVal ? `• ${distanceVal} km away` : '';
    const shortDescription = item.features
      ? item.features.join(', ')
      : 'Delicious cuisine';

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
            <Text style={styles.shortDesc}>{shortDescription}</Text>
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
      <Text style={styles.header}>Recommended Restaurants</Text>
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
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6A0DAD',
    marginVertical: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  // CARD STYLES
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#6A0DAD', // Thin purple border
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
