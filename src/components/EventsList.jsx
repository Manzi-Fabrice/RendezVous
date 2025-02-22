import React, { useEffect, useState } from 'react';
import SaveEventButton from './SaveEventButton';
import CreateEvent from './createEvents';
import useUserStore from '../store/userStore';

function EventsList() {
  const [events, setEvents] = useState([]);
  const { users } = useUserStore();
  const userId = users.length > 0 ? users[0]._id : null;

  useEffect(() => {
    fetch('https://project-api-sustainable-waste.onrender.com/api/events')
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const handleEventCreated = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  return (
    <div>
      <h2>Events List</h2>
      <CreateEvent onEventCreated={handleEventCreated} />

      {userId ? (
        <ul>
          {events.map((event) => (
            <li key={event._id}>
              {event.title} - {event.date}
              <SaveEventButton userId={userId} eventId={event._id} />
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading users...!</p>
      )}
    </div>
  );
}

export default EventsList;
