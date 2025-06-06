import React, { useState } from 'react';
import { signInWithGoogle } from '../firebase';

function Login() {
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithGoogle();
      const email = userCredential.user.email;
      
      if (!email.endsWith('@infomineo.com')) {
        throw new Error('Invalid domain');
      }

      // Get user role from backend
      const apiUrl = process.env.REACT_APP_URL;
      const response = await fetch(`${apiUrl}/get_user_role?email=${encodeURIComponent(email)}`);
      // const response = await fetch(`http://localhost:8000/get_user_role?email=${encodeURIComponent(email)}`);
      const userData = await response.json();
      
      // Store role in localStorage for easy access
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('expertDomain', userData.expert_domain || '');

    } catch (error) {
      console.error("Error signing in with Google", error);
      if (error.message === 'Invalid domain') {
        setError('Sign-in failed. Please use an @infomineo.com email address.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled.');
      } else {
        setError('Sign-in failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-400 to-blue-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <div className="flex justify-center mb-6">
          <img 
            src={process.env.PUBLIC_URL + '/Infominerva.png'} 
            alt="Infominerva Logo" 
            className="h-16 object-contain"
          />
        </div>
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-600">Sign in to access the search tool</p>
        </div>
        <button
          onClick={handleSignIn}
          className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-md px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        <p className="mt-6 text-xs text-center text-gray-600">Access is restricted to @infomineo.com email addresses only.</p>
      </div>
    </div>
  );
}

export default Login;