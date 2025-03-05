// src/services/geocode.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export async function geocodeAddress(cityName) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    }
    throw new Error(`Geocoding failed for "${cityName}". Status: ${data.status}`);
  } catch (error) {
    console.error('❌ Error geocoding city:', cityName, error);
    throw error;
  }
}
