import React, { useContext, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import styles from './HomeStyle';
import { EventContext } from '../../context/EventContext';

const HomeScreen = ({ navigation }) => {
  const { events, loading, error, fetchEvents, updateEventStatus, deleteEvent } = useContext(EventContext);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [fetchEvents])
  );

  const onRefresh = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

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
        return '#4CAF50';
      case 'Pending':
        return '#FFC107';
      case 'Canceled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getAttendeeResponsesSummary = (event) => {
    if (!event.attendeeResponses || event.attendeeResponses.length === 0) {
      return "No responses yet";
    }
    const accepted = event.attendeeResponses.filter(r => r.response === 'Accepted').length;
    const declined = event.attendeeResponses.filter(r => r.response === 'Declined').length;
    const pending = event.attendees.length - accepted - declined;
    return `${accepted} accepted, ${declined} declined, ${pending} pending`;
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#6A0DAD" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.noDateContainer]}>
        <Text style={styles.noDateText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  if (!events.length) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {/* Header remains at the top */}
        <View style={styles.headerContainer}>
          <Text style={styles.pageTitle}>Your Events</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Ionicons name="refresh" size={24} color="#6A0DAD" />
          </TouchableOpacity>
        </View>

        <View style={styles.noDateContainer}>
          <Ionicons name="calendar-outline" size={80} color="#ccc" style={{ marginBottom: 20 }} />
          <Text style={styles.noDateText}>You have no events yet.</Text>
          <TouchableOpacity
            style={styles.findEventButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Text style={styles.findEventButtonText}>Find an Event</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }



  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>Your Events</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="#6A0DAD" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} colors={['#6A0DAD']} />
        }
      >
        {events.map((event) => (
          <View key={event._id} style={styles.dateCard}>

            <View style={styles.cardHeader}>
              <Text style={styles.restaurantNameModified}>
                {event.restaurant?.name || "Unknown Restaurant"}
              </Text>
              <View style={[styles.statusTag, { backgroundColor: getStatusColor(event.status) }]}>
                <Text style={styles.statusText}>{event.status}</Text>
              </View>
            </View>


            <Image
              source={{ uri: event.restaurant?.imageUrl || 'https://via.placeholder.com/400x200' }}
              style={styles.dateImage}
            />
            <View style={styles.dateWithRow}>
              <Text style={styles.withLabel}>With: </Text>
              <View style={styles.attendeesList}>
                <Text style={styles.dateWithName}>
                  {event.dateWith?.name || "Unknown"}
                </Text>
                {event.attendees && event.attendees.length > 1 && (
                  <>
                    <Text style={styles.additionalAttendeesLabel}>
                      {" "}and {event.attendees.length - 1} other{event.attendees.length > 2 ? 's' : ''}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        const attendeeNames = event.attendees
                          .map(a => a.name || a.email || "Unknown")
                          .join("\n• ");
                        Alert.alert("All Attendees", `• ${attendeeNames}`, [{ text: "OK" }]);
                      }}
                    >
                      <Text style={styles.viewAllLink}> (view all)</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>

            <View style={styles.ratingContainerModified}>
              {[...Array(5)].map((_, index) => (
                <Ionicons
                  key={index}
                  name={index < Math.floor(event.restaurant?.rating) ? "star" : "star-outline"}
                  size={16}
                  color="#6A0DAD"
                />
              ))}
            </View>


            {event.restaurant?.address && (
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={16} color="#6A0DAD" style={styles.locationIcon} />
                <Text style={styles.addressText}>{event.restaurant.address}</Text>
              </View>
            )}

            <View style={styles.dateTimeRow}>
              <Ionicons name="calendar-outline" size={18} color="#333" />
              <Text style={styles.dateTimeText}>{formatDateTime(event.date)}</Text>
            </View>

            <View style={styles.responseRow}>
              <Text style={styles.responseLabel}>Responses:</Text>
              <Text style={styles.responseText}>{getAttendeeResponsesSummary(event)}</Text>
            </View>

            <View style={styles.buttonRow}>
              {event.status === 'Pending' && (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                    onPress={() => updateEventStatus(event._id, 'Confirmed')}
                  >
                    <Text style={styles.actionButtonText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#F44336' }]}
                    onPress={() => updateEventStatus(event._id, 'Canceled')}
                  >
                    <Text style={styles.actionButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#9E9E9E' }]}
                    onPress={() => deleteEvent(event._id)}
                  >
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                </>
              )}
              {event.status === 'Confirmed' && (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#F44336' }]}
                    onPress={() => updateEventStatus(event._id, 'Canceled')}
                  >
                    <Text style={styles.actionButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#9E9E9E' }]}
                    onPress={() => deleteEvent(event._id)}
                  >
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                </>
              )}
              {event.status === 'Canceled' && (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                    onPress={() => updateEventStatus(event._id, 'Confirmed')}
                  >
                    <Text style={styles.actionButtonText}>Reconfirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#9E9E9E' }]}
                    onPress={() => deleteEvent(event._id)}
                  >
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
