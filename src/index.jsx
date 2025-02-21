import React from 'react';
import { useParams } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter, Routes, Route, NavLink,
} from 'react-router';
import './style.scss';
import Counter from './components/counter';
import Controls from './components/controls';

function About(props) {
  return <div> All there is to know about me </div>;
}

function Nav(props) {
  return (
    <nav>
      <ul>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/test/id1">test id1</NavLink></li>
        <li><NavLink to="/test/id2">test id2</NavLink></li>
      </ul>
    </nav>
  );
}

function Test(props) {
  const { id } = useParams();
  return <div> ID: {id} </div>;
}

function Welcome(props) {
  return (
    <div>
      <h1>Welcome</h1>
      <Counter />
      <Controls />
    </div>
  );
}

function App(props) {
  return (
    <BrowserRouter>
      <div>
        <Nav />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/about" element={<About />} />
          <Route path="/test/:id" element={<Test />} />
          <Route path="*" element={<FallBack />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function FallBack() {
  return <div>404 - URL Not Found</div>;
}

const root = createRoot(document.getElementById('main'));
root.render(<App />);
