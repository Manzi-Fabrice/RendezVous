import React from 'react';

const UsersList = ({ users }) => {
  return (
    <ul>
      {users.map(user => (
        <li key={user._id}>{user.name}</li>
      ))}
    </ul>
  );
};

export default UsersList;
