import React from 'react';
import {
  BrowserRouter as Router, Routes, Route, Link,
} from 'react-router-dom';
import Header from './components/header';
import Home from './components/home';
import EventsList from './components/EventsList';
import FindRestaurant from './components/FindRestaurant';
import RestaurantResults from './components/RestaurantResults';
import CreateUser from './components/CreateUser';
import './style.scss';

function App() {
  return (
    <Router>
      <Header />
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/find-restaurant">Find Restaurant</Link>
      </nav>
      <Routes>
        <Route
          path="/"
          element={(
            <div className="page-container">
              <Home />
              <CreateUser />
            </div>
          )}
        />
        <Route path="/events" element={<EventsList />} />
        <Route path="/find-restaurant" element={<FindRestaurant />} />
        <Route path="/restaurant-results" element={<RestaurantResults />} />
      </Routes>
    </Router>
  );
}

export default App;
