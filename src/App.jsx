import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Home, Users } from 'lucide-react';
import UserSubmissionForm from './UserSubmissionForm';
import AdminDashboard from './AdminDashboard';

const Navigation = () => (
  <nav className="bg-gray-800 text-white p-4">
    <div className="max-w-6xl mx-auto flex justify-between items-center">
      <div className="text-xl font-bold">Social Media</div>
      <div className="flex gap-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <Home size={20} />
          Submit
        </Link>
        <Link 
          to="/admin" 
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <Users size={20} />
          Admin
        </Link>
      </div>
    </div>
  </nav>
);

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <main className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<UserSubmissionForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;