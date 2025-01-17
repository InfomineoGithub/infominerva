import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import SearchPage from './components/SearchPage';
import AddSourcePage from './components/AddSourcePage';
import DataValidationPage from './components/DataValidation'; 
import UserManagementPage from './components/UserManagement';
import Leaderboard from './components/Leaderboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email.endsWith('@infomineo.com')) {
        setUser(user);
      } else if (user) {
        await signOut(auth);
        setUser(null);
        alert('Access restricted to @infomineo.com email addresses only.');
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = localStorage.getItem('userRole') === 'admin';

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/search" /> : <Login />} />
        <Route
          path="/search"
          element={user ? <SearchPage user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-source"
          element={user ? <AddSourcePage darkMode={darkMode} /> : <Navigate to="/login" />}
        />
        <Route
          path="/validate-data"
          element={
            user && isAdmin ? (
              <DataValidationPage darkMode={darkMode} />
            ) : (
              <Navigate to="/search" />
            )
          }
        />
        <Route
    path="/leaderboard"
    element={user ? <Leaderboard darkMode={darkMode} /> : <Navigate to="/login" />}
/>
         <Route
          path="/UserManagement"
          element={
            user && isAdmin ? (
              <UserManagementPage darkMode={darkMode} />
            ) : (
              <Navigate to="/search" />
            )
          }
        />
        <Route path="/" element={<Navigate to={user ? "/search" : "/login"} />} />
      </Routes>
      
    </Router>
  );
}

export default App;