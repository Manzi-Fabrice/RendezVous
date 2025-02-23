// src/components/RestuarantFinder.jsx
import React, { useState } from 'react';
import api from '../store/api';

function RestuarantFinder() {
  const [preferences, setPreferences] = useState({
    cuisineTypes: [],
    vibePreferences: [],
    occasion: '',
    dietaryRestrictions: [],
    location: {
      lat: 40.7128,
      lng: -74.0060,
    },
  });

  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const options = {
    cuisineTypes: ['Italian', 'Japanese', 'Chinese', 'Thai', 'Mexican'],
    vibePreferences: ['Casual', 'Fine Dining', 'Fast Food', 'Cafe', 'Pub'],
    occasions: ['Date Night', 'Family Dinner', 'Business Lunch', 'Casual Dining'],
    dietaryRestrictions: ['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free'],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await api.getRecommendations(preferences);
      setResults(data);
    } catch (err) {
      setError(`Failed to fetch recommendations: ${err.message}`);
    }
  };

  const handleMultiSelect = (e, field) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value);
    setPreferences({ ...preferences, [field]: values });
    console.log('Updated preferences:', { ...preferences, [field]: values }); // Debug log
  };

  return (
    <div>
      <h2>Find Restaurants</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <select multiple onChange={(e) => handleMultiSelect(e, 'cuisineTypes')}>
            {options.cuisineTypes.map((cuisine) => (
              <option key={cuisine} value={cuisine.toLowerCase()}>{cuisine}</option>
            ))}
          </select>
        </div>

        <div>
          <select multiple onChange={(e) => handleMultiSelect(e, 'vibePreferences')}>
            {options.vibePreferences.map((vibe) => (
              <option key={vibe} value={vibe.toLowerCase()}>{vibe}</option>
            ))}
          </select>
        </div>

        <div>
          <select onChange={(e) => setPreferences({ ...preferences, occasion: e.target.value })}>
            <option value="">Select Occasion</option>
            {options.occasions.map((occasion) => (
              <option key={occasion} value={occasion.toLowerCase()}>{occasion}</option>
            ))}
          </select>
        </div>

        <div>
          <select multiple onChange={(e) => handleMultiSelect(e, 'dietaryRestrictions')}>
            {options.dietaryRestrictions.map((diet) => (
              <option key={diet} value={diet.toLowerCase()}>{diet}</option>
            ))}
          </select>
        </div>

        <div>
          <button type="submit">Find Restaurants</button>
        </div>
      </form>

      {error && <p>{error}</p>}

      {results && (
        <div>
          <h3>Found {results.restaurants?.count || 0} restaurants</h3>
          {results.restaurants?.results.map((restaurant) => (
            <div key={restaurant.name}>
              <h4>{restaurant.name}</h4>
              <p>Rating: {restaurant.rating}/5 ({restaurant.reviewCount} reviews)</p>
              <p>Price: {restaurant.priceRange}</p>
              <p>Cuisine: {restaurant.cuisineTypes.join(', ') || 'Not specified'}</p>
              <p>Address: {restaurant.address}</p>
              {restaurant.matchDetails && (
                <p>Match Details: {restaurant.matchDetails.join(', ')}</p>
              )}
            </div>
          ))}

          {results.aiRecommendations && !results.aiRecommendations.error && (
            <div>
              <h3>AI Suggestions</h3>
              <div>
                <h4>Top Picks:</h4>
                {results.aiRecommendations.topPicks.map((pick) => (
                  <p key={`pick-${pick.substring(0, 20)}`}>{pick}</p>
                ))}
              </div>
              <div>
                <h4>Why These Match:</h4>
                {results.aiRecommendations.explanations.map((exp) => (
                  <p key={`explanation-${exp.substring(0, 20)}`}>{exp}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RestuarantFinder;
