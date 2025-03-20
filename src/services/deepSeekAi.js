import fetch from 'node-fetch';

export async function getAIRecommendations(restaurants, preferences) {
  try {
    const defaultPreferences = {
      cuisinePreferences: [],
      dietaryRestrictions: [],
      priceRangePreference: [],
      vibePreferences: [],
      minimumRating: 3.5,
      searchRadius: 5000,
      locationPreferences: {
        maxDistance: 10,
        preferredNeighborhoods: [],
        transitPreferred: false,
        requireParking: false,
        requireAccessibility: false
      }
    };

    const safePreferences = {
      ...defaultPreferences,
      ...preferences,
      locationPreferences: {
        ...defaultPreferences.locationPreferences,
        ...preferences?.locationPreferences
      }
    };
    const simplifiedRestaurants = restaurants.map(r => ({
      name: r.name,
      rating: r.rating,
      priceRange: r.priceRange,
      features: r.features,
      cuisineTypes: r.cuisineTypes,
      distance: r.distance.text,
      isOpenNow: r.isOpenNow,
      reviewCount: r.reviewCount
    }));

    const prompt = `Analyze these restaurants and provide EXACTLY 3 recommendations in this format:

    1. TOP RECOMMENDATIONS (exactly 3 lines starting with -)
    - [Name] - [Price] - [Features] - [Distance]
    - [Name] - [Price] - [Features] - [Distance]
    - [Name] - [Price] - [Features] - [Distance]

    2. MATCH EXPLANATIONS (exactly 3 lines starting with -)
    - [First restaurant explanation]
    - [Second restaurant explanation]
    - [Third restaurant explanation]

    3. ADDITIONAL SUGGESTIONS (exactly 3 lines starting with -)
    - Best time to visit: [suggestion]
    - Alternative options: [2-3 other restaurants]
    - Special tips: [relevant advice]

    Restaurants to analyze:
    ${JSON.stringify(simplifiedRestaurants, null, 2)}

    User preferences:
    - Atmosphere: ${safePreferences.vibePreferences?.join(', ') || 'Any'}
    - Price: ${safePreferences.priceRangePreference.join(' to ') || 'Any'}
    - Rating: ${safePreferences.minimumRating}+
    - Distance: ${safePreferences.locationPreferences.maxDistance}km max`;

    console.log('Deepseek API Request:', {
      prompt: prompt,
      restaurants: simplifiedRestaurants.length,
      preferences: {
        vibe: safePreferences.vibePreferences,
        price: safePreferences.priceRangePreference,
        rating: safePreferences.minimumRating
      }
    });

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk-8c2b7011a2e44205b98a07cd4ff7f1dc`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a restaurant recommendation expert focused on fine dining experiences.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: false,
        timeout: 30000
      })
    });


    const responseText = await response.text();
    if (!response.ok) {
      return getSmartFallbackRecommendations(restaurants, preferences);
    }

    try {
      const data = JSON.parse(responseText);
      const content = data.choices[0].message.content;
      const sections = content.split(/\d+\.\s+/);  // Split on "1. ", "2. ", etc.
      return {
        topPicks: sections[1]?.trim()
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.startsWith('-')),
        explanations: sections[2]?.trim()
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.startsWith('-')),
        additionalSuggestions: sections[3]?.trim()
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.startsWith('-'))
      };
    } catch (parseError) {
      return getSmartFallbackRecommendations(restaurants, preferences);
    }

  } catch (error) {
    return getSmartFallbackRecommendations(restaurants, preferences);
  }
}

function getSmartFallbackRecommendations(restaurants, preferences) {
  const scoredRestaurants = restaurants.map(restaurant => {
    let score = 0;

    if (preferences.vibePreferences?.includes('fine dining')) {
      if (restaurant.features.includes('Fine Dining')) {
        score += 5;
      }
      if (restaurant.priceRange === '$$$') {
        score += 3;
      }
    }
    score += restaurant.rating * (preferences.vibePreferences?.includes('fine dining') ? 3 : 2);
    if (preferences.priceRangePreference?.includes(restaurant.priceRange)) {
      score += 3;
    }
    const distanceScore = 5 - (restaurant.distance.value / 1);
    score += Math.max(0, distanceScore);

    return { ...restaurant, score };
  });

  // Sort by score and get top 3
  const topThree = scoredRestaurants
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return {
    topPicks: topThree.map(r =>
      `- ${r.name} - ${r.priceRange} - ${r.features.join(', ')} - ${r.distance.text}`
    ),
    explanations: topThree.map(r =>
      `- ${r.name} matches with ${r.rating}/5 rating, ${r.priceRange} price range, and ${r.distance.text} distance`
    ),
    additionalSuggestions: [
      `- Best time to visit: ${getVisitTimeSuggestion(topThree[0])}`,
      `- Alternative options: ${getAlternatives(restaurants, topThree)}`,
      `- Special tips: ${getSpecialTips(topThree[0])}`
    ]
  };
}

// Helper functions
function getVisitTimeSuggestion(restaurant) {
  if (restaurant.priceRange === '$$$') {
    return 'Dinner hours (6-9pm) for best atmosphere';
  }
  return 'Lunch hours (11:30am-2pm) for better value';
}

function getAlternatives(allRestaurants, topPicks) {
  const alternatives = allRestaurants
    .filter(r => !topPicks.find(t => t.name === r.name))
    .filter(r => r.rating >= 4.0)
    .slice(0, 2)
    .map(r => r.name)
    .join(' or ');
  return alternatives || 'No similar alternatives found';
}

function getSpecialTips(restaurant) {
  if (restaurant.features.includes('Fine Dining')) {
    return 'Reservations recommended';
  }
  if (restaurant.features.includes('Well Rated')) {
    return 'Popular spot, might have wait times during peak hours';
  }
  return 'Call ahead to check current wait times';
}