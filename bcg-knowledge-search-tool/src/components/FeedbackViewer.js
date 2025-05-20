import React, { useEffect, useState } from 'react';
import { Loader, Download, Sun, Moon, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const FeedbackViewer = ({ user, darkMode, toggleDarkMode }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const apiUrl = process.env.REACT_APP_URL;
            const response = await fetch(`${apiUrl}get-feedback`);
            const data = await response.json();
            setFeedbacks(data || []);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = () => {
        signOut(auth).catch(console.error);
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} p-8`}>
            <div className={`max-w-6xl mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                {/* Header */}
                <header className="flex justify-between items-center mb-6">
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-sky-400' : 'text-sky-600'}`}>
                        Feedback Viewer
                    </h1>
                    <div className="flex items-center">
                        <Link to="/search" className={`mr-4 ${darkMode ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-700'}`}>
                            Back to Search
                        </Link>
                        {/* Download Button */}
                        <a
                            href={`${process.env.REACT_APP_URL}download-feedback`}
                            className={`inline-flex items-center px-4 py-2 rounded ${darkMode ? 'bg-sky-600 hover:bg-sky-700' : 'bg-sky-500 hover:bg-sky-600'} text-white`}
                            download
                        >
                            <Download className="h-5 w-5 mr-2" />
                            Download Feedback CSV
                        </a>
                        <button onClick={toggleDarkMode} className={`mr-4 p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}>
                            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <User className={`h-8 w-8 ${darkMode ? 'text-gray-300' : 'text-gray-500'} mr-2`} />
                        <span>{user?.displayName}</span>
                        <button onClick={handleSignOut} className={`ml-4 px-3 py-1 rounded ${darkMode ? 'bg-sky-600' : 'bg-sky-500'} text-white`}>
                            Sign Out
                        </button>
                    </div>
                </header>

                {/* Feedback Table */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader className="h-8 w-8 animate-spin text-sky-500" />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-lg border border-gray-200 mb-4">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-medium">Feedback</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium">Timestamp</th>
                                </tr>
                                </thead>
                                <tbody>
                                {feedbacks.map((entry, index) => (
                                    <tr key={index} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                                        <td className="px-4 py-2 text-sm">{entry.feedback}</td>
                                        <td className="px-4 py-2 text-sm">{entry.time}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FeedbackViewer;
