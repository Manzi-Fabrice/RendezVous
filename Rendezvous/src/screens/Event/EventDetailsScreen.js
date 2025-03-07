import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function EventDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { eventId, attendeeId } = route.params;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`https://project-api-sustainable-waste.onrender.com/api/events/${eventId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch event details');
      }
      
      const data = await response.json();
      setEvent(data);
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError('Could not load event details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (response) => {
    setResponding(true);
    try {
      // Create a response endpoint that handles invitation responses
      const responseEndpoint = `https://project-api-sustainable-waste.onrender.com/api/respond`;
      const apiResponse = await fetch(responseEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          attendeeId,
          response,
        }),
      });
      
      if (!apiResponse.ok) {
        throw new Error('Failed to submit response');
      }
      
      const result = await apiResponse.json();
      
      // Refresh event details to show updated status
      fetchEventDetails();
      
      Alert.alert(
        'Response Recorded',
        response === 'accept' 
          ? 'You have accepted the invitation!' 
          : 'You have declined the invitation.',
        [{ text: 'OK' }]
      );
    } catch (err) {
      console.error('Error submitting response:', err);
      Alert.alert('Error', 'Failed to submit your response. Please try again.');
    } finally {
      setResponding(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E3C16F" />
        <Text style={styles.loadingText}>Loading event details...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchEventDetails}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Check if the attendee has already responded
  const hasResponded = event?.attendeeResponses?.some(
    response => String(response.attendeeId) === String(attendeeId)
  );

  // Find the attendee's name
  const attendee = event?.attendees?.find(
    a => String(a.id) === String(attendeeId) || String(a._id) === String(attendeeId)
  );
  const attendeeName = attendee?.name || 'Guest';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Event Invitation</Text>
        </View>
        
        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          
          {event.restaurant?.imageUrl && (
            <Image 
              source={{ uri: event.restaurant.imageUrl }} 
              style={styles.restaurantImage}
              resizeMode="cover"
            />
          )}
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date & Time:</Text>
              <Text style={styles.detailText}>{formatDate(event.date)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailText}>{event.location}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Restaurant:</Text>
              <Text style={styles.detailText}>{event.restaurant?.name}</Text>
            </View>
            
            {event.restaurant?.rating && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Rating:</Text>
                <Text style={styles.detailText}>{event.restaurant.rating} ★</Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={[
                styles.statusText, 
                { color: event.status === 'Confirmed' ? '#4CAF50' : 
                         event.status === 'Canceled' ? '#F44336' : '#FFC107' }
              ]}>
                {event.status}
              </Text>
            </View>
            
            {event.attendees && event.attendees.length > 0 && (
              <View style={styles.attendeesSection}>
                <Text style={styles.sectionTitle}>Attendees:</Text>
                {event.attendees.map((person, index) => (
                  <Text key={index} style={styles.attendeeText}>
                    {person.name} {person.email ? `(${person.email})` : ''}
                    {person.id === attendeeId || person._id === attendeeId ? ' (You)' : ''}
                  </Text>
                ))}
              </View>
            )}
          </View>
          
          {!hasResponded && event.status !== 'Canceled' ? (
            <View style={styles.responseButtons}>
              <Text style={styles.responseTitle}>Will you attend this event?</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.responseButton, styles.acceptButton]}
                  onPress={() => handleResponse('accept')}
                  disabled={responding}
                >
                  <Text style={styles.responseButtonText}>Accept</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.responseButton, styles.declineButton]}
                  onPress={() => handleResponse('decline')}
                  disabled={responding}
                >
                  <Text style={styles.responseButtonText}>Decline</Text>
                </TouchableOpacity>
              </View>
              {responding && <ActivityIndicator style={styles.responseLoader} />}
            </View>
          ) : (
            <View style={styles.responseStatus}>
              <Text style={styles.responseStatusText}>
                {hasResponded 
                  ? `You have already responded to this invitation.`
                  : event.status === 'Canceled' 
                    ? 'This event has been canceled.'
                    : 'Response not needed at this time.'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#E3C16F',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  eventCard: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    padding: 15,
    textAlign: 'center',
  },
  restaurantImage: {
    width: '100%',
    height: 200,
  },
  detailsContainer: {
    padding: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    width: 100,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  detailText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  attendeesSection: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  attendeeText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  responseButtons: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  responseButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#F44336',
  },
  responseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  responseLoader: {
    marginTop: 10,
  },
  responseStatus: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  responseStatusText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
}); 