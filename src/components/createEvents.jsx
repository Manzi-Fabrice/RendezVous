import React, { useState } from 'react';

function CreateEvent({ onEventCreated }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://project-api-sustainable-waste.onrender.com/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date }),
      });
      const newEvent = await response.json();
      console.log('Created Event:', newEvent);
      setTitle('');
      setDate('');
      if (onEventCreated) onEventCreated(newEvent);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="date"
        placeholder="Event Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button type="submit">Create Event</button>
    </form>
  );
}

export default CreateEvent;
