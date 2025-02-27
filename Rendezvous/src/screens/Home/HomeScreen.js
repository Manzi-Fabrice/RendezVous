import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// we will pass props from the server after the date is confirmed
const UpcomingDateScreen = ({
  userName = 'John Doe',
  restaurantName = 'Cafe Noir',
  address = '6700 Brooklyn Ave, NY 10005',
  travelTime = '25 minutes away',
  dateTime = 'Tuesday, March 16, 6:00 pm',
  imageUrl = 'https://builddesigncenter.com/wp-content/uploads/2024/03/top-restaurants-in-leesburg.jpg'
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Your upcoming date with</Text>
          <Text style={styles.headerName}>{userName}</Text>
        </View>

        <Image source={{ uri: imageUrl }} style={styles.mainImage} />

        <View style={styles.restaurantContainer}>
          <Text style={styles.restaurantName}>{restaurantName}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Ionicons name="star" size={16} color="#FFD700" />
            <Ionicons name="star" size={16} color="#FFD700" />
            <Ionicons name="star" size={16} color="#FFD700" />
            <Ionicons name="star-outline" size={16} color="#FFD700" />
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={22} color="#333" style={styles.detailIcon} />
            <Text style={styles.detailText}>{address}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="walk" size={22} color="#333" style={styles.detailIcon} />
            <Text style={styles.detailText}>{travelTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={22} color="#333" style={styles.detailIcon} />
            <Text style={styles.detailText}>{dateTime}</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]}>
            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel Date</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.editButton]}>
            <Text style={[styles.buttonText, styles.editButtonText]}>Edit Date</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpcomingDateScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  headerContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 20
  },
  headerTitle: {
    fontSize: 16,
    color: '#555',
    fontWeight: '400'
  },
  headerName: {
    fontSize: 22,
    color: '#000',
    fontWeight: '700',
    marginTop: 8
  },
  mainImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover'
  },
  restaurantContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 10
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6
  },
  ratingContainer: {
    flexDirection: 'row'
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6
  },
  detailIcon: {
    marginRight: 8
  },
  detailText: {
    fontSize: 14,
    color: '#333'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 20
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
