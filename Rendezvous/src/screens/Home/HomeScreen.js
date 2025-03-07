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
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const [upcomingDates, setUpcomingDates] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Use both useEffect and useFocusEffect to handle refresh
  useEffect(() => {
    if (route?.params?.refresh) {
      console.log('Refreshing due to route params');
      fetchUpcomingDates();
    }
  }, [route?.params?.refresh]);

  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen focused, fetching dates');
      fetchUpcomingDates();
    }, [])
  );

  const fetchUpcomingDates = async () => {
    try {
      console.log('Fetching upcoming dates...');
      setLoading(true); // Set loading to true when starting fetch
      
      const response = await fetch('http://localhost:9090/api/events/upcoming', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch upcoming dates');
      }
      
      const data = await response.json();
      console.log('Upcoming dates response length:', data.length);
      
      // Check if we have any data
      if (data.length > 0) {
        console.log('First event date:', data[0].date);
        console.log('First event title:', data[0].title);
        console.log('First event restaurant:', data[0].restaurant?.name);
        
        if (data.length > 1) {
          console.log('Additional events found:', data.length - 1);
          data.slice(1).forEach((event, index) => {
            console.log(`Event ${index + 2}: ${event.title} at ${event.restaurant?.name} on ${new Date(event.date).toLocaleString()}`);
          });
        }
      }
      
      // Set all upcoming dates
      setUpcomingDates(data);
      // Reset selected index if needed
      if (selectedDateIndex >= data.length) {
        setSelectedDateIndex(0);
      }
      
    } catch (error) {
      console.error('Error fetching upcoming date:', error);
      Alert.alert('Error', 'Failed to load upcoming date');
    } finally {
      setLoading(false);
    }
  };

  const updateDateStatus = async (newStatus) => {
    try {
      if (!upcomingDates[selectedDateIndex]) {
        return;
      }
      
      const response = await fetch('http://localhost:9090/api/events/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: upcomingDates[selectedDateIndex]._id,
          status: newStatus
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      
      // Update the specific date in our array
      const updatedDates = [...upcomingDates];
      updatedDates[selectedDateIndex] = data.event;
      setUpcomingDates(updatedDates);
    
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

  if (!upcomingDates.length) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.noDateContainer]}>
        <Text style={styles.noDateText}>You have no upcoming dates.</Text>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#6A0DAD' }]}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.actionButtonText}>Find a Restaurant</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Get the currently selected date
  const upcomingDate = upcomingDates[selectedDateIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {upcomingDates.length > 1 && (
          <View style={styles.dateSelector}>
            <Text style={styles.dateSelectorText}>Your upcoming dates:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesList}>
              {upcomingDates.map((date, index) => (
                <TouchableOpacity 
                  key={date._id} 
                  style={[
                    styles.dateBubble, 
                    selectedDateIndex === index && styles.selectedDateBubble
                  ]}
                  onPress={() => setSelectedDateIndex(index)}
                >
                  <Text style={[
                    styles.dateBubbleText, 
                    selectedDateIndex === index && styles.selectedDateBubbleText
                  ]}>
                    {date.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

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
            <Text style={styles.detailText}>{upcomingDate.travelTime || '15-20 min walk'}</Text>
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

        <View style={styles.buttonRow}>
          {upcomingDate.status === 'Pending' && (
            <>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                onPress={() => updateDateStatus('Confirmed')}
              >
                <Text style={styles.actionButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#F44336' }]}
                onPress={() => updateDateStatus('Canceled')}
              >
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
          {upcomingDate.status === 'Confirmed' && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#F44336' }]}
              onPress={() => updateDateStatus('Canceled')}
            >
              <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
          {upcomingDate.status === 'Canceled' && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
              onPress={() => updateDateStatus('Confirmed')}
            >
              <Text style={styles.actionButtonText}>Reconfirm</Text>
            </TouchableOpacity>
          )}
        </View>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  noDateText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 20
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
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  dateSelector: {
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  dateSelectorText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333'
  },
  datesList: {
    flexDirection: 'row',
    paddingBottom: 8
  },
  dateBubble: {
    padding: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f9f9f9'
  },
  selectedDateBubble: {
    borderColor: '#6A0DAD',
    backgroundColor: '#f0e6ff',
    borderWidth: 2
  },
  dateBubbleText: {
    fontSize: 14,
    color: '#333'
  },
  selectedDateBubbleText: {
    fontWeight: 'bold',
    color: '#6A0DAD'
  }
});
