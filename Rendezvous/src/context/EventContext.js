import React, { createContext, useContext, useState, useCallback } from 'react';
import { AuthContext } from './AuthContext';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const { userToken } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    if (!userToken) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:9090/api/events', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  const deleteEvent = useCallback(async (eventId) => {
    if (!userToken) return;
    try {
        const response = await fetch(`https://project-api-sustainable-waste.onrender.com/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
        },
        });
        if (!response.ok) {
        throw new Error('Failed to delete event');
        }
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
    } catch (err) {
        console.error('Error deleting event:', err);
        setError(err.message);
    }
    }, [userToken]);


  const updateEventStatus = useCallback(
    async (eventId, newStatus) => {
      if (!userToken) return;

      try {
        const response = await fetch('http://localhost:9090/api/events/status', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
          },
          body: JSON.stringify({ eventId, status: newStatus }),
        });

        if (!response.ok) {
          throw new Error('Failed to update status');
        }

        const { event: updatedEvent } = await response.json();

        setEvents((prevEvents) =>
          prevEvents.map((event) => (event._id === eventId ? updatedEvent : event))
        );
      } catch (error) {
        console.error('Error updating status:', error);
        setError(error.message);
      }
    },
    [userToken]
  );

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        error,
        fetchEvents,
        updateEventStatus,
        deleteEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
