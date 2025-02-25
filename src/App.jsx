import React from 'react';
import Header from './components/header';
import Home from './components/home';
import EventsList from './components/EventsList';
import CreateUser from './components/CreateUser';
import ActivitiesList from './components/ActivitiesList';
import RestaurantFinder from './components/RestuarantFinder';
import './style.scss';

function App() {
  return (
    <div>
      <Header />
      <Home />
      <CreateUser />
      <EventsList />
      <ActivitiesList />
      <RestaurantFinder />
    </div>
  );
}

export default App;
