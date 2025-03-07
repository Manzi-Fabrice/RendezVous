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
  Alert,
  RefreshControl
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const HomeScreen = ({ route, navigation }) => {
  const [upcomingDates, setUpcomingDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Force a complete refresh when the app starts
  useEffect(() => {
    console.log('Initial load - forcing complete refresh');
    fetchUpcomingDates(true);
  }, []);

  // Use both useEffect and useFocusEffect to handle refresh
  useEffect(() => {
    if (route?.params?.refresh) {
      console.log('Refreshing due to route params');
      fetchUpcomingDates(true);
    }
  }, [route?.params?.refresh]);

  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen focused, fetching dates');
      fetchUpcomingDates();
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchUpcomingDates(true).finally(() => setRefreshing(false));
  }, []);

  const fetchUpcomingDates = async (forceRefresh = false) => {
    try {
      console.log('Fetching upcoming dates...', forceRefresh ? '(forced refresh)' : '');
      setLoading(true); // Set loading to true when starting fetch

      const response = await fetch('https://project-api-sustainable-waste.onrender.com/api/events/upcoming', {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'If-None-Match': forceRefresh ? Math.random().toString() : undefined
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch upcoming dates');
      }

      const data = await response.json();
      console.log('Upcoming dates response length:', data.length);

      // More detailed logging of each date's attendees
      if (data.length > 0) {
        data.forEach((date, i) => {
          console.log(`Date ${i+1} - ${date.title}:`);
          console.log('dateWith:', date.dateWith);
          console.log('attendees:', JSON.stringify(date.attendees));
          console.log('numberOfPeople:', date.numberOfPeople);
        });
      }

      // Set all upcoming dates
      setUpcomingDates(data);

    } catch (error) {
      console.error('Error fetching upcoming date:', error);
      Alert.alert('Error', 'Failed to load upcoming date');
    } finally {
      setLoading(false);
    }
  };

  const updateDateStatus = async (eventId, newStatus) => {
    try {
      const response = await fetch('http://localhost:9090/api/events/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: eventId,
          status: newStatus
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();

      // Update the specific date in our array
      const updatedDates = upcomingDates.map(date =>
        date._id === eventId ? data.event : date
      );
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

  // New vertical stacked layout
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>Your Upcoming Dates</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => {
            console.log("Manual refresh requested");
            fetchUpcomingDates(true);
          }}
        >
          <Ionicons name="refresh" size={24} color="#6A0DAD" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6A0DAD']}
          />
        }
      >
        {upcomingDates.map((date) => (
          <View key={date._id} style={styles.dateCard}>
            <View style={styles.dateHeader}>
              <Text style={styles.dateTitle}>{date.title}</Text>
              <View style={[styles.statusTag, { backgroundColor: getStatusColor(date.status) }]}>
                <Text style={styles.statusText}>{date.status}</Text>
              </View>
            </View>

            <View style={styles.dateWithRow}>
              <Text style={styles.withLabel}>With: </Text>
              <View style={styles.attendeesList}>
                <Text style={styles.dateWithName}>
                  {date.dateWith?.name || "Unknown"}
                </Text>

                {date.attendees && date.attendees.length > 1 && (
                  <>
                    <Text style={styles.additionalAttendeesLabel}>
                      {" "}and {date.attendees.length - 1} other{date.attendees.length > 2 ? 's' : ''}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        const attendeeNames = date.attendees.map(a =>
                          a.name || a.email || "Unknown"
                        ).join("\n• ");

                        Alert.alert(
                          "All Attendees",
                          `• ${attendeeNames}`,
                          [{ text: "OK" }]
                        );
                      }}
                    >
                      <Text style={styles.viewAllLink}> (view all)</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>

            <Image
              source={{ uri: date.restaurant.imageUrl || 'https://via.placeholder.com/400x200' }}
              style={styles.dateImage}
            />

            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{date.restaurant.name}</Text>
              <View style={styles.ratingContainer}>
                {[...Array(5)].map((_, index) => (
                  <Ionicons
                    key={index}
                    name={index < Math.floor(date.restaurant.rating) ? "star" : "star-outline"}
                    size={16}
                    color="#FFD700"
                  />
                ))}
              </View>
              <Text style={styles.addressText}>{date.restaurant.address}</Text>
            </View>

            <View style={styles.dateTimeRow}>
              <Ionicons name="calendar-outline" size={18} color="#333" />
              <Text style={styles.dateTimeText}>{formatDateTime(date.date)}</Text>
            </View>

            <View style={styles.buttonRow}>
              {date.status === 'Pending' && (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                    onPress={() => updateDateStatus(date._id, 'Confirmed')}
                  >
                    <Text style={styles.actionButtonText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#F44336' }]}
                    onPress={() => updateDateStatus(date._id, 'Canceled')}
                  >
                    <Text style={styles.actionButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
              {date.status === 'Confirmed' && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#F44336' }]}
                  onPress={() => updateDateStatus(date._id, 'Canceled')}
                >
                  <Text style={styles.actionButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
              {date.status === 'Canceled' && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                  onPress={() => updateDateStatus(date._id, 'Confirmed')}
                >
                  <Text style={styles.actionButtonText}>Reconfirm</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8'
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
    flex: 1
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pageTitle: {
    fontSize: 22,
    color: '#333',
    fontWeight: '700',
    textAlign: 'center'
  },
  dateCard: {
    backgroundColor: '#fff',
    margin: 12,
    marginBottom: 6,
    marginTop: 6,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1
  },
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateWithRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  withLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4
  },
  dateWithName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600'
  },
  dateImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 12
  },
  restaurantInfo: {
    marginBottom: 12
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: '#6A0DAD'
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 4
  },
  addressText: {
    fontSize: 14,
    color: '#666'
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 6
  },
  dateTimeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12
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
  attendeesList: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  additionalAttendeesLabel: {
    fontSize: 14,
    color: '#666',
  },
  viewAllLink: {
    fontSize: 14,
    color: '#6A0DAD',
    fontWeight: '600'
  },
  refreshButton: {
    padding: 8,
  },
});
