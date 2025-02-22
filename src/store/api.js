export const API_URL = 'https://project-api-sustainable-waste.onrender.com/';

export const fetchUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  return response.json();
};
