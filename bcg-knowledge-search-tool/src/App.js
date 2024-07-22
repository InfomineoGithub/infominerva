import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import SearchPage from './components/SearchPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email.endsWith('@infomineo.com')) {
        setUser(user);
      } else if (user) {
        // User is signed in but not with an @infomineo.com email
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/search" /> : <Login />} />
        <Route
          path="/search"
          element={user ? <SearchPage user={user} /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to={user ? "/search" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;