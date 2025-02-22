import React, { useEffect, useState } from 'react';

function ActivitiesList() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch('https://project-api-sustainable-waste.onrender.com/')
      .then((res) => res.json())
      .then((data) => setActivities(data));
  }, []);

  return (
    <div>
      <h2>Activities List</h2>
      <ul>
        {activities.map((activity) => (
          <li key={activity._id}>{activity.title} - {activity.category}</li>
        ))}
      </ul>
    </div>
  );
}

export default ActivitiesList;
