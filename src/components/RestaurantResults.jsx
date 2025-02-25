import React, { useEffect, useState } from 'react';

function RestaurantResults() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('restaurantResults'));
    if (data && data.restaurants) {
      setResults(data.restaurants.results || []);
    }
  }, []);

  return (
    <div className="page-container">
      <h2>Restaurant Recommendations</h2>
      <div className="restaurant-grid">
        {results.length > 0 ? (
          results.map((restaurant) => (
            <div className="restaurant-card" key={restaurant.name}>
              <h3>{restaurant.name}</h3>
              <p><strong>Rating:</strong> {restaurant.rating}/5 ({restaurant.reviewCount} reviews)</p>
              <p><strong>Price:</strong> {restaurant.priceRange || 'Not specified'}</p>
              <p><strong>Cuisine:</strong> {restaurant.cuisineTypes?.join(', ') || 'Not specified'}</p>
              <p><strong>Address:</strong> {restaurant.address}</p>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default RestaurantResults;
