import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './RecommendedStyle';


export default function RecommendedDetails({ route }) {
  const navigation = useNavigation();
  const { restaurant } = route.params;

  const renderPhoto = ({ item }) => (
    <Image source={{ uri: item.url }} style={styles.carouselImage} />
  );

  const phoneNumber = restaurant.phone ? restaurant.phone : 'N/A';

  const isOpenText = restaurant.isOpenNow !== undefined
    ? restaurant.isOpenNow
      ? 'Open Now'
      : 'Closed'
    : 'N/A';

  const parkingText = restaurant.parkingAvailable
    ? 'Parking Available'
    : 'No Parking';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topHeader}>
        <Text style={styles.restaurantTitle}>{restaurant.name}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {restaurant.photos && restaurant.photos.length > 0 ? (
          <FlatList
            data={restaurant.photos}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderPhoto}
            style={styles.carousel}
          />
        ) : (
          <View style={[styles.carouselImage, styles.placeholder]}>
            <Text style={styles.noImageText}>No Images</Text>
          </View>
        )}
        <View style={styles.infoCard}>
          <View style={styles.line}>
            <Text style={styles.lineText}>Ratings: {restaurant.rating} </Text>
            <Ionicons name="star" size={20} color="#FFD700" style={styles.iconStyle} />
            <Text style={[styles.lineText, styles.reviewText]}>
              ({restaurant.reviewCount} reviews)
            </Text>
          </View>

          <View style={styles.line}>
            <Text style={styles.lineText}>Price: {restaurant.priceRange || 'N/A'}</Text>
          </View>

          <View style={styles.line}>
            <Ionicons name="location-outline" size={20} color="#666" style={styles.iconStyle} />
            <Text style={styles.lineText}>{restaurant.address}</Text>
          </View>

          <View style={styles.line}>
            {restaurant.isOpenNow ? (
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#28a745"
                style={styles.iconStyle}
              />
            ) : (
              <Ionicons
                name="close-circle-outline"
                size={20}
                color="#dc3545"
                style={styles.iconStyle}
              />
            )}
            <Text style={styles.lineText}>{isOpenText}</Text>
          </View>

          <View style={styles.line}>
            <Ionicons name="car-outline" size={20} color="#666" style={styles.iconStyle} />
            <Text style={styles.lineText}>{parkingText}</Text>
          </View>

          <View style={styles.line}>
            <Ionicons name="call-outline" size={20} color="#666" style={styles.iconStyle} />
            {restaurant.phone ? (
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${restaurant.phone}`)}>
                <Text style={[styles.lineText, styles.linkText]}>{phoneNumber}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.lineText}>{phoneNumber}</Text>
            )}
          </View>

          {restaurant.website && (
            <View style={styles.line}>
              <Ionicons name="globe-outline" size={20} color="#666" style={styles.iconStyle} />
              <TouchableOpacity onPress={() => Linking.openURL(restaurant.website)}>
                <Text style={[styles.lineText, styles.linkText]}>Website</Text>
              </TouchableOpacity>
            </View>
          )}

          {restaurant.features && restaurant.features.length > 0 && (
            (() => {
              const filteredFeatures = restaurant.features.filter(
                (feature) => !feature.toLowerCase().startsWith('price:')
              );
              if (filteredFeatures.length === 0) return null;
              return (
                <View style={styles.featuresContainer}>
                  {filteredFeatures.map((feature, index) => (
                    <View key={index} style={styles.featureChip}>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              );
            })()
          )}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.buttonText, styles.cancelButtonText]}>Go Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => navigation.navigate('DateScreen', { restaurant })}
          >
            <Text style={[styles.buttonText, styles.editButtonText]}>Add Date</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
