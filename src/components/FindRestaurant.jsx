import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../store/api';

function FindRestaurant() {
  const [preferences, setPreferences] = useState({
    cuisineTypes: [],
    vibePreferences: [],
    occasion: '',
    dietaryRestrictions: [],
    location: { lat: 40.7128, lng: -74.006 },
  });

  const navigate = useNavigate();

  const options = {
    cuisineTypes: ['Italian', 'Japanese', 'Chinese', 'Thai', 'Mexican'],
    vibePreferences: ['Casual', 'Fine Dining', 'Fast Food', 'Cafe', 'Pub'],
    occasions: ['Date Night', 'Family Dinner', 'Business Lunch', 'Casual Dining'],
    dietaryRestrictions: ['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free'],
  };

  const handleMultiSelect = (e, field) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value);
    setPreferences((prev) => ({ ...prev, [field]: values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await api.getRecommendations(preferences);
      localStorage.setItem('restaurantResults', JSON.stringify(data));
      navigate('/restaurant-results');
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    }
  };

  return (
    <div className="page-container">
      <h2>Find Restaurants</h2>

      <form onSubmit={handleSubmit}>
        <p>Cuisine Types:</p>
        <select multiple onChange={(e) => handleMultiSelect(e, 'cuisineTypes')}>
          {options.cuisineTypes.map((cuisine) => (
            <option key={cuisine} value={cuisine.toLowerCase()}>
              {cuisine}
            </option>
          ))}
        </select>

        <p>Vibe Preferences:</p>
        <select multiple onChange={(e) => handleMultiSelect(e, 'vibePreferences')}>
          {options.vibePreferences.map((vibe) => (
            <option key={vibe} value={vibe.toLowerCase()}>
              {vibe}
            </option>
          ))}
        </select>

        <p>Occasion:</p>
        <select onChange={(e) => setPreferences({ ...preferences, occasion: e.target.value })}>
          <option value="">Select Occasion</option>
          {options.occasions.map((occasion) => (
            <option key={occasion} value={occasion.toLowerCase()}>
              {occasion}
            </option>
          ))}
        </select>

        <p>Dietary Restrictions:</p>
        <select multiple onChange={(e) => handleMultiSelect(e, 'dietaryRestrictions')}>
          {options.dietaryRestrictions.map((diet) => (
            <option key={diet} value={diet.toLowerCase()}>
              {diet}
            </option>
          ))}
        </select>

        <button type="submit" className="primary-btn">Find Restaurants</button>
      </form>
    </div>
  );
}

export default FindRestaurant;
