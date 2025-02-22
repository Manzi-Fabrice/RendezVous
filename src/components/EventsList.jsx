import React, { useEffect, useState } from 'react';
import SaveEventButton from './SaveEventButton';
import useUserStore from '../store/userStore';

function EventsList() {
  const [events, setEvents] = useState([]);
  const { users } = useUserStore();

  const userId = users.length > 0 ? users[0]._id : null;

  useEffect(() => {
    fetch('https://project-api-sustainable-waste.onrender.com/')
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  return (
    <div>
      <h2>Events List</h2>

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
        <p>Loading users... Make sure you have users in your database!</p>
      )}
    </div>
  );
}

export default EventsList;
