import React from 'react';
import Header from './components/header';
import Home from './components/home';
import EventsList from './components/EventsList';
import CreateUser from './components/CreateUser';
import ActivitiesList from './components/ActivitiesList';

function App() {
  return (
    <div>
      <Header />
      <Home />
      <CreateUser />
      <EventsList />
      <ActivitiesList />
    </div>
  );
}

export default App;
