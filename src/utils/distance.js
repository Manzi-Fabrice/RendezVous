// Calculate distance between two points using the Haversine formula
export function calculateDistance(point1, point2) {
  const R = 6371; // Earth's radius in km
  const lat1 = point1.lat;
  const lon1 = point1.lng;
  const lat2 = point2[1];  // [lng, lat] format from Google Places
  const lon2 = point2[0];

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  return distance; // Returns distance in kilometers
}

function toRad(degrees) {
  return degrees * (Math.PI/180);
} 