import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import SearchPage from './components/SearchPage';
import AddSourcePage from './components/AddSourcePage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize darkMode from localStorage or default to false
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email.endsWith('@infomineo.com')) {
        setUser(user);
      } else if (user) {
        signOut(auth).then(() => {
          setUser(null);
          alert('Access restricted to @infomineo.com email addresses only.');
        }).catch((error) => {
          console.error("Error signing out", error);
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Update localStorage when darkMode changes
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

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
  path="/search"
  element={user ? <SearchPage user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> : <Navigate to="/login" />}
/>
        <Route path="/" element={<Navigate to={user ? "/search" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;