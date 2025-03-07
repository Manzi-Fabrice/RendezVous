import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!eventId) {
      setError('No invitation ID provided.');
      setLoading(false);
      return;
    }

    fetch(`https://project-api-sustainable-waste.onrender.com/api/events/${eventId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch invitation details.');
        }
        return res.json();
      })
      .then((data) => {
        setInvitation(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [eventId]);

  useEffect(() => {
    if (autoResponse && !hasResponded) {
      if (autoResponse === 'accepted' || autoResponse === 'rejected') {
        handleResponse(autoResponse);
      }
    }
    // eslint-disable-next-line
  }, [autoResponse]);

  const handleResponse = (response) => {

    if (hasResponded) return;
    setHasResponded(true);

    fetch(`http://localhost:9090/api/invitations/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
        response,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setResponseMessage('Your response has been recorded. Thank you!');
        } else {
          setResponseMessage('There was an error processing your response.');
        }
      })
      .catch((err) => {
        setResponseMessage('There was an error processing your response.');
      });
  };

  if (loading) return <div>Loading invitation details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!invitation) return null;

  const { restaurant } = invitation;

  return (
    <div className="container">
      <h1 className="title">{restaurant.name}</h1>
      <div className="image-container">
        {restaurant.photos && restaurant.photos[0]?.url ? (
          <img
            src={restaurant.photos[0].url}
            alt="Restaurant"
            className="image"
          />
        ) : (
          <div className="placeholder">No Images</div>
        )}
      </div>
      <div className="details">
        <p>Rating: {restaurant.rating} ({restaurant.reviewCount} reviews)</p>
        <p>Price: {restaurant.priceRange || 'N/A'}</p>
        <p>Address: {restaurant.address}</p>
        <p>Status: {restaurant.isOpenNow ? 'Open Now' : 'Closed'}</p>
        <p>Parking: {restaurant.parkingAvailable ? 'Available' : 'Not Available'}</p>
        {restaurant.phone && (
          <p>
            Phone: <a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a>
          </p>
        )}
        {restaurant.website && (
          <p>
            Website:{' '}
            <a href={restaurant.website} target="_blank" rel="noopener noreferrer">
              {restaurant.website}
            </a>
          </p>
        )}
      </div>
      <div className="button-row">
        <button className="button" onClick={() => handleResponse('accepted')}>
          Accept
        </button>
        <button className="button reject" onClick={() => handleResponse('rejected')}>
          Reject
        </button>
      </div>
      {responseMessage && <p className="response-message">{responseMessage}</p>}
    </div>
  );
};

export default InvitationPage;
