import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;

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
            <Text>No Images</Text>
          </View>
        )}
        <View style={styles.infoCard}>
          <View style={styles.line}>
            <Text>Ratings: {restaurant.rating} </Text>
            <Ionicons name="star" size={18} color="#FFD700" style={styles.iconStyle} />
            <Text style={styles.lineText}>
              ({restaurant.reviewCount} reviews)
            </Text>
          </View>

          <View style={styles.line}>
            <Text> Price: {restaurant.priceRange || 'N/A'} </Text>
          </View>

          <View style={styles.line}>
            <Ionicons name="location-outline" size={18} color="#666" style={styles.iconStyle} />
            <Text style={styles.lineText}>{restaurant.address}</Text>
          </View>

          <View style={styles.line}>
            {restaurant.isOpenNow ? (
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#28a745"
                style={styles.iconStyle}
              />
            ) : (
              <Ionicons
                name="close-circle-outline"
                size={18}
                color="#dc3545"
                style={styles.iconStyle}
              />
            )}
            <Text style={styles.lineText}>{isOpenText}</Text>
          </View>

          <View style={styles.line}>
            <Ionicons name="car-outline" size={18} color="#666" style={styles.iconStyle} />
            <Text style={styles.lineText}>{parkingText}</Text>
          </View>

          <View style={styles.line}>
            <Ionicons name="call-outline" size={18} color="#666" style={styles.iconStyle} />
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
              <Ionicons name="globe-outline" size={18} color="#666" style={styles.iconStyle} />
              <TouchableOpacity onPress={() => Linking.openURL(restaurant.website)}>
                <Text style={[styles.lineText, styles.linkText]}>Website</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* filter out price since we already ahve it */}
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
            onPress={() => navigation.navigate('DateScreen')}
          >
            <Text style={[styles.buttonText, styles.editButtonText]}>Add Date</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff'
  },
  backButton: {
    marginRight: 8
  },
  restaurantTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333'
  },
  carousel: {
    marginBottom: 12
  },
  carouselImage: {
    width: screenWidth,
    height: 220,
    resizeMode: 'cover'
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc'
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  iconStyle: {
    marginRight: 8
  },
  lineText: {
    fontSize: 15,
    color: '#333'
  },
  linkText: {
    color: '#1e90ff'
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4
  },
  featureChip: {
    backgroundColor: '#E6D6F2',
    borderWidth: 1,
    borderColor: 'rgba(106, 13, 173, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#6A0DAD'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 30
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#999'
  },
  cancelButtonText: {
    color: '#333'
  },
  editButton: {
    backgroundColor: '#bfa355'
  },
  editButtonText: {
    color: '#fff'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600'
  }
});
