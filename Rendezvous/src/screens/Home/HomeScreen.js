import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
  const [upcomingDate, setUpcomingDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingDate();
  }, []);

  const fetchUpcomingDate = async () => {
    try {
      const response = await fetch('http://localhost:9090/api/events/upcoming');
      const data = await response.json();
      // Get the first upcoming date
      setUpcomingDate(data[0] || null);
    } catch (error) {
      console.error('Error fetching upcoming date:', error);
      Alert.alert('Error', 'Failed to load upcoming date');
    } finally {
      setLoading(false);
    }
  };

  const updateDateStatus = async (newStatus) => {
    try {
      const response = await fetch('http://localhost:9090/api/events/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: upcomingDate._id,
          status: newStatus
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      setUpcomingDate(data.event);
      Alert.alert('Success', `Date ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update date status');
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return '#4CAF50'; // Green
      case 'Pending':
        return '#FFC107'; // Yellow
      case 'Canceled':
        return '#F44336'; // Red
      default:
        return '#757575'; // Grey
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#6A0DAD" />
      </SafeAreaView>
    );
  }

  if (!upcomingDate) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.noDateContainer]}>
        <Ionicons name="calendar-outline" size={48} color="#666" />
        <Text style={styles.noDateText}>No upcoming dates</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Your upcoming date with</Text>
          <Text style={styles.headerName}>{upcomingDate.dateWith.name}</Text>
          <View style={[styles.statusTag, { backgroundColor: getStatusColor(upcomingDate.status) }]}>
            <Text style={styles.statusText}>{upcomingDate.status}</Text>
          </View>
        </View>

        <Image 
          source={{ uri: upcomingDate.restaurant.imageUrl || 'https://via.placeholder.com/400x200' }} 
          style={styles.mainImage} 
        />

        <View style={styles.restaurantContainer}>
          <Text style={styles.restaurantName}>{upcomingDate.restaurant.name}</Text>
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, index) => (
              <Ionicons
                key={index}
                name={index < Math.floor(upcomingDate.restaurant.rating) ? "star" : "star-outline"}
                size={16}
                color="#FFD700"
              />
            ))}
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={22} color="#333" style={styles.detailIcon} />
            <Text style={styles.detailText}>{upcomingDate.restaurant.address}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="walk" size={22} color="#333" style={styles.detailIcon} />
            <Text style={styles.detailText}>{upcomingDate.travelTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={22} color="#333" style={styles.detailIcon} />
            <Text style={styles.detailText}>{formatDateTime(upcomingDate.date)}</Text>
          </View>
          {upcomingDate.preferences && (
            <View style={styles.preferencesContainer}>
              <Text style={styles.preferencesTitle}>Preferences:</Text>
              <Text style={styles.preferenceText}>Budget: {upcomingDate.preferences.budget}</Text>
              <Text style={styles.preferenceText}>Cuisine: {upcomingDate.preferences.cuisine}</Text>
              {upcomingDate.preferences.dietaryRestrictions?.length > 0 && (
                <Text style={styles.preferenceText}>
                  Dietary: {upcomingDate.preferences.dietaryRestrictions.join(', ')}
                </Text>
              )}
            </View>
          )}
        </View>

        {upcomingDate.status === 'Pending' && (
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={() => updateDateStatus('Canceled')}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Reject Date</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.acceptButton]}
              onPress={() => updateDateStatus('Confirmed')}
            >
              <Text style={[styles.buttonText, styles.acceptButtonText]}>Accept Date</Text>
            </TouchableOpacity>
          </View>
        )}

        {upcomingDate.status === 'Confirmed' && (
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={() => updateDateStatus('Canceled')}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel Date</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDateText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
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
    marginTop: 8,
    marginBottom: 8
  },
  statusTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
  preferencesContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  preferencesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  preferenceText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
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
    borderColor: '#F44336'
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: '#F44336'
  },
  acceptButtonText: {
    color: '#fff'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600'
  }
});
