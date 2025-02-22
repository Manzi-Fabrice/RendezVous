import React, { useEffect } from 'react';
import useUserStore from '../store/userStore';

function Home() {
  const { users, loadUsers } = useUserStore();

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <h2>Users List</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
