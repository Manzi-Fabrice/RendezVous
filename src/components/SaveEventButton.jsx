import React from 'react';

function SaveEventButton({ userId, eventId }) {
  if (!userId || !eventId) return null;

  const handleSaveEvent = async () => {
    try {
      const response = await fetch('https://your-backend-url.onrender.com/api/users/save-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, eventId }),
      });
      const data = await response.json();
      console.log('Saved Event:', data);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return <button type="button" onClick={handleSaveEvent}>Save Event</button>;
}

export default SaveEventButton;
