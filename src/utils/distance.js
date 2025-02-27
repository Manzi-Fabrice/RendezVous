// Calculate distance between two points using the Haversine formula
export function calculateDistance(point1, point2) {
  const R = 6371; // Earth's radius in km
  const lat1 = toRad(point1.lat);
  const lat2 = toRad(point2.lat);
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lng - point1.lng);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1) * Math.cos(lat2) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

function toRad(degrees) {
  return degrees * Math.PI / 180;
} 