import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import styles from './EventDetailesStyles';

export default function EventDetailsScreen() {
  const route = useRoute();
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

  const hasResponded = event?.attendeeResponses?.some(
    response => String(response.attendeeId) === String(attendeeId)
  );

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
