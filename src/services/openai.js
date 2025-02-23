import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function getAIRecommendations(restaurants, userPreferences) {
  try {
    console.log('🤖 Calling OpenAI with preferences:', userPreferences);
    
    const messages = [
      {
        role: "system",
        content: `You are an expert restaurant concierge who specializes in personalized recommendations. 
        Consider atmosphere, price, location, and reviews when making suggestions.
        Format your response with clear sections:
        1. Top Recommendations (2-3 best matches)
        2. Why These Restaurants Match
        3. Additional Suggestions for Different Occasions`
      },
      {
        role: "user",
        content: `Given a user looking for:
        - Cuisine: ${userPreferences.cuisineTypes.join(', ')}
        - Vibe: ${userPreferences.vibePreferences.join(', ')}
        - Occasion: ${userPreferences.occasion}
        - Dietary needs: ${userPreferences.dietaryRestrictions.join(', ')}
        
        Analyze these restaurants and suggest the best matches:
        ${JSON.stringify(restaurants, null, 2)}`
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7, // Add some creativity
      max_tokens: 1000, // Longer response
      presence_penalty: 0.6, // Encourage diverse suggestions
      frequency_penalty: 0.6 // Avoid repetitive language
    });

    console.log('✨ OpenAI Response:', completion.choices[0].message.content);

    // Parse and structure the response
    const aiSuggestions = {
      topPicks: [],
      explanations: {},
      additionalSuggestions: []
    };

    // Parse AI response into structured format
    const response = completion.choices[0].message.content;

    // Parse the sections from AI response
    try {
      // Split response
      const sections = response.split(/\d+\./);
      
      // Parse top 
      aiSuggestions.topPicks = sections[1]
        ?.trim()
        .split('\n')
        .filter(line => line.length > 0);

      // Parse explanations
      aiSuggestions.explanations = sections[2]
        ?.trim()
        .split('\n')
        .filter(line => line.length > 0);

      // Parse additional suggestions
      aiSuggestions.additionalSuggestions = sections[3]
        ?.trim()
        .split('\n')
        .filter(line => line.length > 0);

      return aiSuggestions;
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Return raw response as fallback
      return { rawResponse: response };
    }
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return {
      error: 'Failed to get AI recommendations',
      details: error.message
    };
  }
} 