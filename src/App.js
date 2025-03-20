import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InvitationPage from './InvitationPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/invitation" element={<InvitationPage />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </div>
  );
}
export default App;
