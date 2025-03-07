import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const InvitationPage = () => {
  const query = useQuery();
  const eventId = query.get('eventId');
  const autoResponse = query.get('response');

  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [hasResponded, setHasResponded] = useState(false);
  const [selectedAttendeeId, setSelectedAttendeeId] = useState(null);

  useEffect(() => {
    if (!eventId) {
      setError('No invitation ID provided.');
      setLoading(false);
      return;
    }

    console.log('Fetching event details for ID:', eventId);
    fetch(`https://project-api-sustainable-waste.onrender.com/api/events/${eventId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    })
      .then((res) => {
        console.log('Event fetch status:', res.status);
        if (!res.ok) {
          throw new Error(`Failed to fetch invitation details. Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Event data received:', data);
        if (data.attendees) {
          console.log('Available attendees:', data.attendees.map(a => ({
            id: a._id || a.id,
            name: a.name,
            email: a.email,
            fullObject: a // Log the full attendee object
          })));
        }
        setInvitation(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching event:', err);
        setError(`Error: ${err.message}`);
        setLoading(false);
      });
  }, [eventId]);

  const handleResponse = useCallback(
    (response) => {
      if (hasResponded || !selectedAttendeeId) return;
      setHasResponded(true);

      console.log('Selected attendee ID:', selectedAttendeeId);
      console.log('Available attendees:', invitation?.attendees);

      const selectedAttendee = invitation?.attendees?.find(
        a => String(a._id) === String(selectedAttendeeId) || String(a.id) === String(selectedAttendeeId)
      );

      console.log('Found selected attendee:', selectedAttendee);

      if (!selectedAttendee) {
        console.error('Selected attendee not found in event data');
        setResponseMessage('Error: Selected attendee not found');
        return;
      }

      const requestBody = {
        eventId,
        attendeeId: selectedAttendee._id || selectedAttendee.id,
        response: response === 'accept' ? 'accept' : 'decline',
      };

      console.log('Sending request with data:', requestBody);

      fetch(`https://project-api-sustainable-waste.onrender.com/api/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(requestBody),
      })
        .then(async (res) => {
          console.log('Response status:', res.status);
          if (!res.ok) {
            const errorData = await res.json();
            console.error('Error response:', errorData);
            throw new Error(errorData.error || `Server responded with status: ${res.status}`);
          }
          const text = await res.text();
          console.log('Raw response:', text);
          try {
            return JSON.parse(text);
          } catch (e) {
            console.error('Failed to parse response as JSON:', e);
            throw new Error('Invalid JSON response from server');
          }
        })
        .then((data) => {
          console.log('Parsed response data:', data);
          if (data.success) {
            setResponseMessage(data.message || 'Your response has been recorded. Thank you!');
            if (data.eventStatus) {
              setInvitation(prev => ({
                ...prev,
                status: data.eventStatus
              }));
            }
          } else {
            setResponseMessage(`Error: ${data.error || data.message || 'There was an error processing your response.'}`);
          }
        })
        .catch((error) => {
          console.error('Detailed error:', error);
          setResponseMessage(`Error: ${error.message || 'There was an error processing your response.'}`);
        });
    },
    [eventId, hasResponded, selectedAttendeeId, invitation]
  );

  useEffect(() => {
    if (autoResponse && !hasResponded) {
      if (autoResponse === 'accepted' || autoResponse === 'rejected') {
        handleResponse(autoResponse);
      }
    }
  }, [autoResponse, hasResponded, handleResponse]);

  if (loading) return <div className="loading">Loading invitation details...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!invitation) return null;

  const { restaurant, attendees } = invitation;

  return (
    <div className="invitation-container">
      <div className="invitation-header">
        <h1 className="invitation-title">{restaurant.name}</h1>
      </div>

      <div className="invitation-content">
        <div className="image-container">
          {restaurant.imageUrl ? (
            <img src={restaurant.imageUrl} alt="Restaurant" className="image" />
          ) : (
            <div className="placeholder">No Images</div>
          )}
        </div>

        <div className="details">
          <p className="detail-item">
            <strong>Rating:</strong> {restaurant.rating} ({restaurant.reviewCount} reviews)
          </p>
          <p className="detail-item">
            <strong>Price:</strong> {restaurant.priceRange || 'N/A'}
          </p>
          <p className="detail-item">
            <strong>Address:</strong> {restaurant.address}
          </p>
          <p className="detail-item">
            <strong>Status:</strong> {restaurant.isOpenNow ? 'Open Now' : 'Closed'}
          </p>
          <p className="detail-item">
            <strong>Parking:</strong> {restaurant.parkingAvailable ? 'Available' : 'Not Available'}
          </p>
          {restaurant.phone && (
            <p className="detail-item">
              <strong>Phone:</strong>{' '}
              <a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a>
            </p>
          )}
          {restaurant.website && (
            <p className="detail-item">
              <strong>Website:</strong>{' '}
              <a href={restaurant.website} target="_blank" rel="noopener noreferrer">
                {restaurant.website}
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="attendee-selection">
        <label htmlFor="attendee-select">Who are you?</label>
        <select
          id="attendee-select"
          value={selectedAttendeeId || ''}
          onChange={(e) => setSelectedAttendeeId(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Select your name</option>
          {attendees?.map((attendee) => (
            <option key={attendee.id} value={attendee.id}>
              {attendee.name}
            </option>
          ))}
        </select>
      </div>

      <div className="invitation-buttons">
        <button
          className="button accept-button"
          onClick={() => handleResponse('accept')}
          disabled={!selectedAttendeeId || hasResponded}
        >
          Accept
        </button>
        <button
          className="button reject-button"
          onClick={() => handleResponse('decline')}
          disabled={!selectedAttendeeId || hasResponded}
        >
          Decline
        </button>
      </div>

      {responseMessage && <p className="response-message">{responseMessage}</p>}
    </div>
  );
};

export default InvitationPage;